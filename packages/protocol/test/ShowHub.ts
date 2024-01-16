import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers'
import { assert, expect } from 'chai'
import { ethers } from 'hardhat'
import { defaultContentUri, defaultDepositFee, defaultFundFee, defaultMaxParticipants, defaultTokenFee, defaultTokenMint } from './utils/types'

describe('ShowHub', function () {
  async function deployFixture() {
    const [owner, attendee1, attendee2, attendee3, attendee4, attendee5] = await ethers.getSigners()
    const tomorrow = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(1)
    const nextWeek = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(7)

    const ShowHub = await ethers.getContractFactory('ShowHub')
    const showhub = await ShowHub.deploy()
    console.log('ShowHub deployed to:', showhub.address)

    const TrueMock = await ethers.getContractFactory('TrueMock')
    const trueMockModule = await TrueMock.deploy(showhub.address)
    console.log('TrueMock Module deployed to:', trueMockModule.address)

    const FalseMock = await ethers.getContractFactory('FalseMock')
    const falseMockModule = await FalseMock.deploy(showhub.address)
    console.log('FalseMock Module deployed to:', falseMockModule.address)

    const FalseCreateMock = await ethers.getContractFactory('FalseCreateMock')
    const falseCreateMockModule = await FalseCreateMock.deploy(showhub.address)
    console.log('FalseCreateMock Module deployed to:', falseCreateMockModule.address)

    const FalseSettleMock = await ethers.getContractFactory('FalseSettleMock')
    const falseSettleMockModule = await FalseSettleMock.deploy(showhub.address)
    console.log('FalseSettleMock Module deployed to:', falseSettleMockModule.address)

    await showhub.whitelistConditionModule(trueMockModule.address, true)
    await showhub.whitelistConditionModule(falseMockModule.address, true)
    await showhub.whitelistConditionModule(falseCreateMockModule.address, true)
    await showhub.whitelistConditionModule(falseSettleMockModule.address, true)

    const params = ethers.utils.defaultAbiCoder.encode(['uint256'], [defaultDepositFee])

    return { showhub, tomorrow, nextWeek, owner, attendee1, attendee2, attendee3, attendee4, attendee5, trueMockModule, falseMockModule, falseCreateMockModule, falseSettleMockModule, params }
  }

  async function createTrueMockFixture() {
    const { showhub, tomorrow, trueMockModule, params } = await loadFixture(deployFixture)

    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, trueMockModule.address, params)
  }

  async function createFalseMockFixture() {
    const { showhub, tomorrow, falseMockModule, params } = await loadFixture(deployFixture)

    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, falseMockModule.address, params)
  }

  async function createFalseCreateMockFixture() {
    const { showhub, tomorrow, falseCreateMockModule, params } = await loadFixture(deployFixture)

    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, falseCreateMockModule.address, params)
  }

  async function createFalseSettleMockFixture() {
    const { showhub, tomorrow, falseSettleMockModule, params } = await loadFixture(deployFixture)

    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, falseSettleMockModule.address, params)
  }

  describe('Deployment', function () {
    it('Should deploy a new instance', async function () {
      const { showhub, trueMockModule, falseMockModule, owner } = await loadFixture(deployFixture)

      assert.isNotNull(showhub)
      assert.isNotNull(trueMockModule)
      assert.isNotNull(falseMockModule)
      expect(await showhub.owner()).to.be.equal(owner.address)

      const isWhitelisted = await showhub.isConditionModuleWhitelisted(trueMockModule.address)
      expect(isWhitelisted).to.be.true
    })

    it('Should add modules to whitelist', async function () {
      const { showhub, trueMockModule, falseMockModule, owner } = await loadFixture(deployFixture)

      const whitelistTx = await showhub.whitelistConditionModule(trueMockModule.address, true)
      expect(whitelistTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(whitelistTx).to.emit(showhub, "ConditionModuleWhitelisted")
        .withArgs(trueMockModule.address, true, owner, timestamp)

      const isWhitelisted = await showhub.isConditionModuleWhitelisted(trueMockModule.address)
      expect(isWhitelisted).to.be.true

      await showhub.whitelistConditionModule(falseMockModule.address, true)
      const falseMockModuleWhitelisted = await showhub.isConditionModuleWhitelisted(trueMockModule.address)
      expect(falseMockModuleWhitelisted).to.be.true
    })
  })

  describe('Event updates', function () {
    it('Should allow owner to update content uri', async function () {
      const { showhub, owner } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      const newContentUri = '0xUpdatedContentUriHash'
      const updateTx = await showhub.updateContentUri(0, newContentUri)

      const timestamp = await time.latest();
      expect(updateTx).to.emit(showhub, "Updated").withArgs(0, owner, timestamp)

      const record = await showhub.getRecord(0)
      expect(record.contentUri).to.be.equal(newContentUri)
    })

    it('Should allow owner to update limit', async function () {
      const { showhub, owner } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      const newLimit = 420
      const updateTx = await showhub.updateLimit(0, newLimit)

      const timestamp = await time.latest();
      expect(updateTx).to.emit(showhub, "Updated").withArgs(0, owner, timestamp)

      const record = await showhub.getRecord(0)
      expect(record.limit).to.be.equal(newLimit)
    })

    it('Should allow owner to update owner', async function () {
      const { showhub, owner, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      const newOwner = attendee1.address
      const updateTx = await showhub.updateOwner(0, newOwner)

      const timestamp = await time.latest();
      expect(updateTx).to.emit(showhub, "Updated").withArgs(0, owner, timestamp)

      const record = await showhub.getRecord(0)
      expect(record.owner).to.be.equal(newOwner)
    })
  })

  describe('True Module', function () {
    it('Should allow to create a new event', async function () {
      const { showhub, tomorrow, owner, trueMockModule, params } = await loadFixture(deployFixture)

      const createTx = await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, trueMockModule.address, params)

      const timestamp = await time.latest();
      expect(createTx).to.emit(showhub, "Created")
        .withArgs(0, owner, timestamp)

      const record = await showhub.getRecord(0)
      expect(record.contentUri).to.be.equal(defaultContentUri)
      expect(record.endDate).to.be.equal(tomorrow)
      expect(record.limit).to.be.equal(defaultMaxParticipants)
      expect(record.conditionModule).to.be.equal(trueMockModule.address)
    })

    it('Should allow to register for event', async function () {
      const { showhub, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      const registerTx = await showhub.register(0, attendee1.address, [], { value: defaultDepositFee })
      expect(registerTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(registerTx).to.emit(showhub, "Registered")
        .withArgs(0, attendee1.address, attendee1.address, timestamp)
    })

    it('Should allow to fund an event', async function () {
      const { showhub, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      const fundTx = await showhub.fund(0, [], { value: defaultFundFee })
      expect(fundTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(fundTx).to.emit(showhub, "Funded")
        .withArgs(0, attendee1.address, attendee1.address, timestamp)
    })

    it('Should allow to checkin to an event', async function () {
      const { showhub, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      await showhub.register(0, attendee1.address, [], { value: defaultDepositFee })
      const checkinTx = await showhub.checkin(0, [attendee1.address], [])
      expect(checkinTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(checkinTx).to.emit(showhub, "CheckedIn")
        .withArgs(0, attendee1.address, attendee1.address, timestamp)
    })

    it('Should allow to settle an event', async function () {
      const { showhub, attendee1, nextWeek } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      await showhub.register(0, attendee1.address, [], { value: defaultDepositFee })
      await showhub.checkin(0, [attendee1.address], [])

      // Update timestamp to next week. Can only settle events that have passed their endDate
      await time.increaseTo(nextWeek)

      const settleTx = await showhub.settle(0, [])
      expect(settleTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(settleTx).to.emit(showhub, "Settled")
        .withArgs(0, attendee1.address, attendee1.address, timestamp)
    })

    it('Should allow to settle an event with 100 participants', async function () {
      const { showhub, nextWeek } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      const addresses = []
      for (let i = 0; i < 100; i++) {
        const address = ethers.Wallet.createRandom().address
        await showhub.register(0, address, [], { value: defaultDepositFee })
        addresses.push(address)
      }

      await showhub.checkin(0, addresses, [])

      // Update timestamp to next week. Can only settle events that have passed their endDate
      await time.increaseTo(nextWeek)

      const settleTx = await showhub.settle(0, [])
      expect(settleTx).not.to.be.reverted
    })

    it('Should allow owner to cancel', async function () {
      const { showhub, owner } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      const reason = 'Cancelled by owner'
      const cancelTx = await showhub.cancel(0, reason, [])

      const timestamp = await time.latest();
      expect(cancelTx).to.emit(showhub, "Cancelled")
        .withArgs(0, reason, owner, timestamp)
    })

    it('Should allow to cancel an event with 500 participants', async function () {
      const { showhub, owner, tomorrow, trueMockModule, params } = await loadFixture(deployFixture)

      await showhub.create(defaultContentUri, tomorrow, 500, trueMockModule.address, params)

      const addresses = []
      for (let i = 0; i < 500; i++) {
        const address = ethers.Wallet.createRandom().address
        await showhub.register(0, address, [], { value: defaultDepositFee })
        addresses.push(address)
      }

      const reason = 'Cancelled by owner'
      const cancelTx = await showhub.cancel(0, reason, [])

      const timestamp = await time.latest();
      expect(cancelTx).to.emit(showhub, "Cancelled")
        .withArgs(0, reason, owner, timestamp)
    })

    it('Should allow to register when no max. participants is set', async function () {
      const { showhub, tomorrow, owner, trueMockModule } = await loadFixture(deployFixture)

      const params = ethers.utils.defaultAbiCoder.encode(['uint256'], [defaultDepositFee])

      await showhub.create(defaultContentUri, tomorrow, 0, trueMockModule.address, params)

      const registerTx = await showhub.register(0, owner.address, [], { value: defaultDepositFee })
      expect(registerTx).not.to.be.reverted

      const timestamp = await time.latest();
      expect(registerTx).to.emit(showhub, "Registered")
        .withArgs(0, owner.address, owner.address, timestamp)
    })
  })

  describe('False Module', function () {
    it('Should not allow to create a new event if module returns false', async function () {
      const { showhub, tomorrow, falseMockModule, params } = await loadFixture(deployFixture)

      await expect(showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, falseMockModule.address, params))
        .to.be.revertedWithCustomError(showhub, 'UnexpectedConditionModuleError')
    })

    it('Should not allow to register for event when module returns false', async function () {
      const { showhub, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createFalseCreateMockFixture)

      await expect(showhub.register(0, attendee1.address, [], { value: defaultDepositFee }))
        .to.be.revertedWithCustomError(showhub, 'UnexpectedConditionModuleError')
    })

    it('Should not allow to fund an event when module returns false', async function () {
      const { showhub } = await loadFixture(deployFixture)
      await loadFixture(createFalseCreateMockFixture)

      await expect(showhub.fund(0, [], { value: defaultFundFee }))
        .to.be.revertedWithCustomError(showhub, 'UnexpectedConditionModuleError')
    })

    it('Should not allow to checkin when module returns false', async function () {
      const { showhub, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createFalseCreateMockFixture)

      await expect(showhub.checkin(0, [attendee1.address], []))
        .to.be.revertedWithCustomError(showhub, 'UnexpectedConditionModuleError')
    })

    it('Should not allow to settle when module returns false', async function () {
      const { showhub, attendee1, nextWeek } = await loadFixture(deployFixture)
      await loadFixture(createFalseSettleMockFixture)

      await showhub.register(0, attendee1.address, [], { value: defaultDepositFee })
      await showhub.checkin(0, [attendee1.address], [])

      // Update timestamp to next week. Can only settle events that have passed their endDate
      await time.increaseTo(nextWeek)

      await expect(showhub.settle(0, []))
        .to.be.revertedWithCustomError(showhub, 'UnexpectedConditionModuleError')
    })

    it('Should not allow to cancel when module returns false', async function () {
      const { showhub } = await loadFixture(deployFixture)
      await loadFixture(createFalseCreateMockFixture)

      await expect(showhub.cancel(0, 'Cancel', []))
        .to.be.revertedWithCustomError(showhub, 'UnexpectedConditionModuleError')
    })
  })

  describe('Negatives', function () {
    it('Should reject when creating with an empty condition module', async function () {
      const { showhub, tomorrow, owner } = await loadFixture(deployFixture)

      const params = ethers.utils.defaultAbiCoder.encode(['uint256'], [defaultDepositFee])

      await expect(showhub.create(defaultContentUri, tomorrow, 0, ethers.constants.AddressZero, params))
        .to.be.revertedWithCustomError(showhub, 'NotFound')
    })

    it('Should reject when creating with an invalid condition module', async function () {
      const { showhub, tomorrow, owner } = await loadFixture(deployFixture)

      const params = ethers.utils.defaultAbiCoder.encode(['uint256'], [defaultDepositFee])

      await expect(showhub.create(defaultContentUri, tomorrow, 0, showhub.address, params))
        .to.be.revertedWithCustomError(showhub, 'NotWhitelisted')
    })

    it('Should reject when registering for invalid id', async function () {
      const { showhub, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      await expect(showhub.register(123, attendee1.address, [], { value: defaultDepositFee }))
        .to.be.revertedWithCustomError(showhub, 'NotFound')
    })

    it('Should reject if already registered', async function () {
      const { showhub, owner } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      await showhub.register(0, owner.address, [], { value: defaultDepositFee })
      await expect(showhub.register(0, owner.address, [], { value: defaultDepositFee }))
        .to.be.revertedWithCustomError(showhub, 'AlreadyRegistered')
    })

    it('Should reject above participation limit', async function () {
      const { showhub, owner, trueMockModule, tomorrow, attendee1, attendee2, attendee3 } = await loadFixture(deployFixture)

      const params = ethers.utils.defaultAbiCoder.encode(['uint256'], [defaultDepositFee])
      await showhub.create(defaultContentUri, tomorrow, 2, trueMockModule.address, params)

      await showhub.register(0, attendee1.address, [], { value: defaultDepositFee })
      await showhub.register(0, attendee2.address, [], { value: defaultDepositFee })

      await expect(showhub.register(0, attendee3.address, [], { value: defaultDepositFee }))
        .to.be.revertedWithCustomError(showhub, 'LimitReached')
    })

    it('Should reject if non-owner tries to cancel', async function () {
      const { showhub, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      await expect(showhub.connect(attendee1).cancel(0, 'Cancelled by attendee', []))
        .to.be.revertedWithCustomError(showhub, 'AccessDenied')
    })

    it('Should reject if cancelling an invalid id', async function () {
      const { showhub } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      await expect(showhub.cancel(42, 'Invalid Id', []))
        .to.be.revertedWithCustomError(showhub, 'NotFound')
    })

    it('Should reject if cancelling an inactive event', async function () {
      const { showhub, owner } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      const reason = 'Cancelled by owner'
      const cancelTx = await showhub.cancel(0, reason, [])

      const timestamp = await time.latest();
      expect(cancelTx).to.emit(showhub, "Cancelled")
        .withArgs(0, reason, owner, timestamp)

      await expect(showhub.cancel(0, reason, [])).to.be.revertedWithCustomError(showhub, 'InactiveRecord')
    })

    it('Should reject if cancelling when end date has passed', async function () {
      const { showhub, nextWeek } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      // Update timestamp to next week. Can only settle events that have passed their endDate
      await time.increaseTo(nextWeek)

      await expect(showhub.cancel(0, 'Cancel', [])).to.be.revertedWithCustomError(showhub, 'InvalidDate')
    })

    it('Should reject if cancelling an event that has attendees checked in ', async function () {
      const { showhub, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      await showhub.connect(attendee1).register(0, attendee1.address, [], { value: defaultDepositFee })
      await showhub.connect(attendee2).register(0, attendee2.address, [], { value: defaultDepositFee })
      await showhub.checkin(0, [attendee1.address, attendee2.address], [])

      await expect(showhub.cancel(0, 'Cancelled by owner', []))
        .to.be.revertedWithCustomError(showhub, 'AlreadyStarted')
    })

    it('Should reject if funding an invalid id', async function () {
      const { showhub, nextWeek } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      await expect(showhub.fund(42, [], { value: defaultFundFee }))
        .to.be.revertedWithCustomError(showhub, 'NotFound')
    })

    it('Should reject if funding a cancelled event', async function () {
      const { showhub, nextWeek } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      await showhub.cancel(0, 'Cancelled by attendee', [])

      await expect(showhub.fund(0, [], { value: defaultFundFee }))
        .to.be.revertedWithCustomError(showhub, 'InactiveRecord')
    })

    it('Should reject if registering for a cancelled event', async function () {
      const { showhub, attendee1 } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      await showhub.cancel(0, 'Cancelled by attendee', [])

      await expect(showhub.register(0, attendee1.address, [], { value: defaultDepositFee }))
        .to.be.revertedWithCustomError(showhub, 'InactiveRecord')
    })

    it('Should reject if checking in for a cancelled event', async function () {
      const { showhub, owner } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      await showhub.cancel(0, 'Cancelled by attendee', [])

      await expect(showhub.connect(owner).register(0, owner.address, [], { value: defaultDepositFee }))
        .to.be.revertedWithCustomError(showhub, 'InactiveRecord')
    })

    it('Should not check-in already checked-in addresses', async function () {
      const { showhub, owner, attendee1, attendee2 } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      await showhub.register(0, attendee1.address, [], { value: defaultDepositFee })

      const checkin1tx = await showhub.checkin(0, [attendee1.address], [])
      const timestamp1 = await time.latest();
      const attendees1 = await showhub.getAttendees(0)
      expect(attendees1.length).to.be.equal(1)
      expect(checkin1tx).to.emit(showhub, "CheckedIn")
        .withArgs(0, [attendee1.address], owner.address, timestamp1)

      const checkin2tx = await showhub.checkin(0, [attendee1.address, attendee2.address], [])
      const timestamp2 = await time.latest();
      const attendees2 = await showhub.getAttendees(0)
      expect(attendees2.length).to.be.equal(1)
      expect(checkin2tx).to.emit(showhub, "CheckedIn")
        .withArgs(0, [], owner.address, timestamp2)
    })

    it('Should reject if settling a cancelled event', async function () {
      const { showhub } = await loadFixture(deployFixture)
      await loadFixture(createTrueMockFixture)

      await showhub.cancel(0, 'Cancelled by attendee', [])

      await expect(showhub.settle(0, []))
        .to.be.revertedWithCustomError(showhub, 'InactiveRecord')
    })

    it('Should reject if settling an invalid id', async function () {
      const { showhub } = await loadFixture(deployFixture)

      await loadFixture(createTrueMockFixture)

      await showhub.cancel(0, 'Cancelled by attendee', [])

      await expect(showhub.settle(123, []))
        .to.be.revertedWithCustomError(showhub, 'NotFound')
    })
  })
})
