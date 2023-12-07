import {
  getContract,
  GetContractArgs,
  readContract,
  ReadContractConfig,
  writeContract,
  WriteContractArgs,
  WriteContractPreparedArgs,
  WriteContractUnpreparedArgs,
  prepareWriteContract,
  PrepareWriteContractConfig,
  WriteContractMode,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AbstractBasicModule
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const abstractBasicModuleABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
  },
  { type: 'error', inputs: [], name: 'AlreadyRegistered' },
  { type: 'error', inputs: [], name: 'AlreadyStarted' },
  { type: 'error', inputs: [], name: 'InvalidDate' },
  { type: 'error', inputs: [], name: 'LimitReached' },
  { type: 'error', inputs: [], name: 'NoAttendees' },
  { type: 'error', inputs: [{ name: 'owner', internalType: 'address', type: 'address' }], name: 'OwnableInvalidOwner' },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkin',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'recordId', internalType: 'uint256', type: 'uint256' }],
    name: 'getAttendees',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'recordId', internalType: 'uint256', type: 'uint256' }],
    name: 'getConditions',
    outputs: [
      {
        name: '',
        internalType: 'struct AbstractBasicModule.Conditions',
        type: 'tuple',
        components: [
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'endDate', internalType: 'uint256', type: 'uint256' },
          { name: 'depositFee', internalType: 'uint256', type: 'uint256' },
          { name: 'maxParticipants', internalType: 'uint256', type: 'uint256' },
          { name: 'tokenAddress', internalType: 'address', type: 'address' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'recordId', internalType: 'uint256', type: 'uint256' }],
    name: 'getRegistrationInfo',
    outputs: [
      { name: 'totalDepositAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'totalRegistrations', internalType: 'uint256', type: 'uint256' },
      { name: 'totalAttendees', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'recordId', internalType: 'uint256', type: 'uint256' }],
    name: 'getRegistrations',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
    ],
    name: 'isRegistered',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'renounceOwnership', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'settle',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BasicEther
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x33FF944E8504B674835A5BEd88f10f11bEC92c2c)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x33FF944E8504B674835A5BEd88f10f11bEC92c2c)
 */
export const basicEtherABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
  },
  { type: 'error', inputs: [], name: 'AlreadyRegistered' },
  { type: 'error', inputs: [], name: 'AlreadyStarted' },
  { type: 'error', inputs: [], name: 'IncorrectValue' },
  { type: 'error', inputs: [], name: 'InvalidAddress' },
  { type: 'error', inputs: [], name: 'InvalidDate' },
  { type: 'error', inputs: [], name: 'LimitReached' },
  { type: 'error', inputs: [], name: 'NoAttendees' },
  { type: 'error', inputs: [{ name: 'owner', internalType: 'address', type: 'address' }], name: 'OwnableInvalidOwner' },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkin',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'recordId', internalType: 'uint256', type: 'uint256' }],
    name: 'getAttendees',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'recordId', internalType: 'uint256', type: 'uint256' }],
    name: 'getConditions',
    outputs: [
      {
        name: '',
        internalType: 'struct AbstractBasicModule.Conditions',
        type: 'tuple',
        components: [
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'endDate', internalType: 'uint256', type: 'uint256' },
          { name: 'depositFee', internalType: 'uint256', type: 'uint256' },
          { name: 'maxParticipants', internalType: 'uint256', type: 'uint256' },
          { name: 'tokenAddress', internalType: 'address', type: 'address' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'recordId', internalType: 'uint256', type: 'uint256' }],
    name: 'getRegistrationInfo',
    outputs: [
      { name: 'totalDepositAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'totalRegistrations', internalType: 'uint256', type: 'uint256' },
      { name: 'totalAttendees', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'recordId', internalType: 'uint256', type: 'uint256' }],
    name: 'getRegistrations',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
    ],
    name: 'isRegistered',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'renounceOwnership', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'settle',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
] as const

/**
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x33FF944E8504B674835A5BEd88f10f11bEC92c2c)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x33FF944E8504B674835A5BEd88f10f11bEC92c2c)
 */
export const basicEtherAddress = {
  10: '0x33FF944E8504B674835A5BEd88f10f11bEC92c2c',
  11155111: '0x33FF944E8504B674835A5BEd88f10f11bEC92c2c',
} as const

/**
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x33FF944E8504B674835A5BEd88f10f11bEC92c2c)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x33FF944E8504B674835A5BEd88f10f11bEC92c2c)
 */
