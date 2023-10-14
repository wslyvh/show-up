import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers'
import { assert, expect } from 'chai'
import { ethers } from 'hardhat'
import { Status, defaultContentUri, defaultDepositFee, defaultMaxParticipants } from './utils/types'

describe('RegistryWithEther', function () {
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

    await registry.whitelistConditionModule(basicEtherModule.address, true)

    return { registry, tomorrow, nextWeek, owner, attendee1, attendee2, attendee3, attendee4, attendee5, basicEtherModule }
  }

  async function createFixture() {
    const { registry, tomorrow, owner, basicEtherModule } = await loadFixture(deployFixture)

    const params = ethers.utils.defaultAbiCoder.encode(
      ["address", 'uint256', 'uint256', 'uint256', 'address'],
      [owner.address, tomorrow, defaultDepositFee, defaultMaxParticipants, ethers.constants.AddressZero])

    await registry.create(defaultContentUri, basicEtherModule.address, params)
  }

  describe('Deployment', function () {
    it('Should deploy a new instance', async function () {
      const { registry, basicEtherModule, owner } = await loadFixture(deployFixture)

      assert.isNotNull(registry)
      assert.isNotNull(basicEtherModule)
      expect(await registry.owner()).to.be.equal(owner.address)

      const isWhitelisted = await registry.isConditionModuleWhitelisted(basicEtherModule.address)
      expect(isWhitelisted).to.be.true
    })
  })

  describe('BasicEther Module', function () {
    it('Should allow to create an event', async function () {
      const { registry, tomorrow, owner, basicEtherModule } = await loadFixture(deployFixture)

      const params = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'uint256', 'uint256', 'address'],
        [owner.address, tomorrow, defaultDepositFee, defaultMaxParticipants, ethers.constants.AddressZero])

      const createTx = await registry.create(defaultContentUri, basicEtherModule.address, params)
      expect(createTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(createTx).to.emit(registry, "Created")
        .withArgs(0, defaultContentUri, owner, timestamp)

      const record = await registry.getRecord(0)
      expect(record.owner).to.be.equal(owner.address)
      expect(record.status).to.be.equal(Status.Active)
      expect(record.contentUri).to.be.equal(defaultContentUri)
      expect(record.conditionModule).to.be.equal(basicEtherModule.address)

      const condition = await basicEtherModule.getConditions(0)
      expect(condition.owner).to.be.equal(owner.address)
      expect(condition.endDate).to.be.equal(tomorrow)
      expect(condition.depositFee).to.be.equal(defaultDepositFee)
      expect(condition.maxParticipants).to.be.equal(defaultMaxParticipants)
    })

    it('Should allow to register yourself', async function () {
      const { registry, basicEtherModule, owner } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      const params = ethers.utils.defaultAbiCoder.encode(["address"], [owner.address])
      const registerTx = await registry.register(0, params, { value: defaultDepositFee })
      expect(registerTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(registerTx).to.emit(registry, "Registered")
        .withArgs(0, owner.address, owner.address, timestamp)

      const isRegistered = await basicEtherModule.isRegistered(0, owner.address)
      expect(isRegistered).to.be.true

      const registrationInfo = await basicEtherModule.getRegistrationInfo(0)
      expect(registrationInfo.totalAttendees).to.be.equal(0) // none checked in
      expect(registrationInfo.totalRegistrations).to.be.equal(1)
      expect(registrationInfo.totalDepositAmount).to.be.equal(defaultDepositFee)
    })

    it('Should allow to register someone else', async function () {
      const { registry, owner, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      const params = ethers.utils.defaultAbiCoder.encode(["address"], [attendee1.address])
      const registerTx = await registry.register(0, params, { value: defaultDepositFee })
      expect(registerTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(registerTx).to.emit(registry, "Registered")
        .withArgs(0, owner.address, owner.address, timestamp)
    })

    it('Should allow to checkin attendees', async function () {
      const { registry, basicEtherModule, owner, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      await registry.connect(attendee1).register(0, ethers.utils.defaultAbiCoder.encode(["address"], [attendee1.address]), { value: defaultDepositFee })
      await registry.connect(attendee2).register(0, ethers.utils.defaultAbiCoder.encode(["address"], [attendee2.address]), { value: defaultDepositFee })

      const attendees = [attendee1.address, attendee2.address]
      const checkinTx = await registry.checkin(0, attendees, [])
      expect(checkinTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(checkinTx).to.emit(registry, "CheckedIn")
        .withArgs(0, attendees, owner.address, timestamp)

      const getRegistrations = await basicEtherModule.getRegistrations(0)
      expect(getRegistrations).to.have.lengthOf(2)

      const getAttendees = await basicEtherModule.getAttendees(0)
      expect(getAttendees).to.have.lengthOf(2)

      const registrationInfo = await basicEtherModule.getRegistrationInfo(0)
      expect(registrationInfo.totalAttendees).to.be.equal(2)
      expect(registrationInfo.totalRegistrations).to.be.equal(2)
      expect(registrationInfo.totalDepositAmount).to.be.equal(defaultDepositFee.mul(2))
    })

    it('Should not check-in unregistered attendees', async function () {
      const { registry, owner, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      // Only register 2 attendees
      await registry.connect(attendee1).register(0, ethers.utils.defaultAbiCoder.encode(["address"], [attendee1.address]), { value: defaultDepositFee })
      await registry.connect(attendee2).register(0, ethers.utils.defaultAbiCoder.encode(["address"], [attendee2.address]), { value: defaultDepositFee })

      // Try to check-in 3 attendees
      const attendees = [owner.address, attendee1.address, attendee2.address]
      const checkinTx = await registry.checkin(0, attendees, [])
      expect(checkinTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(checkinTx).to.emit(registry, "CheckedIn")
        .withArgs(0, [owner.address, attendee1.address, attendee2.address], owner.address, timestamp)
    })

    it('Should allow to settle an event', async function () {
      const { registry, nextWeek, owner, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      const ownerParams = ethers.utils.defaultAbiCoder.encode(["address"], [owner.address])
      await registry.connect(owner).register(0, ownerParams, { value: defaultDepositFee })

      const a1Params = ethers.utils.defaultAbiCoder.encode(["address"], [attendee1.address])
      await registry.connect(attendee1).register(0, a1Params, { value: defaultDepositFee })

      const a2Params = ethers.utils.defaultAbiCoder.encode(["address"], [attendee2.address])
      await registry.connect(attendee2).register(0, a2Params, { value: defaultDepositFee })

      // Only check-in attendees
      const attendees = [attendee1.address, attendee2.address]
      const checkinTx = await registry.checkin(0, attendees, [])
      expect(checkinTx).not.to.be.reverted

      const ownerBalanceBefore = await owner.getBalance()
      const attendee1BalanceBefore = await attendee1.getBalance()
      const attendee2BalanceBefore = await attendee2.getBalance()

      // Update timestamp to next week. Can only settle events that have passed their endDate
      await time.increaseTo(nextWeek);

      const settleTx = await registry.connect(owner).settle(0, [])
      expect(settleTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(settleTx).to.emit(registry, "Settled")
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
})
