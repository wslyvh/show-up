import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers'
import { assert, expect } from 'chai'
import { ethers } from 'hardhat'
import { Status, defaultContentUri, defaultDepositFee, defaultFundFee, defaultMaxParticipants } from '../utils/types'

describe('SplitEther', function () {
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

    await showhub.whitelistConditionModule(splitEtherModule.address, true)

    return { showhub, tomorrow, nextWeek, owner, attendee1, attendee2, attendee3, attendee4, attendee5, splitEtherModule }
  }

  async function createFixture() {
    const { showhub, tomorrow, owner, splitEtherModule } = await loadFixture(deployFixture)

    const params = ethers.utils.defaultAbiCoder.encode(['uint256'], [defaultDepositFee])

    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, splitEtherModule.address, params)
  }

  describe('Deployment', function () {
    it('Should deploy a new instance', async function () {
      const { showhub, splitEtherModule, owner } = await loadFixture(deployFixture)

      assert.isNotNull(showhub)
      assert.isNotNull(splitEtherModule)
      expect(await showhub.owner()).to.be.equal(owner.address)

      const isWhitelisted = await showhub.isConditionModuleWhitelisted(splitEtherModule.address)
      expect(isWhitelisted).to.be.true

      expect(await splitEtherModule.name()).to.be.equal('SplitEther')
    })
  })

  describe('SplitEther Module', function () {
    it('Should allow to create an event', async function () {
      const { showhub, tomorrow, owner, splitEtherModule } = await loadFixture(deployFixture)

      const params = ethers.utils.defaultAbiCoder.encode(['uint256'], [defaultDepositFee])

      const createTx = await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, splitEtherModule.address, params)
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
      expect(record.conditionModule).to.be.equal(splitEtherModule.address)

      const condition = await splitEtherModule.getConditions(0)
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
      const { showhub, splitEtherModule, owner } = await loadFixture(deployFixture)
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

      const totalDepositAmount = await splitEtherModule.getTotalDeposits(0)
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
      const { showhub, splitEtherModule, owner, attendee1, attendee2 } = await loadFixture(deployFixture)
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

      const totalDepositAmount = await splitEtherModule.getTotalDeposits(0)
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
      const { showhub, nextWeek, owner, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      await showhub.connect(owner).register(0, owner.address, [], { value: defaultDepositFee })
      await showhub.connect(attendee1).register(0, attendee1.address, [], { value: defaultDepositFee })
      await showhub.connect(attendee2).register(0, attendee2.address, [], { value: defaultDepositFee })

      // Only check-in attendees
      const attendees = [attendee1.address, attendee2.address]
      const checkinTx = await showhub.checkin(0, attendees, [])
      expect(checkinTx).not.to.be.reverted

      const ownerBalanceBefore = await owner.getBalance()
      const attendee1BalanceBefore = await attendee1.getBalance()
      const attendee2BalanceBefore = await attendee2.getBalance()

      // Update timestamp to next week. Can only settle events that have passed their endDate
      await time.increaseTo(nextWeek);

      const settleTx = await showhub.connect(owner).settle(0, [])
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

    it('Should allow to fund a running event', async function () {
      const { showhub, splitEtherModule, owner } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      const fundTx = await showhub.fund(0, [], { value: defaultFundFee })
      expect(fundTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(fundTx).to.emit(showhub, "Funded")
        .withArgs(0, [], owner.address, timestamp)

      const totalFundAmount = await splitEtherModule.getTotalDeposits(0)
      expect(totalFundAmount).to.be.equal(defaultFundFee)
    })

    it('Should disperse additional funds to attendees', async function () {
      const { showhub, nextWeek, owner, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      await showhub.fund(0, [], { value: defaultFundFee })
      await showhub.register(0, attendee1.address, [], { value: defaultDepositFee })
      await showhub.register(0, attendee2.address, [], { value: defaultDepositFee })

      const attendees = [attendee1.address, attendee2.address]
      await showhub.checkin(0, attendees, [])

      const attendee1BalanceBefore = await attendee1.getBalance()
      const attendee2BalanceBefore = await attendee2.getBalance()

      // Update timestamp to next week. Can only settle events that have passed their endDate
      await time.increaseTo(nextWeek)
      await showhub.connect(owner).settle(0, [])

      const attendee1BalanceAfter = await attendee1.getBalance()
      const attendee2BalanceAfter = await attendee2.getBalance()
      expect(attendee1BalanceBefore).to.be.lessThan(attendee1BalanceAfter)
      expect(attendee2BalanceBefore).to.be.lessThan(attendee2BalanceAfter)

      const attendee1ExpectedBalancerAfter = attendee1BalanceBefore.add(defaultDepositFee).add(defaultFundFee.div(2)) // div by 2 check-ins
      expect(attendee1BalanceAfter).to.be.equal(attendee1ExpectedBalancerAfter)
    })
  })
})
