import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers'
import { assert, expect } from 'chai'
import { ethers } from 'hardhat'
import { defaultContentUri, defaultDepositFee, defaultMaxParticipants, defaultTokenFee, defaultTokenMint } from './utils/types'

describe('ShowHub', function () {
  async function deployFixture() {
    const [owner, attendee1, attendee2, attendee3, attendee4, attendee5] = await ethers.getSigners()
    const tomorrow = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(1)
    const nextWeek = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(7)

    const ShowHub = await ethers.getContractFactory('ShowHub')
    const showhub = await ShowHub.deploy()
    console.log('ShowHub deployed to:', showhub.address)

    const SplitEther = await ethers.getContractFactory('SplitEther')
    const splitEtherModule = await SplitEther.deploy(showhub.address)
    console.log('SplitEther Module deployed to:', splitEtherModule.address)

    const SplitToken = await ethers.getContractFactory('SplitToken')
    const splitTokenModule = await SplitToken.deploy(showhub.address)
    console.log('SplitToken Module deployed to:', splitTokenModule.address)

    await showhub.whitelistConditionModule(splitEtherModule.address, true)
    await showhub.whitelistConditionModule(splitTokenModule.address, true)

    const Token = await ethers.getContractFactory('Token')
    const token = await Token.deploy()
    console.log('Token deployed to:', token.address)

    await token.mint(attendee1.address, defaultTokenMint)
    await token.mint(attendee2.address, defaultTokenMint)
    await token.mint(attendee3.address, defaultTokenMint)
    await token.mint(attendee4.address, defaultTokenMint)
    await token.mint(attendee5.address, defaultTokenMint)

    return { showhub, tomorrow, nextWeek, owner, attendee1, attendee2, attendee3, attendee4, attendee5, splitEtherModule, splitTokenModule, token }
  }

  async function createEtherFixture() {
    const { showhub, tomorrow, owner, splitEtherModule } = await loadFixture(deployFixture)

    const params = ethers.utils.defaultAbiCoder.encode(
      ["address", 'uint256'],
      [owner.address, defaultDepositFee])

    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, splitEtherModule.address, params)
  }

  async function createTokenFixture() {
    const { showhub, tomorrow, owner, splitTokenModule, token } = await loadFixture(deployFixture)

    const params = ethers.utils.defaultAbiCoder.encode(
      ["address", 'uint256', 'address'],
      [owner.address, defaultDepositFee, token.address])

    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, splitTokenModule.address, params)
  }

  describe('Deployment', function () {
    it('Should deploy a new instance', async function () {
      const { showhub, splitEtherModule, owner, token } = await loadFixture(deployFixture)

      assert.isNotNull(showhub)
      assert.isNotNull(splitEtherModule)
      expect(await showhub.owner()).to.be.equal(owner.address)

      const isWhitelisted = await showhub.isConditionModuleWhitelisted(splitEtherModule.address)
      expect(isWhitelisted).to.be.true
    })

    it('Should add modules to whitelist', async function () {
      const { showhub, owner, token } = await loadFixture(deployFixture)

      const tokenTx = await showhub.whitelistConditionModule(token.address, true) // token; invalid module, but should emit event
      expect(tokenTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(tokenTx).to.emit(showhub, "ConditionModuleWhitelisted")
        .withArgs(token.address, true, owner, timestamp)

      const isWhitelisted = await showhub.isConditionModuleWhitelisted(token.address)
      expect(isWhitelisted).to.be.true
    })
  })

  describe('State', function () {
    it('Should allow owner to cancel', async function () {
      const { showhub, owner } = await loadFixture(deployFixture)
      await loadFixture(createEtherFixture)

      const reason = 'Cancelled by owner'
      const cancelTx = await showhub.cancel(0, reason, [])

      const timestamp = await time.latest();
      expect(cancelTx).to.emit(showhub, "Cancelled")
        .withArgs(0, reason, owner, timestamp)
    })

    // Should not allow to cancel if already cancelled
    // Should not allow to cancel if already has attendees
    // Should not allow to cancel if endDate has passed 

    it('Should disperse Ether funds when cancelling an event with registrations ', async function () {
      const { showhub, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createEtherFixture)

      await showhub.connect(attendee1).register(0, attendee1.address, [], { value: defaultDepositFee })
      await showhub.connect(attendee2).register(0, attendee2.address, [], { value: defaultDepositFee })

      const attendee1BalanceBefore = await attendee1.getBalance()
      const attendee2BalanceBefore = await attendee2.getBalance()

      await showhub.cancel(0, 'Cancelled by owner', [])

      const attendee1BalanceAfter = await attendee1.getBalance()
      const attendee2BalanceAfter = await attendee2.getBalance()

      expect(attendee1BalanceBefore).to.be.lessThan(attendee1BalanceAfter)
      expect(attendee2BalanceBefore).to.be.lessThan(attendee2BalanceAfter)
    })

    it('Should disperse Token funds when cancelling an event with registrations ', async function () {
      const { showhub, attendee1, attendee2, splitTokenModule, token } = await loadFixture(deployFixture)
      await loadFixture(createTokenFixture)

      await token.connect(attendee1).approve(splitTokenModule.address, defaultTokenFee);
      await token.connect(attendee2).approve(splitTokenModule.address, defaultTokenFee);

      await showhub.connect(attendee1).register(0, attendee1.address, [])
      await showhub.connect(attendee2).register(0, attendee2.address, [])

      const attendee1BalanceBefore = await token.balanceOf(attendee1.address)
      const attendee2BalanceBefore = await token.balanceOf(attendee2.address)

      await showhub.cancel(0, 'Cancelled by owner', [])

      const attendee1BalanceAfter = await token.balanceOf(attendee1.address)
      const attendee2BalanceAfter = await token.balanceOf(attendee2.address)

      expect(attendee1BalanceBefore).to.be.lessThan(attendee1BalanceAfter)
      expect(attendee2BalanceBefore).to.be.lessThan(attendee2BalanceAfter)
    })

    it('Should allow to register when no max. participants is set', async function () {
      const { showhub, tomorrow, owner, splitEtherModule } = await loadFixture(deployFixture)

      const params = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256'],
        [owner.address, defaultDepositFee])

      await showhub.create(defaultContentUri, tomorrow, 0, splitEtherModule.address, params)

      const registerTx = await showhub.register(0, owner.address, [], { value: defaultDepositFee })
      expect(registerTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(registerTx).to.emit(showhub, "Registered")
        .withArgs(0, owner.address, owner.address, timestamp)
    })
  })

  describe('Negatives', function () {
    it('Should reject when creating with an empty condition module', async function () {
      const { showhub, tomorrow, owner } = await loadFixture(deployFixture)

      const params = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256'],
        [owner.address, defaultDepositFee])

      await expect(showhub.create(defaultContentUri, tomorrow, 0, ethers.constants.AddressZero, params))
        .to.be.revertedWithCustomError(showhub, 'NotFound')
    })

    it('Should reject when creating with an invalid condition module', async function () {
      const { showhub, tomorrow, owner } = await loadFixture(deployFixture)

      const params = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256'],
        [owner.address, defaultDepositFee])

      await expect(showhub.create(defaultContentUri, tomorrow, 0, showhub.address, params))
        .to.be.revertedWithCustomError(showhub, 'NotWhitelisted')
    })

    it('Should reject when registering for invalid id', async function () {
      const { showhub, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createEtherFixture)

      await expect(showhub.register(123, attendee1.address, [], { value: defaultDepositFee }))
        .to.be.revertedWithCustomError(showhub, 'NotFound')
    })

    it('Should reject if already registered', async function () {
      const { showhub, owner } = await loadFixture(deployFixture)
      await loadFixture(createEtherFixture)

      await showhub.register(0, owner.address, [], { value: defaultDepositFee })
      await expect(showhub.register(0, owner.address, [], { value: defaultDepositFee }))
        .to.be.revertedWithCustomError(showhub, 'AlreadyRegistered')
    })

    it('Should reject above participation limit', async function () {
      const { showhub, owner, splitEtherModule, tomorrow, attendee1, attendee2, attendee3 } = await loadFixture(deployFixture)

      const params = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256'],
        [owner.address, defaultDepositFee])
      await showhub.create(defaultContentUri, tomorrow, 2, splitEtherModule.address, params)

      await showhub.register(0, attendee1.address, [], { value: defaultDepositFee })
      await showhub.register(0, attendee2.address, [], { value: defaultDepositFee })

      await expect(showhub.register(0, attendee3.address, [], { value: defaultDepositFee }))
        .to.be.revertedWithCustomError(showhub, 'LimitReached')
    })

    it('Should reject if non-owner tries to cancel', async function () {
      const { showhub, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createEtherFixture)

      await expect(showhub.connect(attendee1).cancel(0, 'Cancelled by attendee', []))
        .to.be.revertedWithCustomError(showhub, 'AccessDenied')
    })

    it('Should reject if cancelling an event that has attendees checked in ', async function () {
      const { showhub, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createEtherFixture)

      await showhub.connect(attendee1).register(0, attendee1.address, [], { value: defaultDepositFee })
      await showhub.connect(attendee2).register(0, attendee2.address, [], { value: defaultDepositFee })
      await showhub.checkin(0, [attendee1.address, attendee2.address], [])

      await expect(showhub.cancel(0, 'Cancelled by owner', []))
        .to.be.revertedWithCustomError(showhub, 'AlreadyStarted')
    })

    it('Should reject if registering for a cancelled event', async function () {
      const { showhub, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createEtherFixture)

      await showhub.cancel(0, 'Cancelled by attendee', [])

      await expect(showhub.register(0, attendee1.address, [], { value: defaultDepositFee }))
        .to.be.revertedWithCustomError(showhub, 'InactiveRecord')
    })

    it('Should reject if checking in for a cancelled event', async function () {
      const { showhub, owner } = await loadFixture(deployFixture)
      await loadFixture(createEtherFixture)

      await showhub.cancel(0, 'Cancelled by attendee', [])

      await expect(showhub.connect(owner).register(0, owner.address, [], { value: defaultDepositFee }))
        .to.be.revertedWithCustomError(showhub, 'InactiveRecord')
    })

    it('Should reject if settling a cancelled event', async function () {
      const { showhub } = await loadFixture(deployFixture)
      await loadFixture(createEtherFixture)

      await showhub.cancel(0, 'Cancelled by attendee', [])

      await expect(showhub.settle(0, []))
        .to.be.revertedWithCustomError(showhub, 'InactiveRecord')
    })

    it('Should reject if settling an invalid id', async function () {
      const { showhub } = await loadFixture(deployFixture)

      await loadFixture(createEtherFixture)

      await showhub.cancel(0, 'Cancelled by attendee', [])

      await expect(showhub.settle(123, []))
        .to.be.revertedWithCustomError(showhub, 'NotFound')
    })
  })
})