export const basicEtherConfig = { address: basicEtherAddress, abi: basicEtherABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BasicToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x33132fE88fe8316881474b551CA2DDD277A320a0)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x33132fE88fe8316881474b551CA2DDD277A320a0)
 */
export const basicTokenABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
  },
  { type: 'error', inputs: [], name: 'AlreadyRegistered' },
  { type: 'error', inputs: [], name: 'AlreadyStarted' },
  { type: 'error', inputs: [], name: 'IncorrectValue' },
  { type: 'error', inputs: [], name: 'InvalidAddress' },
  { type: 'error', inputs: [], name: 'InvalidDate' },
  { type: 'error', inputs: [], name: 'LimitReached' },
  { type: 'error', inputs: [], name: 'NoAttendees' },
  { type: 'error', inputs: [{ name: 'owner', internalType: 'address', type: 'address' }], name: 'OwnableInvalidOwner' },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkin',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'recordId', internalType: 'uint256', type: 'uint256' }],
    name: 'getAttendees',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'recordId', internalType: 'uint256', type: 'uint256' }],
    name: 'getConditions',
    outputs: [
      {
        name: '',
        internalType: 'struct AbstractBasicModule.Conditions',
        type: 'tuple',
        components: [
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'endDate', internalType: 'uint256', type: 'uint256' },
          { name: 'depositFee', internalType: 'uint256', type: 'uint256' },
          { name: 'maxParticipants', internalType: 'uint256', type: 'uint256' },
          { name: 'tokenAddress', internalType: 'address', type: 'address' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'recordId', internalType: 'uint256', type: 'uint256' }],
    name: 'getRegistrationInfo',
    outputs: [
      { name: 'totalDepositAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'totalRegistrations', internalType: 'uint256', type: 'uint256' },
      { name: 'totalAttendees', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'recordId', internalType: 'uint256', type: 'uint256' }],
    name: 'getRegistrations',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
    ],
    name: 'isRegistered',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'renounceOwnership', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'settle',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
] as const

/**
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x33132fE88fe8316881474b551CA2DDD277A320a0)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x33132fE88fe8316881474b551CA2DDD277A320a0)
 */
export const basicTokenAddress = {
  10: '0x33132fE88fe8316881474b551CA2DDD277A320a0',
  11155111: '0x33132fE88fe8316881474b551CA2DDD277A320a0',
} as const

/**
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x33132fE88fe8316881474b551CA2DDD277A320a0)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x33132fE88fe8316881474b551CA2DDD277A320a0)
 */
