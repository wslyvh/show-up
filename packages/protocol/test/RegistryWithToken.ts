import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers'
import { assert, expect } from 'chai'
import { ethers } from 'hardhat'
import { Status, defaultContentUri, defaultDepositFee, defaultMaxParticipants, defaultTokenFee, defaultTokenMint } from './utils/types'

describe('RegistryWithToken', function () {
  async function deployFixture() {
    const [owner, attendee1, attendee2, attendee3, attendee4, attendee5] = await ethers.getSigners()
    const tomorrow = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(1)
    const nextWeek = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(7)

    const Registry = await ethers.getContractFactory('Registry')
    const registry = await Registry.deploy()
    console.log('Registry deployed to:', registry.address)

    const BasicToken = await ethers.getContractFactory('BasicToken')
    const basicTokenModule = await BasicToken.deploy(registry.address)
    console.log('BasicToken Module deployed to:', basicTokenModule.address)

    await registry.whitelistConditionModule(basicTokenModule.address, true)

    const Token = await ethers.getContractFactory('Token')
    const token = await Token.deploy()
    console.log('Token deployed to:', token.address)

    await token.mint(attendee1.address, defaultTokenMint)
    await token.mint(attendee2.address, defaultTokenMint)
    await token.mint(attendee3.address, defaultTokenMint)
    await token.mint(attendee4.address, defaultTokenMint)
    await token.mint(attendee5.address, defaultTokenMint)

    return { registry, tomorrow, nextWeek, owner, attendee1, attendee2, attendee3, attendee4, attendee5, token, basicTokenModule }
  }

  async function createFixture() {
    const { registry, tomorrow, owner, token, basicTokenModule } = await loadFixture(deployFixture)

    const params = ethers.utils.defaultAbiCoder.encode(
      ["address", 'uint256', 'uint256', 'uint256', 'address'],
      [owner.address, tomorrow, defaultDepositFee, defaultMaxParticipants, token.address])

    await registry.create(defaultContentUri, basicTokenModule.address, params)
  }

  describe('Deployment', function () {
    it('Should deploy a new instance', async function () {
      const { registry, basicTokenModule, owner } = await loadFixture(deployFixture)

      assert.isNotNull(registry)
      assert.isNotNull(basicTokenModule)
      expect(await registry.owner()).to.be.equal(owner.address)

      const isWhitelisted = await registry.isConditionModuleWhitelisted(basicTokenModule.address)
      expect(isWhitelisted).to.be.true
    })
  })

  describe('BasicEther Module', function () {
    it('Should allow to create an event', async function () {
      const { registry, tomorrow, owner, token, basicTokenModule } = await loadFixture(deployFixture)

      const params = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'uint256', 'uint256', 'address'],
        [owner.address, tomorrow, defaultDepositFee, defaultMaxParticipants, token.address])

      const createTx = await registry.create(defaultContentUri, basicTokenModule.address, params)
      expect(createTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(createTx).to.emit(registry, "Created")
        .withArgs(0, defaultContentUri, owner, timestamp)

      const record = await registry.getRecord(0)
      expect(record.owner).to.be.equal(owner.address)
      expect(record.status).to.be.equal(Status.Active)
      expect(record.contentUri).to.be.equal(defaultContentUri)
      expect(record.conditionModule).to.be.equal(basicTokenModule.address)

      const condition = await basicTokenModule.getConditions(0)
      expect(condition.owner).to.be.equal(owner.address)
      expect(condition.endDate).to.be.equal(tomorrow)
      expect(condition.depositFee).to.be.equal(defaultDepositFee)
      expect(condition.maxParticipants).to.be.equal(defaultMaxParticipants)
      expect(condition.tokenAddress).to.be.equal(token.address)
    })

    it('Should allow to register yourself', async function () {
      const { registry, token, basicTokenModule, owner } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      // Need to approve the condition module to transfer tokens
      await token.approve(basicTokenModule.address, defaultTokenFee);

      const registerTx = await registry.register(0, owner.address, [])
      expect(registerTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(registerTx).to.emit(registry, "Registered")
        .withArgs(0, owner.address, owner.address, timestamp)

      const isRegistered = await basicTokenModule.isRegistered(0, owner.address)
      expect(isRegistered).to.be.true

      const registrationInfo = await basicTokenModule.getRegistrationInfo(0)
      expect(registrationInfo.totalAttendees).to.be.equal(0) // none checked in
      expect(registrationInfo.totalRegistrations).to.be.equal(1)
      expect(registrationInfo.totalDepositAmount).to.be.equal(defaultDepositFee)
    })

    it('Should allow to register someone else', async function () {
      const { registry, token, basicTokenModule, owner, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      // Need to approve the condition module to transfer tokens
      await token.approve(basicTokenModule.address, defaultTokenFee);

      const registerTx = await registry.register(0, attendee1.address, [])
      expect(registerTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(registerTx).to.emit(registry, "Registered")
        .withArgs(0, owner.address, owner.address, timestamp)
    })

    it('Should allow to checkin attendees', async function () {
      const { registry, token, basicTokenModule, owner, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      await token.connect(attendee1).approve(basicTokenModule.address, defaultTokenFee);
      await token.connect(attendee2).approve(basicTokenModule.address, defaultTokenFee);

      await registry.connect(attendee1).register(0, attendee1.address, [])
      await registry.connect(attendee2).register(0, attendee2.address, [])

      const attendees = [attendee1.address, attendee2.address]
      const checkinTx = await registry.checkin(0, attendees, [])
      expect(checkinTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(checkinTx).to.emit(registry, "CheckedIn")
        .withArgs(0, attendees, owner.address, timestamp)

      const getRegistrations = await basicTokenModule.getRegistrations(0)
      expect(getRegistrations).to.have.lengthOf(2)

      const getAttendees = await basicTokenModule.getAttendees(0)
      expect(getAttendees).to.have.lengthOf(2)

      const registrationInfo = await basicTokenModule.getRegistrationInfo(0)
      expect(registrationInfo.totalAttendees).to.be.equal(2)
      expect(registrationInfo.totalRegistrations).to.be.equal(2)
      expect(registrationInfo.totalDepositAmount).to.be.equal(defaultDepositFee.mul(2))
    })

    it('Should not check-in unregistered attendees', async function () {
      const { registry, token, basicTokenModule, owner, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      // Only register 2 attendees
      await token.connect(attendee1).approve(basicTokenModule.address, defaultTokenFee);
      await token.connect(attendee2).approve(basicTokenModule.address, defaultTokenFee);

      await registry.connect(attendee1).register(0, attendee1.address, [])
      await registry.connect(attendee2).register(0, attendee2.address, [])

      // Try to check-in 3 attendees
      const attendees = [owner.address, attendee1.address, attendee2.address]
      const checkinTx = await registry.checkin(0, attendees, [])
      expect(checkinTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(checkinTx).to.emit(registry, "CheckedIn")
        .withArgs(0, [owner.address, attendee1.address, attendee2.address], owner.address, timestamp)
    })

    it('Should allow to settle an event', async function () {
      const { registry, token, basicTokenModule, nextWeek, owner, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createFixture)

      await token.approve(basicTokenModule.address, defaultTokenFee.mul(3));

      await registry.register(0, owner.address, [])
      await registry.register(0, attendee1.address, [])
      await registry.register(0, attendee2.address, [])

      // Only check-in attendees
      const attendees = [attendee1.address, attendee2.address]
      const checkinTx = await registry.checkin(0, attendees, [])
      expect(checkinTx).not.to.be.reverted

      const ownerBalanceBefore = await token.balanceOf(owner.address)
      const attendee1BalanceBefore = await token.balanceOf(attendee1.address)
      const attendee2BalanceBefore = await token.balanceOf(attendee2.address)

      // Update timestamp to next week. Can only settle events that have passed their endDate
      await time.increaseTo(nextWeek);

      const settleTx = await registry.settle(0, [])
      expect(settleTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(settleTx).to.emit(registry, "Settled")
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
})
