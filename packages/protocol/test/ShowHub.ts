import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { assert, expect } from 'chai'
import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'

const defaultContentUri = 'ipfs://0xCID...'
const defaultEtherFee = ethers.utils.parseUnits('0.02', 18)
const defaultTokenFee = BigNumber.from('2000000000000000000') // 2 ether
const defaultTokenMint = BigNumber.from('100000000000000000000') // 100 ether
const defaultMaxParticipants = 100

describe('ShowHub', function () {
  async function deployFixture() {
    const [owner, attendee1, attendee2, attendee3, attendee4, attendee5] = await ethers.getSigners()
    const tomorrow = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(1)

    const ShowHub = await ethers.getContractFactory('ShowHub')
    const showhub = await ShowHub.deploy()
    console.log('ShowHub deployed to:', showhub.address)

    const Token = await ethers.getContractFactory('Token')
    const token = await Token.deploy()
    console.log('Token deployed to:', token.address)

    await token.mint(attendee1.address, defaultTokenMint)
    await token.mint(attendee2.address, defaultTokenMint)
    await token.mint(attendee3.address, defaultTokenMint)
    await token.mint(attendee4.address, defaultTokenMint)
    await token.mint(attendee5.address, defaultTokenMint)

    return { showhub, tomorrow, owner, attendee1, attendee2, attendee3, attendee4, attendee5, token }
  }

  describe('Deployment', function () {
    it('Should deploy a new instance', async function () {
      const { showhub } = await loadFixture(deployFixture)

      assert.isNotNull(showhub)
    })
  })

  describe('Create EtherDeposit', function () {
    it('Should allow to create an event', async function () {
      const { showhub, tomorrow, owner } = await loadFixture(deployFixture)

      const createTx = await showhub.createWithEther(defaultContentUri, tomorrow, defaultEtherFee, defaultMaxParticipants)
      expect(createTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(createTx).to.emit(showhub, "Created")
        .withArgs(0, owner, timestamp)
    })

    it('Should allow to register yourself', async function () {
      const { showhub, tomorrow, owner } = await loadFixture(deployFixture)

      const createTx = await showhub.createWithEther(defaultContentUri, tomorrow, defaultEtherFee, defaultMaxParticipants)
      expect(createTx).not.to.be.reverted

      const registerTx = await showhub.register(0, owner.address, { value: defaultEtherFee })
      expect(registerTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(registerTx).to.emit(showhub, "Registered")
        .withArgs(0, owner.address, owner.address, timestamp)
    })

    it('Should allow to register someone else', async function () {
      const { showhub, tomorrow, owner, attendee1 } = await loadFixture(deployFixture)

      const createTx = await showhub.createWithEther(defaultContentUri, tomorrow, defaultEtherFee, defaultMaxParticipants)
      expect(createTx).not.to.be.reverted

      const registerTx = await showhub.register(0, attendee1.address, { value: defaultEtherFee })
      expect(registerTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(registerTx).to.emit(showhub, "Registered")
        .withArgs(0, owner.address, owner.address, timestamp)
    })

    it('Should allow to settle an event', async function () {
      const { showhub, tomorrow, owner, attendee1, attendee2 } = await loadFixture(deployFixture)

      await showhub.createWithEther(defaultContentUri, tomorrow, defaultEtherFee, defaultMaxParticipants)
      await showhub.connect(owner).register(0, owner.address, { value: defaultEtherFee })
      await showhub.connect(attendee1).register(0, attendee1.address, { value: defaultEtherFee })
      await showhub.connect(attendee2).register(0, attendee2.address, { value: defaultEtherFee })

      const ownerBalanceBefore = await owner.getBalance()
      const attendee1BalanceBefore = await attendee1.getBalance()
      const attendee2BalanceBefore = await attendee2.getBalance()

      await time.increaseTo(tomorrow + time.duration.hours(1))
      const settleTx = await showhub.settle(0, [attendee1.address, attendee2.address])
      expect(settleTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(settleTx).to.emit(showhub, "Settled")
        .withArgs(0, owner.address, timestamp)

      const ownerBalanceAfter = await owner.getBalance()
      const attendee1BalanceAfter = await attendee1.getBalance()
      const attendee2BalanceAfter = await attendee2.getBalance()

      // Owner did not check in but pay for gas costs
      expect(ownerBalanceBefore).to.be.greaterThan(ownerBalanceAfter)
      // Pot is split between attendees
      expect(attendee1BalanceBefore).to.be.lessThan(attendee1BalanceAfter)
      expect(attendee2BalanceBefore).to.be.lessThan(attendee2BalanceAfter)
    })
  })

  describe('Create TokenDeposit', function () {
    it('Should allow to create an event with ERC20 token', async function () {
      const { showhub, tomorrow, owner, token } = await loadFixture(deployFixture)

      const createTx = await showhub.createWithToken(defaultContentUri, tomorrow, defaultTokenFee, defaultMaxParticipants, token.address)
      expect(createTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(createTx).to.emit(showhub, "Created")
        .withArgs(0, owner, timestamp)
    })

    it('Should allow to register yourself with ERC20 token', async function () {
      const { showhub, tomorrow, owner, token } = await loadFixture(deployFixture)

      const createTx = await showhub.createWithToken(defaultContentUri, tomorrow, defaultTokenFee, defaultMaxParticipants, token.address)
      expect(createTx).not.to.be.reverted

      await token.approve(showhub.address, defaultTokenFee, { from: owner.address });

      const registerTx = await showhub.register(0, owner.address)
      expect(registerTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(registerTx).to.emit(showhub, "Registered")
        .withArgs(0, owner.address, owner.address, timestamp)
    })

    it('Should allow to register someone else with ERC20 token', async function () {
      const { showhub, tomorrow, owner, token, attendee1 } = await loadFixture(deployFixture)

      const createTx = await showhub.createWithToken(defaultContentUri, tomorrow, defaultTokenFee, defaultMaxParticipants, token.address)
      expect(createTx).not.to.be.reverted

      await token.approve(showhub.address, defaultTokenFee, { from: owner.address });

      const registerTx = await showhub.register(0, attendee1.address)
      expect(registerTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(registerTx).to.emit(showhub, "Registered")
        .withArgs(0, owner.address, owner.address, timestamp)
    })

    it('Should allow to settle an event with ERC20 token', async function () {
      const { showhub, tomorrow, owner, token, attendee1, attendee2 } = await loadFixture(deployFixture)

      await showhub.createWithToken(defaultContentUri, tomorrow, defaultTokenFee, defaultMaxParticipants, token.address)

      await token.approve(showhub.address, defaultTokenFee.mul(3), { from: owner.address });

      await showhub.register(0, owner.address)
      await showhub.register(0, attendee1.address)
      await showhub.register(0, attendee2.address)

      const ownerBalanceBefore = await token.balanceOf(owner.address)
      const attendee1BalanceBefore = await token.balanceOf(attendee1.address)
      const attendee2BalanceBefore = await token.balanceOf(attendee2.address)

      await time.increaseTo(tomorrow + time.duration.hours(1))
      const settleTx = await showhub.settle(0, [attendee1.address, attendee2.address])
      expect(settleTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(settleTx).to.emit(showhub, "Settled")
        .withArgs(0, owner.address, timestamp)

      const ownerBalanceAfter = await token.balanceOf(owner.address)
      const attendee1BalanceAfter = await token.balanceOf(attendee1.address)
      const attendee2BalanceAfter = await token.balanceOf(attendee2.address)

      // Owner did not check in. ERC20 transfer do not cost gas
      expect(ownerBalanceBefore).to.be.equal(ownerBalanceAfter)
      // Pot is split between attendees
      expect(attendee1BalanceBefore).to.be.lessThan(attendee1BalanceAfter)
      expect(attendee2BalanceBefore).to.be.lessThan(attendee2BalanceAfter)
    })
  })

  describe('State', function () {
    it('Should allow owner to cancel', async function () {
      const { showhub, tomorrow, owner } = await loadFixture(deployFixture)

      const createTx = await showhub.createWithEther(defaultContentUri, tomorrow, defaultEtherFee, 2)
      expect(createTx).not.to.be.reverted

      const reason = 'Cancelled by owner'
      const cancelTx = await showhub.cancel(0, reason)

      const timestamp = await time.latest();
      expect(cancelTx).to.emit(showhub, "Cancelled")
        .withArgs(0, reason, owner, timestamp)
    })
  })

  describe('Negatives', function () {
    it('Should reject when registering for invalid id', async function () {
      const { showhub, tomorrow, attendee1 } = await loadFixture(deployFixture)

      await showhub.createWithEther(defaultContentUri, tomorrow, defaultEtherFee, 2)
      await expect(showhub.register(123, attendee1.address, { value: defaultEtherFee }))
        .to.be.revertedWithCustomError(showhub, 'NotFound')
    })

    it('Should reject above participation limit', async function () {
      const { showhub, tomorrow, attendee1, attendee2, attendee3 } = await loadFixture(deployFixture)

      const createTx = await showhub.createWithEther(defaultContentUri, tomorrow, defaultEtherFee, 2)
      expect(createTx).not.to.be.reverted

      await showhub.register(0, attendee1.address, { value: defaultEtherFee })
      await showhub.register(0, attendee2.address, { value: defaultEtherFee })

      await expect(showhub.register(0, attendee3.address, { value: defaultEtherFee }))
        .to.be.revertedWithCustomError(showhub, 'LimitReached')
    })

    it('Should reject if attendee cancels', async function () {
      const { showhub, tomorrow, attendee1 } = await loadFixture(deployFixture)

      const createTx = await showhub.createWithEther(defaultContentUri, tomorrow, defaultEtherFee, 2)
      expect(createTx).not.to.be.reverted

      await expect(showhub.connect(attendee1).cancel(0, 'Cancelled by attendee'))
        .to.be.revertedWithCustomError(showhub, 'AccessDenied')
    })

    it('Should reject if registering for a cancelled event', async function () {
      const { showhub, tomorrow, attendee1 } = await loadFixture(deployFixture)

      await showhub.createWithEther(defaultContentUri, tomorrow, defaultEtherFee, 2)
      await showhub.cancel(0, 'Cancelled by attendee')

      await expect(showhub.register(0, attendee1.address, { value: defaultEtherFee }))
        .to.be.revertedWithCustomError(showhub, 'InactiveRecord')
    })

    it('Should reject if settling a cancelled event', async function () {
      const { showhub, tomorrow, owner, attendee1 } = await loadFixture(deployFixture)

      await showhub.createWithEther(defaultContentUri, tomorrow, defaultEtherFee, 2)
      await showhub.cancel(0, 'Cancelled by attendee')

      await expect(showhub.settle(0, [owner.address, attendee1.address]))
        .to.be.revertedWithCustomError(showhub, 'InactiveRecord')
    })

    it('Should reject if settling an invalid id', async function () {
      const { showhub, tomorrow, owner, attendee1 } = await loadFixture(deployFixture)

      await showhub.createWithEther(defaultContentUri, tomorrow, defaultEtherFee, 2)
      await showhub.cancel(0, 'Cancelled by attendee')

      await expect(showhub.settle(123, [owner.address, attendee1.address]))
        .to.be.revertedWithCustomError(showhub, 'NotFound')
    })
  })
})