export const basicTokenConfig = { address: basicTokenAddress, abi: basicTokenABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20ABI = [
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  { type: 'error', inputs: [{ name: 'sender', internalType: 'address', type: 'address' }], name: 'ERC20InvalidSender' },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'spender', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IConditionModule
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iConditionModuleABI = [
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkin',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recordId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'settle',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1155Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1155ErrorsABI = [
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidApprover',
  },
  {
    type: 'error',
    inputs: [
      { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'valuesLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InvalidArrayLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1155MissingApprovalForAll',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20ABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'spender', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20ErrorsABI = [
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  { type: 'error', inputs: [{ name: 'sender', internalType: 'address', type: 'address' }], name: 'ERC20InvalidSender' },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Metadata
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20MetadataABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'spender', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC721Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc721ErrorsABI = [
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC721IncorrectOwner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC721InsufficientApproval',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOperator',
  },
  { type: 'error', inputs: [{ name: 'owner', internalType: 'address', type: 'address' }], name: 'ERC721InvalidOwner' },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC721NonexistentToken',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iRegistryABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'reason', internalType: 'string', type: 'string', indexed: false },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'sender', internalType: 'address', type: 'address', indexed: false },
      { name: 'timestamp', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Canceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'attendees', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'sender', internalType: 'address', type: 'address', indexed: false },
      { name: 'timestamp', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'CheckedIn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'conditionModule', internalType: 'address', type: 'address', indexed: true },
      { name: 'whitelisted', internalType: 'bool', type: 'bool', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: false },
      { name: 'timestamp', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ConditionModuleWhitelisted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'contentUri', internalType: 'string', type: 'string', indexed: false },
      { name: 'conditionModule', internalType: 'address', type: 'address', indexed: true },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'sender', internalType: 'address', type: 'address', indexed: false },
      { name: 'timestamp', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Created',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'participant', internalType: 'address', type: 'address', indexed: true },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'sender', internalType: 'address', type: 'address', indexed: false },
      { name: 'timestamp', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Registered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'sender', internalType: 'address', type: 'address', indexed: false },
      { name: 'timestamp', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Settled',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkin',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'contentUri', internalType: 'string', type: 'string' },
      { name: 'conditionModule', internalType: 'address', type: 'address' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'create',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getRecord',
    outputs: [
      {
        name: '',
        internalType: 'struct Record',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'status', internalType: 'enum Status', type: 'uint8' },
          { name: 'contentUri', internalType: 'string', type: 'string' },
          { name: 'conditionModule', internalType: 'address', type: 'address' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'conditionModule', internalType: 'address', type: 'address' }],
    name: 'isConditionModuleWhitelisted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'settle',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'conditionModule', internalType: 'address', type: 'address' },
      { name: 'whitelist', internalType: 'bool', type: 'bool' },
    ],
    name: 'whitelistConditionModule',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Math
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mathABI = [{ type: 'error', inputs: [], name: 'MathOverflowedMulDiv' }] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Ownable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ownableABI = [
  { type: 'error', inputs: [{ name: 'owner', internalType: 'address', type: 'address' }], name: 'OwnableInvalidOwner' },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'renounceOwnership', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Registry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2)
 */
export const registryABI = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  { type: 'error', inputs: [], name: 'AccessDenied' },
  { type: 'error', inputs: [], name: 'InactiveRecord' },
  { type: 'error', inputs: [], name: 'NotFound' },
  { type: 'error', inputs: [], name: 'NotWhitelisted' },
  { type: 'error', inputs: [{ name: 'owner', internalType: 'address', type: 'address' }], name: 'OwnableInvalidOwner' },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'reason', internalType: 'string', type: 'string', indexed: false },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'sender', internalType: 'address', type: 'address', indexed: false },
      { name: 'timestamp', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Canceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'attendees', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'sender', internalType: 'address', type: 'address', indexed: false },
      { name: 'timestamp', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'CheckedIn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'conditionModule', internalType: 'address', type: 'address', indexed: true },
      { name: 'whitelisted', internalType: 'bool', type: 'bool', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: false },
      { name: 'timestamp', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ConditionModuleWhitelisted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'contentUri', internalType: 'string', type: 'string', indexed: false },
      { name: 'conditionModule', internalType: 'address', type: 'address', indexed: true },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'sender', internalType: 'address', type: 'address', indexed: false },
      { name: 'timestamp', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Created',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'participant', internalType: 'address', type: 'address', indexed: true },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'sender', internalType: 'address', type: 'address', indexed: false },
      { name: 'timestamp', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Registered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'sender', internalType: 'address', type: 'address', indexed: false },
      { name: 'timestamp', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Settled',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkin',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'contentUri', internalType: 'string', type: 'string' },
      { name: 'conditionModule', internalType: 'address', type: 'address' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'create',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getRecord',
    outputs: [
      {
        name: '',
        internalType: 'struct Record',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'status', internalType: 'enum Status', type: 'uint8' },
          { name: 'contentUri', internalType: 'string', type: 'string' },
          { name: 'conditionModule', internalType: 'address', type: 'address' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'conditionModule', internalType: 'address', type: 'address' }],
    name: 'isConditionModuleWhitelisted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'renounceOwnership', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'settle',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'conditionModule', internalType: 'address', type: 'address' },
      { name: 'enable', internalType: 'bool', type: 'bool' },
    ],
    name: 'whitelistConditionModule',
    outputs: [],
  },
] as const

/**
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2)
 */
export const registryAddress = {
  10: '0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2',
  11155111: '0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2',
} as const

/**
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2)
 */
export const registryConfig = { address: registryAddress, abi: registryABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Token
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenABI = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  { type: 'error', inputs: [{ name: 'sender', internalType: 'address', type: 'address' }], name: 'ERC20InvalidSender' },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  { type: 'error', inputs: [{ name: 'owner', internalType: 'address', type: 'address' }], name: 'OwnableInvalidOwner' },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'spender', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'renounceOwnership', outputs: [] },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Core
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link abstractBasicModuleABI}__.
 */
export function getAbstractBasicModule(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: abstractBasicModuleABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link abstractBasicModuleABI}__.
 */
export function readAbstractBasicModule<
  TAbi extends readonly unknown[] = typeof abstractBasicModuleABI,
  TFunctionName extends string = string,
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return readContract({ abi: abstractBasicModuleABI, ...config } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link abstractBasicModuleABI}__.
 */
export function writeAbstractBasicModule<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof abstractBasicModuleABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof abstractBasicModuleABI, TFunctionName>, 'abi'>
) {
  return writeContract({ abi: abstractBasicModuleABI, ...config } as unknown as WriteContractArgs<
    typeof abstractBasicModuleABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link abstractBasicModuleABI}__.
 */
export function prepareWriteAbstractBasicModule<
  TAbi extends readonly unknown[] = typeof abstractBasicModuleABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({ abi: abstractBasicModuleABI, ...config } as unknown as PrepareWriteContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link basicEtherABI}__.
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x33FF944E8504B674835A5BEd88f10f11bEC92c2c)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x33FF944E8504B674835A5BEd88f10f11bEC92c2c)
 */
export function getBasicEther(
  config: Omit<GetContractArgs, 'abi' | 'address'> & { chainId?: keyof typeof basicEtherAddress }
) {
  return getContract({
    abi: basicEtherABI,
    address: basicEtherAddress[config.chainId as keyof typeof basicEtherAddress],
    ...config,
  })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link basicEtherABI}__.
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x33FF944E8504B674835A5BEd88f10f11bEC92c2c)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x33FF944E8504B674835A5BEd88f10f11bEC92c2c)
 */
