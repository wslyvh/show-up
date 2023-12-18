import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers'
import { assert, expect } from 'chai'
import { ethers } from 'hardhat'
import { Status, defaultContentUri, defaultDepositFee, defaultFundFee, defaultMaxParticipants, defaultTokenFee, defaultTokenMint } from '../utils/types'

describe('SplitToken', function () {
  async function deployFixture() {
    const [owner, attendee1, attendee2, attendee3, attendee4, attendee5] = await ethers.getSigners()
    const tomorrow = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(1)
    const nextWeek = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(7)

    const ShowHub = await ethers.getContractFactory('ShowHub')
    const showhub = await ShowHub.deploy()
    console.log('ShowHub deployed to:', showhub.address)

    const SplitToken = await ethers.getContractFactory('SplitToken')
    const splitTokenModule = await SplitToken.deploy(showhub.address)
    console.log('SplitToken Module deployed to:', splitTokenModule.address)

    await showhub.whitelistConditionModule(splitTokenModule.address, true)

    const Token = await ethers.getContractFactory('Token')
    const token = await Token.deploy()
    console.log('Token deployed to:', token.address)

    await token.mint(attendee1.address, defaultTokenMint)
    await token.mint(attendee2.address, defaultTokenMint)
    await token.mint(attendee3.address, defaultTokenMint)
    await token.mint(attendee4.address, defaultTokenMint)
    await token.mint(attendee5.address, defaultTokenMint)

    return { showhub, tomorrow, nextWeek, owner, attendee1, attendee2, attendee3, attendee4, attendee5, token, splitTokenModule }
  }

  async function createFixture() {
    const { showhub, tomorrow, owner, token, splitTokenModule } = await loadFixture(deployFixture)

    const params = ethers.utils.defaultAbiCoder.encode(
      ["address", 'uint256', 'address'],
      [owner.address, defaultDepositFee, token.address])

    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, splitTokenModule.address, params)
  }

  describe('Deployment', function () {
    it('Should deploy a new instance', async function () {
      const { showhub, splitTokenModule, owner } = await loadFixture(deployFixture)

      assert.isNotNull(showhub)
      assert.isNotNull(splitTokenModule)
      expect(await showhub.owner()).to.be.equal(owner.address)

      const isWhitelisted = await showhub.isConditionModuleWhitelisted(splitTokenModule.address)
      expect(isWhitelisted).to.be.true

      expect(await splitTokenModule.name()).to.be.equal('SplitToken')
    })
  })

  describe('SplitToken Module', function () {
    it('Should allow to create an event', async function () {
      const { showhub, tomorrow, owner, token, splitTokenModule } = await loadFixture(deployFixture)

      const params = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'address'],
        [owner.address, defaultDepositFee, token.address])

      const createTx = await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, splitTokenModule.address, params)

      expect(createTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(createTx).to.emit(showhub, "Created")
        .withArgs(0, defaultContentUri, owner, timestamp)

      const record = await showhub.getRecord(0)
      expect(record.owner).to.be.equal(owner.address)
      expect(record.status).to.be.equal(Status.Active)
      expect(record.endDate).to.be.equal(tomorrow)
      expect(record.limit).to.be.equal(defaultMaxParticipants)
      expect(record.contentUri).to.be.equal(defaultContentUri)
      expect(record.conditionModule).to.be.equal(splitTokenModule.address)

      const condition = await splitTokenModule.getConditions(0)
      expect(condition.owner).to.be.equal(owner.address)
      expect(condition.depositFee).to.be.equal(defaultDepositFee)
      expect(condition.tokenAddress).to.be.equal(token.address)
    })

    it('Should allow owner to cancel', async function () {
      const { showhub, owner } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      const reason = 'Cancelled by owner'
      const cancelTx = await showhub.cancel(0, reason, [])

      const timestamp = await time.latest();
      expect(cancelTx).to.emit(showhub, "Cancelled")
        .withArgs(0, reason, owner, timestamp)
    })

    it('Should disperse funds when cancelling an event with registrations ', async function () {
      const { showhub, attendee1, attendee2, token, splitTokenModule } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      await token.approve(splitTokenModule.address, defaultTokenFee.mul(2));
      await showhub.register(0, attendee1.address, [])
      await showhub.register(0, attendee2.address, [])

      const attendee1BalanceBefore = await token.balanceOf(attendee1.address)
      const attendee2BalanceBefore = await token.balanceOf(attendee2.address)

      await showhub.cancel(0, 'Cancelled by owner', [])

      const attendee1BalanceAfter = await token.balanceOf(attendee1.address)
      const attendee2BalanceAfter = await token.balanceOf(attendee2.address)

      expect(attendee1BalanceBefore).to.be.lessThan(attendee1BalanceAfter)
      expect(attendee2BalanceBefore).to.be.lessThan(attendee2BalanceAfter)
    })

    it('Should allow to register yourself', async function () {
      const { showhub, token, splitTokenModule, owner } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      // Need to approve the condition module to transfer tokens
      await token.approve(splitTokenModule.address, defaultTokenFee);

      const registerTx = await showhub.register(0, owner.address, [])
      expect(registerTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(registerTx).to.emit(showhub, "Registered")
        .withArgs(0, owner.address, owner.address, timestamp)

      const isRegistered = await showhub.isRegistered(0, owner.address)
      expect(isRegistered).to.be.true

      const registrations = await showhub.getRegistrations(0)
      expect(registrations).to.have.lengthOf(1)
      const attendees = await showhub.getAttendees(0)
      expect(attendees).to.have.lengthOf(0) // none checked in

      const totalDepositAmount = await splitTokenModule.getTotalDeposits(0)
      expect(totalDepositAmount).to.be.equal(defaultDepositFee)
    })

    it('Should allow to register someone else', async function () {
      const { showhub, token, splitTokenModule, owner, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      // Need to approve the condition module to transfer tokens
      await token.approve(splitTokenModule.address, defaultTokenFee);

      const registerTx = await showhub.register(0, attendee1.address, [])
      expect(registerTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(registerTx).to.emit(showhub, "Registered")
        .withArgs(0, owner.address, owner.address, timestamp)
    })

    it('Should allow to checkin attendees', async function () {
      const { showhub, token, splitTokenModule, owner, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      await token.connect(attendee1).approve(splitTokenModule.address, defaultTokenFee);
      await token.connect(attendee2).approve(splitTokenModule.address, defaultTokenFee);

      await showhub.connect(attendee1).register(0, attendee1.address, [])
      await showhub.connect(attendee2).register(0, attendee2.address, [])

      const attendees = [attendee1.address, attendee2.address]
      const checkinTx = await showhub.checkin(0, attendees, [])
      expect(checkinTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(checkinTx).to.emit(showhub, "CheckedIn")
        .withArgs(0, attendees, owner.address, timestamp)

      const isCheckedIn = await showhub.isAttending(0, attendee1.address)
      expect(isCheckedIn).to.be.true

      const getRegistrations = await showhub.getRegistrations(0)
      expect(getRegistrations).to.have.lengthOf(2)

      const getAttendees = await showhub.getAttendees(0)
      expect(getAttendees).to.have.lengthOf(2)

      const totalDepositAmount = await splitTokenModule.getTotalDeposits(0)
      expect(totalDepositAmount).to.be.equal(defaultDepositFee.mul(2))
    })

    it('Should not check-in unregistered attendees', async function () {
      const { showhub, token, splitTokenModule, owner, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      // Only register 2 attendees
      await token.connect(attendee1).approve(splitTokenModule.address, defaultTokenFee);
      await token.connect(attendee2).approve(splitTokenModule.address, defaultTokenFee);

      await showhub.connect(attendee1).register(0, attendee1.address, [])
      await showhub.connect(attendee2).register(0, attendee2.address, [])

      // Try to check-in 3 attendees
      const attendees = [owner.address, attendee1.address, attendee2.address]
      const checkinTx = await showhub.checkin(0, attendees, [])
      expect(checkinTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(checkinTx).to.emit(showhub, "CheckedIn")
        .withArgs(0, [owner.address, attendee1.address, attendee2.address], owner.address, timestamp)
    })

    it('Should allow to settle an event', async function () {
      const { showhub, token, splitTokenModule, nextWeek, owner, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      await token.approve(splitTokenModule.address, defaultTokenFee.mul(3));

      await showhub.register(0, owner.address, [])
      await showhub.register(0, attendee1.address, [])
      await showhub.register(0, attendee2.address, [])

      // Only check-in attendees
      const attendees = [attendee1.address, attendee2.address]
      const checkinTx = await showhub.checkin(0, attendees, [])
      expect(checkinTx).not.to.be.reverted

      const ownerBalanceBefore = await token.balanceOf(owner.address)
      const attendee1BalanceBefore = await token.balanceOf(attendee1.address)
      const attendee2BalanceBefore = await token.balanceOf(attendee2.address)

      // Update timestamp to next week. Can only settle events that have passed their endDate
      await time.increaseTo(nextWeek);

      const settleTx = await showhub.settle(0, [])
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

    it('Should allow to fund a running event', async function () {
      const { showhub, splitTokenModule, owner, token } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      await token.approve(splitTokenModule.address, defaultFundFee);
      const fundTx = await showhub.fund(0, ethers.utils.defaultAbiCoder.encode(['uint256'], [defaultFundFee]))
      expect(fundTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(fundTx).to.emit(showhub, "Funded")
        .withArgs(0, [], owner.address, timestamp)

      const totalFundAmount = await splitTokenModule.getTotalDeposits(0)
      expect(totalFundAmount).to.be.equal(defaultFundFee)
    })

    it('Should disperse additional funds to attendees', async function () {
      const { showhub, splitTokenModule, nextWeek, owner, token, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      await token.approve(splitTokenModule.address, defaultFundFee);
      await showhub.fund(0, ethers.utils.defaultAbiCoder.encode(['uint256'], [defaultFundFee]))

      await token.approve(splitTokenModule.address, defaultTokenFee.mul(2));
      await showhub.register(0, attendee1.address, [])
      await showhub.register(0, attendee2.address, [])

      const attendees = [attendee1.address, attendee2.address]
      await showhub.checkin(0, attendees, [])

      const attendee1BalanceBefore = await token.balanceOf(attendee1.address)
      const attendee2BalanceBefore = await token.balanceOf(attendee2.address)

      // Update timestamp to next week. Can only settle events that have passed their endDate
      await time.increaseTo(nextWeek)
      await showhub.connect(owner).settle(0, [])

      const attendee1BalanceAfter = await token.balanceOf(attendee1.address)
      const attendee2BalanceAfter = await token.balanceOf(attendee2.address)
      expect(attendee1BalanceBefore).to.be.lessThan(attendee1BalanceAfter)
      expect(attendee2BalanceBefore).to.be.lessThan(attendee2BalanceAfter)

      const attendee1ExpectedBalancerAfter = attendee1BalanceBefore.add(defaultDepositFee).add(defaultFundFee.div(2)) // div by 2 check-ins
      expect(attendee1BalanceAfter).to.be.equal(attendee1ExpectedBalancerAfter)
    })
  })
})
