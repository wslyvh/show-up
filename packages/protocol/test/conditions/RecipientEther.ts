import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers'
import { assert, expect } from 'chai'
import { ethers } from 'hardhat'
import { Status, defaultContentUri, defaultDepositFee, defaultFundFee, defaultMaxParticipants } from '../utils/types'

describe('RecipientEther', function () {
  async function deployFixture() {
    const [owner, attendee1, attendee2, attendee3, attendee4, attendee5, recipient] = await ethers.getSigners()
    const tomorrow = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(1)
    const nextWeek = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(7)

    const ShowHub = await ethers.getContractFactory('ShowHub')
    const showhub = await ShowHub.deploy()
    console.log('ShowHub deployed to:', showhub.address)

    const RecipientEther = await ethers.getContractFactory('RecipientEther')
    const recipientEtherModule = await RecipientEther.deploy(showhub.address)
    console.log('RecipientEther Module deployed to:', recipientEtherModule.address)

    await showhub.whitelistConditionModule(recipientEtherModule.address, true)

    const params = ethers.utils.defaultAbiCoder.encode(['uint256', 'address'], [defaultDepositFee, recipient.address])

    return { showhub, tomorrow, nextWeek, owner, attendee1, attendee2, attendee3, attendee4, attendee5, recipient, recipientEtherModule, params }
  }

  async function createFixture() {
    const { showhub, tomorrow, recipientEtherModule, params } = await loadFixture(deployFixture)

    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, recipientEtherModule.address, params)
  }

  describe('Deployment', function () {
    it('Should deploy a new instance', async function () {
      const { showhub, recipientEtherModule, owner } = await loadFixture(deployFixture)

      assert.isNotNull(showhub)
      assert.isNotNull(recipientEtherModule)
      expect(await showhub.owner()).to.be.equal(owner.address)

      const isWhitelisted = await showhub.isConditionModuleWhitelisted(recipientEtherModule.address)
      expect(isWhitelisted).to.be.true

      expect(await recipientEtherModule.name()).to.be.equal('RecipientEther')
    })
  })

  describe('RecipientEther Module', function () {
    it('Should allow to create an event', async function () {
      const { showhub, tomorrow, owner, recipientEtherModule, params } = await loadFixture(deployFixture)

      const createTx = await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, recipientEtherModule.address, params)
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
      expect(record.conditionModule).to.be.equal(recipientEtherModule.address)

      const condition = await recipientEtherModule.getConditions(0)
      expect(condition.depositFee).to.be.equal(defaultDepositFee)
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
      const { showhub, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

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

    it('Should allow to register yourself', async function () {
      const { showhub, recipientEtherModule, owner } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      const registerTx = await showhub.register(0, owner.address, [], { value: defaultDepositFee })
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

      const totalDepositAmount = await recipientEtherModule.getTotalDeposits(0)
      expect(totalDepositAmount).to.be.equal(defaultDepositFee)
    })

    it('Should allow to register someone else', async function () {
      const { showhub, owner, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      const registerTx = await showhub.register(0, attendee1.address, [], { value: defaultDepositFee })
      expect(registerTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(registerTx).to.emit(showhub, "Registered")
        .withArgs(0, owner.address, owner.address, timestamp)
    })

    it('Should allow to checkin attendees', async function () {
      const { showhub, recipientEtherModule, owner, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      await showhub.connect(attendee1).register(0, attendee1.address, [], { value: defaultDepositFee })
      await showhub.connect(attendee2).register(0, attendee2.address, [], { value: defaultDepositFee })

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

      const totalDepositAmount = await recipientEtherModule.getTotalDeposits(0)
      expect(totalDepositAmount).to.be.equal(defaultDepositFee.mul(2))
    })

    it('Should not check-in unregistered attendees', async function () {
      const { showhub, owner, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      // Only register 2 attendees
      await showhub.connect(attendee1).register(0, attendee1.address, [], { value: defaultDepositFee })
      await showhub.connect(attendee2).register(0, attendee2.address, [], { value: defaultDepositFee })

      // Try to check-in 3 attendees
      const attendees = [owner.address, attendee1.address, attendee2.address]
      const checkinTx = await showhub.checkin(0, attendees, [])
      expect(checkinTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(checkinTx).to.emit(showhub, "CheckedIn")
        .withArgs(0, [owner.address, attendee1.address, attendee2.address], owner.address, timestamp)
    })

    it('Should allow to settle an event', async function () {
      const { showhub, nextWeek, owner, recipient, attendee1, attendee2, attendee3, attendee4, attendee5 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      await showhub.connect(attendee1).register(0, attendee1.address, [], { value: defaultDepositFee })
      await showhub.connect(attendee2).register(0, attendee2.address, [], { value: defaultDepositFee })
      await showhub.connect(attendee3).register(0, attendee3.address, [], { value: defaultDepositFee })
      await showhub.connect(attendee4).register(0, attendee4.address, [], { value: defaultDepositFee })
      await showhub.connect(attendee5).register(0, attendee5.address, [], { value: defaultDepositFee })

      // Only check-in first 2 attendees
      const attendees = [attendee1.address, attendee2.address]
      const checkinTx = await showhub.checkin(0, attendees, [])
      expect(checkinTx).not.to.be.reverted

      const recipientBalanceBefore = await recipient.getBalance()
      const attendee1BalanceBefore = await attendee1.getBalance()
      const attendee2BalanceBefore = await attendee2.getBalance()
      const attendee3BalanceBefore = await attendee3.getBalance()
      const attendee4BalanceBefore = await attendee4.getBalance()
      const attendee5BalanceBefore = await attendee5.getBalance()

      // Update timestamp to next week. Can only settle events that have passed their endDate
      await time.increaseTo(nextWeek);

      const settleTx = await showhub.connect(owner).settle(0, [])
      expect(settleTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(settleTx).to.emit(showhub, "Settled")
        .withArgs(0, owner.address, timestamp)

      const recipientBalanceAfter = await recipient.getBalance()
      const attendee1BalanceAfter = await attendee1.getBalance()
      const attendee2BalanceAfter = await attendee2.getBalance()
      const attendee3BalanceAfter = await attendee3.getBalance()
      const attendee4BalanceAfter = await attendee4.getBalance()
      const attendee5BalanceAfter = await attendee5.getBalance()

      // Owner is recipient of the pot
      expect(recipientBalanceBefore).to.be.lessThan(recipientBalanceAfter)

      // Checked-in attendees get their deposit back
      expect(attendee1BalanceBefore).to.be.lessThan(attendee1BalanceAfter)
      expect(attendee2BalanceBefore).to.be.lessThan(attendee2BalanceAfter)

      // Unchecked-in attendees lose their deposit
      expect(attendee3BalanceBefore).to.be.equal(attendee3BalanceAfter)
      expect(attendee4BalanceBefore).to.be.equal(attendee4BalanceAfter)
      expect(attendee5BalanceBefore).to.be.equal(attendee5BalanceAfter)
    })

    it('Should allow to fund a running event', async function () {
      const { showhub, recipientEtherModule, owner } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      const fundTx = await showhub.fund(0, [], { value: defaultFundFee })
      expect(fundTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(fundTx).to.emit(showhub, "Funded")
        .withArgs(0, [], owner.address, timestamp)

      const totalFundAmount = await recipientEtherModule.getTotalFunded(0)
      expect(totalFundAmount).to.be.equal(defaultFundFee)
    })

    it('Should disperse additional funds to attendees', async function () {
      const { showhub, nextWeek, owner, recipient, attendee1, attendee2, attendee3, attendee4, attendee5 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      await showhub.fund(0, [], { value: defaultFundFee })
      await showhub.register(0, attendee1.address, [], { value: defaultDepositFee })
      await showhub.register(0, attendee2.address, [], { value: defaultDepositFee })
      await showhub.register(0, attendee3.address, [], { value: defaultDepositFee })
      await showhub.register(0, attendee4.address, [], { value: defaultDepositFee })
      await showhub.register(0, attendee5.address, [], { value: defaultDepositFee })

      // Only check-in first 2 attendees
      const attendees = [attendee1.address, attendee2.address]
      await showhub.checkin(0, attendees, [])

      const recipientBalanceBefore = await recipient.getBalance()
      const attendee1BalanceBefore = await attendee1.getBalance()
      const attendee2BalanceBefore = await attendee2.getBalance()
      const attendee3BalanceBefore = await attendee3.getBalance()
      const attendee4BalanceBefore = await attendee4.getBalance()
      const attendee5BalanceBefore = await attendee5.getBalance()

      // Update timestamp to next week. Can only settle events that have passed their endDate
      await time.increaseTo(nextWeek)
      await showhub.connect(owner).settle(0, [])

      const recipientBalanceAfter = await recipient.getBalance()
      const attendee1BalanceAfter = await attendee1.getBalance()
      const attendee2BalanceAfter = await attendee2.getBalance()
      const attendee3BalanceAfter = await attendee3.getBalance()
      const attendee4BalanceAfter = await attendee4.getBalance()
      const attendee5BalanceAfter = await attendee5.getBalance()

      expect(attendee1BalanceBefore).to.be.lessThan(attendee1BalanceAfter)
      expect(attendee2BalanceBefore).to.be.lessThan(attendee2BalanceAfter)

      // Unchecked-in attendees lose their deposit
      expect(attendee3BalanceBefore).to.be.equal(attendee3BalanceAfter)
      expect(attendee4BalanceBefore).to.be.equal(attendee4BalanceAfter)
      expect(attendee5BalanceBefore).to.be.equal(attendee5BalanceAfter)

      // Attendees get their deposit back + half of the fund
      const attendee1ExpectedBalancerAfter = attendee1BalanceBefore.add(defaultDepositFee).add(defaultFundFee.div(2)) // div by 2 check-ins
      expect(attendee1BalanceAfter).to.be.equal(attendee1ExpectedBalancerAfter)

      // Recipient gets lost deposits
      const recipientExpectedBalanceAfter = recipientBalanceBefore.add(defaultDepositFee.mul(3)) // 3 unchecked-in attendees
      expect(recipientBalanceAfter).to.be.equal(recipientExpectedBalanceAfter)
    })
  })
})