export function readBasicEther<
  TAbi extends readonly unknown[] = typeof basicEtherABI,
  TFunctionName extends string = string,
>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof basicEtherAddress
  }
) {
  return readContract({
    abi: basicEtherABI,
    address: basicEtherAddress[config.chainId as keyof typeof basicEtherAddress],
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link basicEtherABI}__.
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x33FF944E8504B674835A5BEd88f10f11bEC92c2c)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x33FF944E8504B674835A5BEd88f10f11bEC92c2c)
 */
export function writeBasicEther<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof basicEtherAddress,
>(
  config:
    | (Omit<WriteContractPreparedArgs<typeof basicEtherABI, TFunctionName>, 'abi' | 'address'> & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof basicEtherAddress
      })
    | (Omit<WriteContractUnpreparedArgs<typeof basicEtherABI, TFunctionName>, 'abi' | 'address'> & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof basicEtherAddress
      })
) {
  return writeContract({
    abi: basicEtherABI,
    address: basicEtherAddress[config.chainId as keyof typeof basicEtherAddress],
    ...config,
  } as unknown as WriteContractArgs<typeof basicEtherABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link basicEtherABI}__.
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x33FF944E8504B674835A5BEd88f10f11bEC92c2c)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x33FF944E8504B674835A5BEd88f10f11bEC92c2c)
 */
export function prepareWriteBasicEther<
  TAbi extends readonly unknown[] = typeof basicEtherABI,
  TFunctionName extends string = string,
>(
  config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof basicEtherAddress
  }
) {
  return prepareWriteContract({
    abi: basicEtherABI,
    address: basicEtherAddress[config.chainId as keyof typeof basicEtherAddress],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link basicTokenABI}__.
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x33132fE88fe8316881474b551CA2DDD277A320a0)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x33132fE88fe8316881474b551CA2DDD277A320a0)
 */
export function getBasicToken(
  config: Omit<GetContractArgs, 'abi' | 'address'> & { chainId?: keyof typeof basicTokenAddress }
) {
  return getContract({
    abi: basicTokenABI,
    address: basicTokenAddress[config.chainId as keyof typeof basicTokenAddress],
    ...config,
  })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link basicTokenABI}__.
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x33132fE88fe8316881474b551CA2DDD277A320a0)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x33132fE88fe8316881474b551CA2DDD277A320a0)
 */
export function readBasicToken<
  TAbi extends readonly unknown[] = typeof basicTokenABI,
  TFunctionName extends string = string,
>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof basicTokenAddress
  }
) {
  return readContract({
    abi: basicTokenABI,
    address: basicTokenAddress[config.chainId as keyof typeof basicTokenAddress],
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link basicTokenABI}__.
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x33132fE88fe8316881474b551CA2DDD277A320a0)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x33132fE88fe8316881474b551CA2DDD277A320a0)
 */
