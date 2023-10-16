import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers'
import { assert, expect } from 'chai'
import { ethers } from 'hardhat'
import { defaultContentUri, defaultDepositFee, defaultMaxParticipants, defaultTokenFee, defaultTokenMint } from './utils/types'

describe('Registry', function () {
  async function deployFixture() {
    const [owner, attendee1, attendee2, attendee3, attendee4, attendee5] = await ethers.getSigners()
    const tomorrow = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(1)
    const nextWeek = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(7)

    const Registry = await ethers.getContractFactory('Registry')
    const registry = await Registry.deploy()
    console.log('Registry deployed to:', registry.address)

    const BasicEther = await ethers.getContractFactory('BasicEther')
    const basicEtherModule = await BasicEther.deploy()
    console.log('BasicEther Module deployed to:', basicEtherModule.address)

    const BasicToken = await ethers.getContractFactory('BasicToken')
    const basicTokenModule = await BasicToken.deploy()
    console.log('BasicToken Module deployed to:', basicTokenModule.address)

    await registry.whitelistConditionModule(basicEtherModule.address, true)
    await registry.whitelistConditionModule(basicTokenModule.address, true)

    const Token = await ethers.getContractFactory('Token')
    const token = await Token.deploy()
    console.log('Token deployed to:', token.address)

    await token.mint(attendee1.address, defaultTokenMint)
    await token.mint(attendee2.address, defaultTokenMint)
    await token.mint(attendee3.address, defaultTokenMint)
    await token.mint(attendee4.address, defaultTokenMint)
    await token.mint(attendee5.address, defaultTokenMint)

    return { registry, tomorrow, nextWeek, owner, attendee1, attendee2, attendee3, attendee4, attendee5, basicEtherModule, basicTokenModule, token }
  }

  async function createEtherFixture() {
    const { registry, tomorrow, owner, basicEtherModule } = await loadFixture(deployFixture)

    const params = ethers.utils.defaultAbiCoder.encode(
      ["address", 'uint256', 'uint256', 'uint256', 'address'],
      [owner.address, tomorrow, defaultDepositFee, defaultMaxParticipants, ethers.constants.AddressZero])

    await registry.create(defaultContentUri, basicEtherModule.address, params)
  }

  async function createTokenFixture() {
    const { registry, tomorrow, owner, basicTokenModule, token } = await loadFixture(deployFixture)

    const params = ethers.utils.defaultAbiCoder.encode(
      ["address", 'uint256', 'uint256', 'uint256', 'address'],
      [owner.address, tomorrow, defaultDepositFee, defaultMaxParticipants, token.address])

    await registry.create(defaultContentUri, basicTokenModule.address, params)
  }

  describe('Deployment', function () {
    it('Should deploy a new instance', async function () {
      const { registry, basicEtherModule, owner, token } = await loadFixture(deployFixture)

      assert.isNotNull(registry)
      assert.isNotNull(basicEtherModule)
      expect(await registry.owner()).to.be.equal(owner.address)

      const isWhitelisted = await registry.isConditionModuleWhitelisted(basicEtherModule.address)
      expect(isWhitelisted).to.be.true
    })

    it('Should add modules to whitelist', async function () {
      const { registry, owner, token } = await loadFixture(deployFixture)

      const tokenTx = await registry.whitelistConditionModule(token.address, true) // token; invalid module, but should emit event
      expect(tokenTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(tokenTx).to.emit(registry, "ConditionModuleWhitelisted")
        .withArgs(token.address, true, owner, timestamp)

      const isWhitelisted = await registry.isConditionModuleWhitelisted(token.address)
      expect(isWhitelisted).to.be.true
    })
  })

  describe('State', function () {
    it('Should allow owner to cancel', async function () {
      const { registry, owner } = await loadFixture(deployFixture)
      await loadFixture(createEtherFixture)

      const reason = 'Cancelled by owner'
      const cancelTx = await registry.cancel(0, reason, [])

      const timestamp = await time.latest();
      expect(cancelTx).to.emit(registry, "Cancelled")
        .withArgs(0, reason, owner, timestamp)
    })

    // Should not allow to cancel if already cancelled
    // Should not allow to cancel if already has attendees
    // Should not allow to cancel if endDate has passed 

    it('Should disperse Ether funds when cancelling an event with registrations ', async function () {
      const { registry, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createEtherFixture)

      await registry.connect(attendee1).register(0, ethers.utils.defaultAbiCoder.encode(["address"], [attendee1.address]), { value: defaultDepositFee })
      await registry.connect(attendee2).register(0, ethers.utils.defaultAbiCoder.encode(["address"], [attendee2.address]), { value: defaultDepositFee })

      const attendee1BalanceBefore = await attendee1.getBalance()
      const attendee2BalanceBefore = await attendee2.getBalance()

      await registry.cancel(0, 'Cancelled by owner', [])

      const attendee1BalanceAfter = await attendee1.getBalance()
      const attendee2BalanceAfter = await attendee2.getBalance()

      expect(attendee1BalanceBefore).to.be.lessThan(attendee1BalanceAfter)
      expect(attendee2BalanceBefore).to.be.lessThan(attendee2BalanceAfter)
    })

    it('Should disperse Token funds when cancelling an event with registrations ', async function () {
      const { registry, attendee1, attendee2, basicTokenModule, token } = await loadFixture(deployFixture)
      await loadFixture(createTokenFixture)

      await token.connect(attendee1).approve(basicTokenModule.address, defaultTokenFee);
      await token.connect(attendee2).approve(basicTokenModule.address, defaultTokenFee);

      await registry.connect(attendee1).register(0, ethers.utils.defaultAbiCoder.encode(["address"], [attendee1.address]))
      await registry.connect(attendee2).register(0, ethers.utils.defaultAbiCoder.encode(["address"], [attendee2.address]))

      const attendee1BalanceBefore = await token.balanceOf(attendee1.address)
      const attendee2BalanceBefore = await token.balanceOf(attendee2.address)

      await registry.cancel(0, 'Cancelled by owner', [])

      const attendee1BalanceAfter = await token.balanceOf(attendee1.address)
      const attendee2BalanceAfter = await token.balanceOf(attendee2.address)

      expect(attendee1BalanceBefore).to.be.lessThan(attendee1BalanceAfter)
      expect(attendee2BalanceBefore).to.be.lessThan(attendee2BalanceAfter)
    })

    it('Should allow to register when no max. participants is set', async function () {
      const { registry, tomorrow, owner, basicEtherModule } = await loadFixture(deployFixture)

      const params = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'uint256', 'uint256', 'address'],
        [owner.address, tomorrow, defaultDepositFee, 0, ethers.constants.AddressZero])

      await registry.create(defaultContentUri, basicEtherModule.address, params)

      const registerTx = await registry.register(0, ethers.utils.defaultAbiCoder.encode(["address"], [owner.address]), { value: defaultDepositFee })
      expect(registerTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(registerTx).to.emit(registry, "Registered")
        .withArgs(0, owner.address, owner.address, timestamp)
    })
  })

  describe('Negatives', function () {
    it('Should reject when creating with an empty condition module', async function () {
      const { registry, tomorrow, owner } = await loadFixture(deployFixture)

      const params = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'uint256', 'uint256', 'address'],
        [owner.address, tomorrow, defaultDepositFee, defaultMaxParticipants, ethers.constants.AddressZero])

      await expect(registry.create(defaultContentUri, ethers.constants.AddressZero, params))
        .to.be.revertedWithCustomError(registry, 'NotFound')
    })

    it('Should reject when creating with an invalid condition module', async function () {
      const { registry, tomorrow, owner } = await loadFixture(deployFixture)

      const params = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'uint256', 'uint256', 'address'],
        [owner.address, tomorrow, defaultDepositFee, defaultMaxParticipants, ethers.constants.AddressZero])

      await expect(registry.create(defaultContentUri, registry.address, params))
        .to.be.revertedWithCustomError(registry, 'NotWhitelisted')
    })

    it('Should reject when registering for invalid id', async function () {
      const { registry, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createEtherFixture)

      await expect(registry.register(123, attendee1.address, { value: defaultDepositFee }))
        .to.be.revertedWithCustomError(registry, 'NotFound')
    })

    it('Should reject if already registered', async function () {
      const { registry, basicEtherModule, owner } = await loadFixture(deployFixture)
      await loadFixture(createEtherFixture)

      await registry.register(0, ethers.utils.defaultAbiCoder.encode(["address"], [owner.address]), { value: defaultDepositFee })
      await expect(registry.register(0, ethers.utils.defaultAbiCoder.encode(["address"], [owner.address]), { value: defaultDepositFee }))
        .to.be.revertedWithCustomError(basicEtherModule, 'AlreadyRegistered')
    })

    it('Should reject above participation limit', async function () {
      const { registry, owner, basicEtherModule, tomorrow, attendee1, attendee2, attendee3 } = await loadFixture(deployFixture)

      const params = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'uint256', 'uint256', 'address'],
        [owner.address, tomorrow, defaultDepositFee, 2, ethers.constants.AddressZero])
      await registry.create(defaultContentUri, basicEtherModule.address, params)

      await registry.register(0, ethers.utils.defaultAbiCoder.encode(["address"], [attendee1.address]), { value: defaultDepositFee })
      await registry.register(0, ethers.utils.defaultAbiCoder.encode(["address"], [attendee2.address]), { value: defaultDepositFee })

      await expect(registry.register(0, ethers.utils.defaultAbiCoder.encode(["address"], [attendee3.address]), { value: defaultDepositFee }))
        .to.be.revertedWithCustomError(basicEtherModule, 'LimitReached')
    })

    it('Should reject if non-owner tries to cancel', async function () {
      const { registry, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createEtherFixture)

      await expect(registry.connect(attendee1).cancel(0, 'Cancelled by attendee', []))
        .to.be.revertedWithCustomError(registry, 'AccessDenied')
    })

    it('Should reject if cancelling an event that has attendees checked in ', async function () {
      const { registry, basicEtherModule, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createEtherFixture)

      await registry.connect(attendee1).register(0, ethers.utils.defaultAbiCoder.encode(["address"], [attendee1.address]), { value: defaultDepositFee })
      await registry.connect(attendee2).register(0, ethers.utils.defaultAbiCoder.encode(["address"], [attendee2.address]), { value: defaultDepositFee })
      await registry.checkin(0, [attendee1.address, attendee2.address], [])

      await expect(registry.cancel(0, 'Cancelled by owner', []))
        .to.be.revertedWithCustomError(basicEtherModule, 'AlreadyStarted')
    })

    it('Should reject if registering for a cancelled event', async function () {
      const { registry, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createEtherFixture)

      await registry.cancel(0, 'Cancelled by attendee', [])

      await expect(registry.register(0, attendee1.address, { value: defaultDepositFee }))
        .to.be.revertedWithCustomError(registry, 'InactiveRecord')
    })

    it('Should reject if checking in for a cancelled event', async function () {
      const { registry, owner } = await loadFixture(deployFixture)
      await loadFixture(createEtherFixture)

      await registry.cancel(0, 'Cancelled by attendee', [])

      const ownerParams = ethers.utils.defaultAbiCoder.encode(["address"], [owner.address])
      await expect(registry.connect(owner).register(0, ownerParams, { value: defaultDepositFee }))
        .to.be.revertedWithCustomError(registry, 'InactiveRecord')
    })

    it('Should reject if settling a cancelled event', async function () {
      const { registry } = await loadFixture(deployFixture)
      await loadFixture(createEtherFixture)

      await registry.cancel(0, 'Cancelled by attendee', [])

      await expect(registry.settle(0, []))
        .to.be.revertedWithCustomError(registry, 'InactiveRecord')
    })

    it('Should reject if settling an invalid id', async function () {
      const { registry } = await loadFixture(deployFixture)

      await loadFixture(createEtherFixture)

      await registry.cancel(0, 'Cancelled by attendee', [])

      await expect(registry.settle(123, []))
        .to.be.revertedWithCustomError(registry, 'NotFound')
    })
  })
})