export function writeBasicToken<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof basicTokenAddress,
>(
  config:
    | (Omit<WriteContractPreparedArgs<typeof basicTokenABI, TFunctionName>, 'abi' | 'address'> & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof basicTokenAddress
      })
    | (Omit<WriteContractUnpreparedArgs<typeof basicTokenABI, TFunctionName>, 'abi' | 'address'> & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof basicTokenAddress
      })
) {
  return writeContract({
    abi: basicTokenABI,
    address: basicTokenAddress[config.chainId as keyof typeof basicTokenAddress],
    ...config,
  } as unknown as WriteContractArgs<typeof basicTokenABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link basicTokenABI}__.
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x33132fE88fe8316881474b551CA2DDD277A320a0)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x33132fE88fe8316881474b551CA2DDD277A320a0)
 */
export function prepareWriteBasicToken<
  TAbi extends readonly unknown[] = typeof basicTokenABI,
  TFunctionName extends string = string,
>(
  config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof basicTokenAddress
  }
) {
  return prepareWriteContract({
    abi: basicTokenABI,
    address: basicTokenAddress[config.chainId as keyof typeof basicTokenAddress],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link erc20ABI}__.
 */
export function getErc20(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: erc20ABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20ABI}__.
 */
export function readErc20<TAbi extends readonly unknown[] = typeof erc20ABI, TFunctionName extends string = string>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>
) {
  return readContract({ abi: erc20ABI, ...config } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20ABI}__.
 */
export function writeErc20<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof erc20ABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof erc20ABI, TFunctionName>, 'abi'>
) {
  return writeContract({ abi: erc20ABI, ...config } as unknown as WriteContractArgs<typeof erc20ABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link erc20ABI}__.
 */
export function prepareWriteErc20<
  TAbi extends readonly unknown[] = typeof erc20ABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({ abi: erc20ABI, ...config } as unknown as PrepareWriteContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link iConditionModuleABI}__.
 */
export function getIConditionModule(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: iConditionModuleABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iConditionModuleABI}__.
 */
export function readIConditionModule<
  TAbi extends readonly unknown[] = typeof iConditionModuleABI,
  TFunctionName extends string = string,
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return readContract({ abi: iConditionModuleABI, ...config } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iConditionModuleABI}__.
 */
export function writeIConditionModule<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof iConditionModuleABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof iConditionModuleABI, TFunctionName>, 'abi'>
) {
  return writeContract({ abi: iConditionModuleABI, ...config } as unknown as WriteContractArgs<
    typeof iConditionModuleABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link iConditionModuleABI}__.
 */
export function prepareWriteIConditionModule<
  TAbi extends readonly unknown[] = typeof iConditionModuleABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({ abi: iConditionModuleABI, ...config } as unknown as PrepareWriteContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link ierc1155ErrorsABI}__.
 */
export function getIerc1155Errors(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: ierc1155ErrorsABI, ...config })
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link ierc20ABI}__.
 */
export function getIerc20(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: ierc20ABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20ABI}__.
 */
export function readIerc20<TAbi extends readonly unknown[] = typeof ierc20ABI, TFunctionName extends string = string>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>
) {
  return readContract({ abi: ierc20ABI, ...config } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20ABI}__.
 */
export function writeIerc20<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof ierc20ABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof ierc20ABI, TFunctionName>, 'abi'>
) {
  return writeContract({ abi: ierc20ABI, ...config } as unknown as WriteContractArgs<typeof ierc20ABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link ierc20ABI}__.
 */
export function prepareWriteIerc20<
  TAbi extends readonly unknown[] = typeof ierc20ABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({ abi: ierc20ABI, ...config } as unknown as PrepareWriteContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link ierc20ErrorsABI}__.
 */
export function getIerc20Errors(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: ierc20ErrorsABI, ...config })
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link ierc20MetadataABI}__.
 */
export function getIerc20Metadata(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: ierc20MetadataABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20MetadataABI}__.
 */
export function readIerc20Metadata<
  TAbi extends readonly unknown[] = typeof ierc20MetadataABI,
  TFunctionName extends string = string,
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return readContract({ abi: ierc20MetadataABI, ...config } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20MetadataABI}__.
 */
export function writeIerc20Metadata<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof ierc20MetadataABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof ierc20MetadataABI, TFunctionName>, 'abi'>
) {
  return writeContract({ abi: ierc20MetadataABI, ...config } as unknown as WriteContractArgs<
    typeof ierc20MetadataABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link ierc20MetadataABI}__.
 */
export function prepareWriteIerc20Metadata<
  TAbi extends readonly unknown[] = typeof ierc20MetadataABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({ abi: ierc20MetadataABI, ...config } as unknown as PrepareWriteContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link ierc721ErrorsABI}__.
 */
export function getIerc721Errors(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: ierc721ErrorsABI, ...config })
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link iRegistryABI}__.
 */
export function getIRegistry(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: iRegistryABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iRegistryABI}__.
 */
export function readIRegistry<
  TAbi extends readonly unknown[] = typeof iRegistryABI,
  TFunctionName extends string = string,
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return readContract({ abi: iRegistryABI, ...config } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iRegistryABI}__.
 */
export function writeIRegistry<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof iRegistryABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof iRegistryABI, TFunctionName>, 'abi'>
) {
  return writeContract({ abi: iRegistryABI, ...config } as unknown as WriteContractArgs<
    typeof iRegistryABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link iRegistryABI}__.
 */
export function prepareWriteIRegistry<
  TAbi extends readonly unknown[] = typeof iRegistryABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({ abi: iRegistryABI, ...config } as unknown as PrepareWriteContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link mathABI}__.
 */
export function getMath(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: mathABI, ...config })
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link ownableABI}__.
 */
export function getOwnable(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: ownableABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ownableABI}__.
 */
export function readOwnable<TAbi extends readonly unknown[] = typeof ownableABI, TFunctionName extends string = string>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>
) {
  return readContract({ abi: ownableABI, ...config } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ownableABI}__.
 */
export function writeOwnable<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof ownableABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof ownableABI, TFunctionName>, 'abi'>
) {
  return writeContract({ abi: ownableABI, ...config } as unknown as WriteContractArgs<typeof ownableABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link ownableABI}__.
 */
export function prepareWriteOwnable<
  TAbi extends readonly unknown[] = typeof ownableABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({ abi: ownableABI, ...config } as unknown as PrepareWriteContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link registryABI}__.
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2)
 */
export function getRegistry(
  config: Omit<GetContractArgs, 'abi' | 'address'> & { chainId?: keyof typeof registryAddress }
) {
  return getContract({
    abi: registryABI,
    address: registryAddress[config.chainId as keyof typeof registryAddress],
    ...config,
  })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registryABI}__.
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2)
 */
export function readRegistry<
  TAbi extends readonly unknown[] = typeof registryABI,
  TFunctionName extends string = string,
>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & { chainId?: keyof typeof registryAddress }
) {
  return readContract({
    abi: registryABI,
    address: registryAddress[config.chainId as keyof typeof registryAddress],
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link registryABI}__.
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2)
 */
export function writeRegistry<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof registryAddress,
>(
  config:
    | (Omit<WriteContractPreparedArgs<typeof registryABI, TFunctionName>, 'abi' | 'address'> & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof registryAddress
      })
    | (Omit<WriteContractUnpreparedArgs<typeof registryABI, TFunctionName>, 'abi' | 'address'> & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof registryAddress
      })
) {
  return writeContract({
    abi: registryABI,
    address: registryAddress[config.chainId as keyof typeof registryAddress],
    ...config,
  } as unknown as WriteContractArgs<typeof registryABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link registryABI}__.
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2)
 */
export function prepareWriteRegistry<
  TAbi extends readonly unknown[] = typeof registryABI,
  TFunctionName extends string = string,
>(
  config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof registryAddress
  }
) {
  return prepareWriteContract({
    abi: registryABI,
    address: registryAddress[config.chainId as keyof typeof registryAddress],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link tokenABI}__.
 */
export function getToken(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: tokenABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link tokenABI}__.
 */
export function readToken<TAbi extends readonly unknown[] = typeof tokenABI, TFunctionName extends string = string>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>
) {
  return readContract({ abi: tokenABI, ...config } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link tokenABI}__.
 */
export function writeToken<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof tokenABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof tokenABI, TFunctionName>, 'abi'>
) {
  return writeContract({ abi: tokenABI, ...config } as unknown as WriteContractArgs<typeof tokenABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link tokenABI}__.
 */
export function prepareWriteToken<
  TAbi extends readonly unknown[] = typeof tokenABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({ abi: tokenABI, ...config } as unknown as PrepareWriteContractConfig<
    TAbi,
    TFunctionName
  >)
}
