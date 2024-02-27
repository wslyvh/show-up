import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20Abi = [
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
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FalseCreateMock
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const falseCreateMockAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'registrations', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'fund',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'settle',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FalseMock
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const falseMockAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'registrations', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'fund',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'settle',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FalseSettleMock
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const falseSettleMockAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'registrations', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'fund',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'settle',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IConditionModule
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iConditionModuleAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'registrations', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'fund',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'settle',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1155Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1155ErrorsAbi = [
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

export const ierc20Abi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20ErrorsAbi = [
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
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Metadata
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20MetadataAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC721Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc721ErrorsAbi = [
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
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOwner',
  },
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
// IShowHub
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iShowHubAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Canceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'attendees',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CheckedIn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'conditionModule',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'whitelisted',
        internalType: 'bool',
        type: 'bool',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ConditionModuleWhitelisted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'contentUri',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'endDate',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'limit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'conditionModule',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Created',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Funded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'participant',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Registered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Settled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'contentUri',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'limit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Updated',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'contentUri', internalType: 'string', type: 'string' },
      { name: 'endDate', internalType: 'uint256', type: 'uint256' },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
      { name: 'conditionModule', internalType: 'address', type: 'address' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'create',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'fund',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'conditionModule', internalType: 'address', type: 'address' }],
    name: 'isConditionModuleWhitelisted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'settle',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'contentUri', internalType: 'string', type: 'string' },
    ],
    name: 'updateContentUri',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateLimit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'updateOwner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'conditionModule', internalType: 'address', type: 'address' },
      { name: 'enable', internalType: 'bool', type: 'bool' },
    ],
    name: 'whitelistConditionModule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Math
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mathAbi = [{ type: 'error', inputs: [], name: 'MathOverflowedMulDiv' }] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Ownable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ownableAbi = [
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RecipientEther
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const recipientEtherAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'IncorrectValue' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'registrations', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'fund',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getConditions',
    outputs: [
      {
        name: '',
        internalType: 'struct RecipientEther.Conditions',
        type: 'tuple',
        components: [
          { name: 'depositFee', internalType: 'uint256', type: 'uint256' },
          { name: 'recipient', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getTotalDeposits',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getTotalFunded',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'settle',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RecipientToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const recipientTokenAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'IncorrectValue' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'registrations', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'fund',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getConditions',
    outputs: [
      {
        name: '',
        internalType: 'struct RecipientToken.Conditions',
        type: 'tuple',
        components: [
          { name: 'depositFee', internalType: 'uint256', type: 'uint256' },
          { name: 'tokenAddress', internalType: 'address', type: 'address' },
          { name: 'recipient', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getTotalDeposits',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getTotalFunded',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'settle',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ShowHub
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const showHubAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'AccessDenied' },
  { type: 'error', inputs: [], name: 'AlreadyRegistered' },
  { type: 'error', inputs: [], name: 'AlreadyStarted' },
  { type: 'error', inputs: [], name: 'InactiveRecord' },
  { type: 'error', inputs: [], name: 'InvalidDate' },
  { type: 'error', inputs: [], name: 'LimitReached' },
  { type: 'error', inputs: [], name: 'NoAttendees' },
  { type: 'error', inputs: [], name: 'NotFound' },
  { type: 'error', inputs: [], name: 'NotWhitelisted' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'UnexpectedConditionModuleError' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Canceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'attendees',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CheckedIn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'conditionModule',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'whitelisted',
        internalType: 'bool',
        type: 'bool',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ConditionModuleWhitelisted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'contentUri',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'endDate',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'limit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'conditionModule',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Created',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Funded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'participant',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Registered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Settled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'contentUri',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'limit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Updated',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'contentUri', internalType: 'string', type: 'string' },
      { name: 'endDate', internalType: 'uint256', type: 'uint256' },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
      { name: 'conditionModule', internalType: 'address', type: 'address' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'create',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'fund',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getAttendees',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getRecord',
    outputs: [
      { name: 'endDate', internalType: 'uint256', type: 'uint256' },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'status', internalType: 'enum Status', type: 'uint8' },
      { name: 'contentUri', internalType: 'string', type: 'string' },
      { name: 'conditionModule', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getRegistrations',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
    ],
    name: 'isAttending',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'conditionModule', internalType: 'address', type: 'address' }],
    name: 'isConditionModuleWhitelisted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
    ],
    name: 'isRegistered',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'conditionModuleData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'settle',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'contentUri', internalType: 'string', type: 'string' },
    ],
    name: 'updateContentUri',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateLimit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'updateOwner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'conditionModule', internalType: 'address', type: 'address' },
      { name: 'enable', internalType: 'bool', type: 'bool' },
    ],
    name: 'whitelistConditionModule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const showHubAddress = {
  10: '0x27d81f79D12327370cdB18DdEa03080621AEAadC',
  8453: '0x27d81f79D12327370cdB18DdEa03080621AEAadC',
  84532: '0x27d81f79D12327370cdB18DdEa03080621AEAadC',
  11155111: '0x27d81f79D12327370cdB18DdEa03080621AEAadC',
} as const

/**
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const showHubConfig = {
  address: showHubAddress,
  abi: showHubAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SplitEther
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const splitEtherAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'IncorrectValue' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'registrations', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'fund',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getConditions',
    outputs: [
      {
        name: '',
        internalType: 'struct SplitEther.Conditions',
        type: 'tuple',
        components: [{ name: 'depositFee', internalType: 'uint256', type: 'uint256' }],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getTotalDeposits',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getTotalFunded',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'settle',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SplitToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const splitTokenAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'IncorrectValue' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'registrations', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'fund',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getConditions',
    outputs: [
      {
        name: '',
        internalType: 'struct SplitToken.Conditions',
        type: 'tuple',
        components: [
          { name: 'depositFee', internalType: 'uint256', type: 'uint256' },
          { name: 'tokenAddress', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getTotalDeposits',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getTotalFunded',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'settle',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Token
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
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
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TrueMock
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const trueMockAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'registrations', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'fund',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendees', internalType: 'address[]', type: 'address[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'settle',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const readErc20 = /*#__PURE__*/ createReadContract({ abi: erc20Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"allowance"`
 */
export const readErc20Allowance = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const readErc20BalanceOf = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"decimals"`
 */
export const readErc20Decimals = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"name"`
 */
export const readErc20Name = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"symbol"`
 */
export const readErc20Symbol = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const readErc20TotalSupply = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const writeErc20 = /*#__PURE__*/ createWriteContract({ abi: erc20Abi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const writeErc20Approve = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const writeErc20Transfer = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const writeErc20TransferFrom = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const simulateErc20 = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const simulateErc20Approve = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const simulateErc20Transfer = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateErc20TransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20Abi}__
 */
export const watchErc20Event = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20Abi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Approval"`
 */
export const watchErc20ApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20Abi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const watchErc20TransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20Abi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link falseCreateMockAbi}__
 */
export const readFalseCreateMock = /*#__PURE__*/ createReadContract({
  abi: falseCreateMockAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link falseCreateMockAbi}__ and `functionName` set to `"name"`
 */
export const readFalseCreateMockName = /*#__PURE__*/ createReadContract({
  abi: falseCreateMockAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link falseCreateMockAbi}__ and `functionName` set to `"owner"`
 */
export const readFalseCreateMockOwner = /*#__PURE__*/ createReadContract({
  abi: falseCreateMockAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseCreateMockAbi}__
 */
export const writeFalseCreateMock = /*#__PURE__*/ createWriteContract({
  abi: falseCreateMockAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseCreateMockAbi}__ and `functionName` set to `"cancel"`
 */
export const writeFalseCreateMockCancel = /*#__PURE__*/ createWriteContract({
  abi: falseCreateMockAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseCreateMockAbi}__ and `functionName` set to `"checkin"`
 */
export const writeFalseCreateMockCheckin = /*#__PURE__*/ createWriteContract({
  abi: falseCreateMockAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseCreateMockAbi}__ and `functionName` set to `"fund"`
 */
export const writeFalseCreateMockFund = /*#__PURE__*/ createWriteContract({
  abi: falseCreateMockAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseCreateMockAbi}__ and `functionName` set to `"initialize"`
 */
export const writeFalseCreateMockInitialize = /*#__PURE__*/ createWriteContract({
  abi: falseCreateMockAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseCreateMockAbi}__ and `functionName` set to `"register"`
 */
export const writeFalseCreateMockRegister = /*#__PURE__*/ createWriteContract({
  abi: falseCreateMockAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseCreateMockAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeFalseCreateMockRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: falseCreateMockAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseCreateMockAbi}__ and `functionName` set to `"settle"`
 */
export const writeFalseCreateMockSettle = /*#__PURE__*/ createWriteContract({
  abi: falseCreateMockAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseCreateMockAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeFalseCreateMockTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: falseCreateMockAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseCreateMockAbi}__
 */
export const simulateFalseCreateMock = /*#__PURE__*/ createSimulateContract({
  abi: falseCreateMockAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseCreateMockAbi}__ and `functionName` set to `"cancel"`
 */
export const simulateFalseCreateMockCancel = /*#__PURE__*/ createSimulateContract({
  abi: falseCreateMockAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseCreateMockAbi}__ and `functionName` set to `"checkin"`
 */
export const simulateFalseCreateMockCheckin = /*#__PURE__*/ createSimulateContract({
  abi: falseCreateMockAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseCreateMockAbi}__ and `functionName` set to `"fund"`
 */
export const simulateFalseCreateMockFund = /*#__PURE__*/ createSimulateContract({
  abi: falseCreateMockAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseCreateMockAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateFalseCreateMockInitialize = /*#__PURE__*/ createSimulateContract({
  abi: falseCreateMockAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseCreateMockAbi}__ and `functionName` set to `"register"`
 */
export const simulateFalseCreateMockRegister = /*#__PURE__*/ createSimulateContract({
  abi: falseCreateMockAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseCreateMockAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateFalseCreateMockRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: falseCreateMockAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseCreateMockAbi}__ and `functionName` set to `"settle"`
 */
export const simulateFalseCreateMockSettle = /*#__PURE__*/ createSimulateContract({
  abi: falseCreateMockAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseCreateMockAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateFalseCreateMockTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: falseCreateMockAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link falseCreateMockAbi}__
 */
export const watchFalseCreateMockEvent = /*#__PURE__*/ createWatchContractEvent({ abi: falseCreateMockAbi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link falseCreateMockAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchFalseCreateMockOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: falseCreateMockAbi,
  eventName: 'OwnershipTransferred',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link falseMockAbi}__
 */
export const readFalseMock = /*#__PURE__*/ createReadContract({
  abi: falseMockAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link falseMockAbi}__ and `functionName` set to `"name"`
 */
export const readFalseMockName = /*#__PURE__*/ createReadContract({
  abi: falseMockAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link falseMockAbi}__ and `functionName` set to `"owner"`
 */
export const readFalseMockOwner = /*#__PURE__*/ createReadContract({
  abi: falseMockAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseMockAbi}__
 */
export const writeFalseMock = /*#__PURE__*/ createWriteContract({
  abi: falseMockAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseMockAbi}__ and `functionName` set to `"cancel"`
 */
export const writeFalseMockCancel = /*#__PURE__*/ createWriteContract({
  abi: falseMockAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseMockAbi}__ and `functionName` set to `"checkin"`
 */
export const writeFalseMockCheckin = /*#__PURE__*/ createWriteContract({
  abi: falseMockAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseMockAbi}__ and `functionName` set to `"fund"`
 */
export const writeFalseMockFund = /*#__PURE__*/ createWriteContract({
  abi: falseMockAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseMockAbi}__ and `functionName` set to `"initialize"`
 */
export const writeFalseMockInitialize = /*#__PURE__*/ createWriteContract({
  abi: falseMockAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseMockAbi}__ and `functionName` set to `"register"`
 */
export const writeFalseMockRegister = /*#__PURE__*/ createWriteContract({
  abi: falseMockAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseMockAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeFalseMockRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: falseMockAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseMockAbi}__ and `functionName` set to `"settle"`
 */
export const writeFalseMockSettle = /*#__PURE__*/ createWriteContract({
  abi: falseMockAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseMockAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeFalseMockTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: falseMockAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseMockAbi}__
 */
export const simulateFalseMock = /*#__PURE__*/ createSimulateContract({
  abi: falseMockAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseMockAbi}__ and `functionName` set to `"cancel"`
 */
export const simulateFalseMockCancel = /*#__PURE__*/ createSimulateContract({
  abi: falseMockAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseMockAbi}__ and `functionName` set to `"checkin"`
 */
export const simulateFalseMockCheckin = /*#__PURE__*/ createSimulateContract({
  abi: falseMockAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseMockAbi}__ and `functionName` set to `"fund"`
 */
export const simulateFalseMockFund = /*#__PURE__*/ createSimulateContract({
  abi: falseMockAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseMockAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateFalseMockInitialize = /*#__PURE__*/ createSimulateContract({
  abi: falseMockAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseMockAbi}__ and `functionName` set to `"register"`
 */
export const simulateFalseMockRegister = /*#__PURE__*/ createSimulateContract({
  abi: falseMockAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseMockAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateFalseMockRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: falseMockAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseMockAbi}__ and `functionName` set to `"settle"`
 */
export const simulateFalseMockSettle = /*#__PURE__*/ createSimulateContract({
  abi: falseMockAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseMockAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateFalseMockTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: falseMockAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link falseMockAbi}__
 */
export const watchFalseMockEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: falseMockAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link falseMockAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchFalseMockOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: falseMockAbi,
  eventName: 'OwnershipTransferred',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link falseSettleMockAbi}__
 */
export const readFalseSettleMock = /*#__PURE__*/ createReadContract({
  abi: falseSettleMockAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link falseSettleMockAbi}__ and `functionName` set to `"name"`
 */
export const readFalseSettleMockName = /*#__PURE__*/ createReadContract({
  abi: falseSettleMockAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link falseSettleMockAbi}__ and `functionName` set to `"owner"`
 */
export const readFalseSettleMockOwner = /*#__PURE__*/ createReadContract({
  abi: falseSettleMockAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseSettleMockAbi}__
 */
export const writeFalseSettleMock = /*#__PURE__*/ createWriteContract({
  abi: falseSettleMockAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseSettleMockAbi}__ and `functionName` set to `"cancel"`
 */
export const writeFalseSettleMockCancel = /*#__PURE__*/ createWriteContract({
  abi: falseSettleMockAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseSettleMockAbi}__ and `functionName` set to `"checkin"`
 */
export const writeFalseSettleMockCheckin = /*#__PURE__*/ createWriteContract({
  abi: falseSettleMockAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseSettleMockAbi}__ and `functionName` set to `"fund"`
 */
export const writeFalseSettleMockFund = /*#__PURE__*/ createWriteContract({
  abi: falseSettleMockAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseSettleMockAbi}__ and `functionName` set to `"initialize"`
 */
export const writeFalseSettleMockInitialize = /*#__PURE__*/ createWriteContract({
  abi: falseSettleMockAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseSettleMockAbi}__ and `functionName` set to `"register"`
 */
export const writeFalseSettleMockRegister = /*#__PURE__*/ createWriteContract({
  abi: falseSettleMockAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseSettleMockAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeFalseSettleMockRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: falseSettleMockAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseSettleMockAbi}__ and `functionName` set to `"settle"`
 */
export const writeFalseSettleMockSettle = /*#__PURE__*/ createWriteContract({
  abi: falseSettleMockAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link falseSettleMockAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeFalseSettleMockTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: falseSettleMockAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseSettleMockAbi}__
 */
export const simulateFalseSettleMock = /*#__PURE__*/ createSimulateContract({
  abi: falseSettleMockAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseSettleMockAbi}__ and `functionName` set to `"cancel"`
 */
export const simulateFalseSettleMockCancel = /*#__PURE__*/ createSimulateContract({
  abi: falseSettleMockAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseSettleMockAbi}__ and `functionName` set to `"checkin"`
 */
export const simulateFalseSettleMockCheckin = /*#__PURE__*/ createSimulateContract({
  abi: falseSettleMockAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseSettleMockAbi}__ and `functionName` set to `"fund"`
 */
export const simulateFalseSettleMockFund = /*#__PURE__*/ createSimulateContract({
  abi: falseSettleMockAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseSettleMockAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateFalseSettleMockInitialize = /*#__PURE__*/ createSimulateContract({
  abi: falseSettleMockAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseSettleMockAbi}__ and `functionName` set to `"register"`
 */
export const simulateFalseSettleMockRegister = /*#__PURE__*/ createSimulateContract({
  abi: falseSettleMockAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseSettleMockAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateFalseSettleMockRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: falseSettleMockAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseSettleMockAbi}__ and `functionName` set to `"settle"`
 */
export const simulateFalseSettleMockSettle = /*#__PURE__*/ createSimulateContract({
  abi: falseSettleMockAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link falseSettleMockAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateFalseSettleMockTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: falseSettleMockAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link falseSettleMockAbi}__
 */
export const watchFalseSettleMockEvent = /*#__PURE__*/ createWatchContractEvent({ abi: falseSettleMockAbi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link falseSettleMockAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchFalseSettleMockOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: falseSettleMockAbi,
  eventName: 'OwnershipTransferred',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iConditionModuleAbi}__
 */
export const readIConditionModule = /*#__PURE__*/ createReadContract({
  abi: iConditionModuleAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iConditionModuleAbi}__ and `functionName` set to `"name"`
 */
export const readIConditionModuleName = /*#__PURE__*/ createReadContract({
  abi: iConditionModuleAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iConditionModuleAbi}__
 */
export const writeIConditionModule = /*#__PURE__*/ createWriteContract({
  abi: iConditionModuleAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iConditionModuleAbi}__ and `functionName` set to `"cancel"`
 */
export const writeIConditionModuleCancel = /*#__PURE__*/ createWriteContract({
  abi: iConditionModuleAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iConditionModuleAbi}__ and `functionName` set to `"checkin"`
 */
export const writeIConditionModuleCheckin = /*#__PURE__*/ createWriteContract({
  abi: iConditionModuleAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iConditionModuleAbi}__ and `functionName` set to `"fund"`
 */
export const writeIConditionModuleFund = /*#__PURE__*/ createWriteContract({
  abi: iConditionModuleAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iConditionModuleAbi}__ and `functionName` set to `"initialize"`
 */
export const writeIConditionModuleInitialize = /*#__PURE__*/ createWriteContract({
  abi: iConditionModuleAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iConditionModuleAbi}__ and `functionName` set to `"register"`
 */
export const writeIConditionModuleRegister = /*#__PURE__*/ createWriteContract({
  abi: iConditionModuleAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iConditionModuleAbi}__ and `functionName` set to `"settle"`
 */
export const writeIConditionModuleSettle = /*#__PURE__*/ createWriteContract({
  abi: iConditionModuleAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iConditionModuleAbi}__
 */
export const simulateIConditionModule = /*#__PURE__*/ createSimulateContract({
  abi: iConditionModuleAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iConditionModuleAbi}__ and `functionName` set to `"cancel"`
 */
export const simulateIConditionModuleCancel = /*#__PURE__*/ createSimulateContract({
  abi: iConditionModuleAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iConditionModuleAbi}__ and `functionName` set to `"checkin"`
 */
export const simulateIConditionModuleCheckin = /*#__PURE__*/ createSimulateContract({
  abi: iConditionModuleAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iConditionModuleAbi}__ and `functionName` set to `"fund"`
 */
export const simulateIConditionModuleFund = /*#__PURE__*/ createSimulateContract({
  abi: iConditionModuleAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iConditionModuleAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateIConditionModuleInitialize = /*#__PURE__*/ createSimulateContract({
  abi: iConditionModuleAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iConditionModuleAbi}__ and `functionName` set to `"register"`
 */
export const simulateIConditionModuleRegister = /*#__PURE__*/ createSimulateContract({
  abi: iConditionModuleAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iConditionModuleAbi}__ and `functionName` set to `"settle"`
 */
export const simulateIConditionModuleSettle = /*#__PURE__*/ createSimulateContract({
  abi: iConditionModuleAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20Abi}__
 */
export const readIerc20 = /*#__PURE__*/ createReadContract({ abi: ierc20Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"allowance"`
 */
export const readIerc20Allowance = /*#__PURE__*/ createReadContract({
  abi: ierc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const readIerc20BalanceOf = /*#__PURE__*/ createReadContract({
  abi: ierc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const readIerc20TotalSupply = /*#__PURE__*/ createReadContract({
  abi: ierc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20Abi}__
 */
export const writeIerc20 = /*#__PURE__*/ createWriteContract({ abi: ierc20Abi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"approve"`
 */
export const writeIerc20Approve = /*#__PURE__*/ createWriteContract({
  abi: ierc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transfer"`
 */
export const writeIerc20Transfer = /*#__PURE__*/ createWriteContract({
  abi: ierc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const writeIerc20TransferFrom = /*#__PURE__*/ createWriteContract({
  abi: ierc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc20Abi}__
 */
export const simulateIerc20 = /*#__PURE__*/ createSimulateContract({
  abi: ierc20Abi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"approve"`
 */
export const simulateIerc20Approve = /*#__PURE__*/ createSimulateContract({
  abi: ierc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transfer"`
 */
export const simulateIerc20Transfer = /*#__PURE__*/ createSimulateContract({
  abi: ierc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateIerc20TransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: ierc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc20Abi}__
 */
export const watchIerc20Event = /*#__PURE__*/ createWatchContractEvent({
  abi: ierc20Abi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc20Abi}__ and `eventName` set to `"Approval"`
 */
export const watchIerc20ApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ierc20Abi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const watchIerc20TransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ierc20Abi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const readIerc20Metadata = /*#__PURE__*/ createReadContract({
  abi: ierc20MetadataAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"allowance"`
 */
export const readIerc20MetadataAllowance = /*#__PURE__*/ createReadContract({
  abi: ierc20MetadataAbi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readIerc20MetadataBalanceOf = /*#__PURE__*/ createReadContract({
  abi: ierc20MetadataAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"decimals"`
 */
export const readIerc20MetadataDecimals = /*#__PURE__*/ createReadContract({
  abi: ierc20MetadataAbi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"name"`
 */
export const readIerc20MetadataName = /*#__PURE__*/ createReadContract({
  abi: ierc20MetadataAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"symbol"`
 */
export const readIerc20MetadataSymbol = /*#__PURE__*/ createReadContract({
  abi: ierc20MetadataAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"totalSupply"`
 */
export const readIerc20MetadataTotalSupply = /*#__PURE__*/ createReadContract({
  abi: ierc20MetadataAbi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const writeIerc20Metadata = /*#__PURE__*/ createWriteContract({
  abi: ierc20MetadataAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"approve"`
 */
export const writeIerc20MetadataApprove = /*#__PURE__*/ createWriteContract({
  abi: ierc20MetadataAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transfer"`
 */
export const writeIerc20MetadataTransfer = /*#__PURE__*/ createWriteContract({
  abi: ierc20MetadataAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writeIerc20MetadataTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: ierc20MetadataAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const simulateIerc20Metadata = /*#__PURE__*/ createSimulateContract({
  abi: ierc20MetadataAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"approve"`
 */
export const simulateIerc20MetadataApprove = /*#__PURE__*/ createSimulateContract({
  abi: ierc20MetadataAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transfer"`
 */
export const simulateIerc20MetadataTransfer = /*#__PURE__*/ createSimulateContract({
  abi: ierc20MetadataAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateIerc20MetadataTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: ierc20MetadataAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const watchIerc20MetadataEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ierc20MetadataAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `eventName` set to `"Approval"`
 */
export const watchIerc20MetadataApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ierc20MetadataAbi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchIerc20MetadataTransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ierc20MetadataAbi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iShowHubAbi}__
 */
export const readIShowHub = /*#__PURE__*/ createReadContract({
  abi: iShowHubAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"isConditionModuleWhitelisted"`
 */
export const readIShowHubIsConditionModuleWhitelisted = /*#__PURE__*/ createReadContract({
  abi: iShowHubAbi,
  functionName: 'isConditionModuleWhitelisted',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iShowHubAbi}__
 */
export const writeIShowHub = /*#__PURE__*/ createWriteContract({
  abi: iShowHubAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"cancel"`
 */
export const writeIShowHubCancel = /*#__PURE__*/ createWriteContract({
  abi: iShowHubAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"checkin"`
 */
export const writeIShowHubCheckin = /*#__PURE__*/ createWriteContract({
  abi: iShowHubAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"create"`
 */
export const writeIShowHubCreate = /*#__PURE__*/ createWriteContract({
  abi: iShowHubAbi,
  functionName: 'create',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"fund"`
 */
export const writeIShowHubFund = /*#__PURE__*/ createWriteContract({
  abi: iShowHubAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"register"`
 */
export const writeIShowHubRegister = /*#__PURE__*/ createWriteContract({
  abi: iShowHubAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"settle"`
 */
export const writeIShowHubSettle = /*#__PURE__*/ createWriteContract({
  abi: iShowHubAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"updateContentUri"`
 */
export const writeIShowHubUpdateContentUri = /*#__PURE__*/ createWriteContract({
  abi: iShowHubAbi,
  functionName: 'updateContentUri',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"updateLimit"`
 */
export const writeIShowHubUpdateLimit = /*#__PURE__*/ createWriteContract({
  abi: iShowHubAbi,
  functionName: 'updateLimit',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"updateOwner"`
 */
export const writeIShowHubUpdateOwner = /*#__PURE__*/ createWriteContract({
  abi: iShowHubAbi,
  functionName: 'updateOwner',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"whitelistConditionModule"`
 */
export const writeIShowHubWhitelistConditionModule = /*#__PURE__*/ createWriteContract({
  abi: iShowHubAbi,
  functionName: 'whitelistConditionModule',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iShowHubAbi}__
 */
export const simulateIShowHub = /*#__PURE__*/ createSimulateContract({
  abi: iShowHubAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"cancel"`
 */
export const simulateIShowHubCancel = /*#__PURE__*/ createSimulateContract({
  abi: iShowHubAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"checkin"`
 */
export const simulateIShowHubCheckin = /*#__PURE__*/ createSimulateContract({
  abi: iShowHubAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"create"`
 */
export const simulateIShowHubCreate = /*#__PURE__*/ createSimulateContract({
  abi: iShowHubAbi,
  functionName: 'create',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"fund"`
 */
export const simulateIShowHubFund = /*#__PURE__*/ createSimulateContract({
  abi: iShowHubAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"register"`
 */
export const simulateIShowHubRegister = /*#__PURE__*/ createSimulateContract({
  abi: iShowHubAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"settle"`
 */
export const simulateIShowHubSettle = /*#__PURE__*/ createSimulateContract({
  abi: iShowHubAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"updateContentUri"`
 */
export const simulateIShowHubUpdateContentUri = /*#__PURE__*/ createSimulateContract({
  abi: iShowHubAbi,
  functionName: 'updateContentUri',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"updateLimit"`
 */
export const simulateIShowHubUpdateLimit = /*#__PURE__*/ createSimulateContract({
  abi: iShowHubAbi,
  functionName: 'updateLimit',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"updateOwner"`
 */
export const simulateIShowHubUpdateOwner = /*#__PURE__*/ createSimulateContract({
  abi: iShowHubAbi,
  functionName: 'updateOwner',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iShowHubAbi}__ and `functionName` set to `"whitelistConditionModule"`
 */
export const simulateIShowHubWhitelistConditionModule = /*#__PURE__*/ createSimulateContract({
  abi: iShowHubAbi,
  functionName: 'whitelistConditionModule',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iShowHubAbi}__
 */
export const watchIShowHubEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: iShowHubAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iShowHubAbi}__ and `eventName` set to `"Canceled"`
 */
export const watchIShowHubCanceledEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: iShowHubAbi,
  eventName: 'Canceled',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iShowHubAbi}__ and `eventName` set to `"CheckedIn"`
 */
export const watchIShowHubCheckedInEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: iShowHubAbi,
  eventName: 'CheckedIn',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iShowHubAbi}__ and `eventName` set to `"ConditionModuleWhitelisted"`
 */
export const watchIShowHubConditionModuleWhitelistedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: iShowHubAbi,
  eventName: 'ConditionModuleWhitelisted',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iShowHubAbi}__ and `eventName` set to `"Created"`
 */
export const watchIShowHubCreatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: iShowHubAbi,
  eventName: 'Created',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iShowHubAbi}__ and `eventName` set to `"Funded"`
 */
export const watchIShowHubFundedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: iShowHubAbi,
  eventName: 'Funded',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iShowHubAbi}__ and `eventName` set to `"Registered"`
 */
export const watchIShowHubRegisteredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: iShowHubAbi,
  eventName: 'Registered',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iShowHubAbi}__ and `eventName` set to `"Settled"`
 */
export const watchIShowHubSettledEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: iShowHubAbi,
  eventName: 'Settled',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iShowHubAbi}__ and `eventName` set to `"Updated"`
 */
export const watchIShowHubUpdatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: iShowHubAbi,
  eventName: 'Updated',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ownableAbi}__
 */
export const readOwnable = /*#__PURE__*/ createReadContract({ abi: ownableAbi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"owner"`
 */
export const readOwnableOwner = /*#__PURE__*/ createReadContract({
  abi: ownableAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ownableAbi}__
 */
export const writeOwnable = /*#__PURE__*/ createWriteContract({
  abi: ownableAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeOwnableRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: ownableAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeOwnableTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: ownableAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ownableAbi}__
 */
export const simulateOwnable = /*#__PURE__*/ createSimulateContract({
  abi: ownableAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateOwnableRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: ownableAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateOwnableTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: ownableAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ownableAbi}__
 */
export const watchOwnableEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ownableAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ownableAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchOwnableOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ownableAbi,
  eventName: 'OwnershipTransferred',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link recipientEtherAbi}__
 */
export const readRecipientEther = /*#__PURE__*/ createReadContract({
  abi: recipientEtherAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"getConditions"`
 */
export const readRecipientEtherGetConditions = /*#__PURE__*/ createReadContract({
  abi: recipientEtherAbi,
  functionName: 'getConditions',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"getTotalDeposits"`
 */
export const readRecipientEtherGetTotalDeposits = /*#__PURE__*/ createReadContract({
  abi: recipientEtherAbi,
  functionName: 'getTotalDeposits',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"getTotalFunded"`
 */
export const readRecipientEtherGetTotalFunded = /*#__PURE__*/ createReadContract({
  abi: recipientEtherAbi,
  functionName: 'getTotalFunded',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"name"`
 */
export const readRecipientEtherName = /*#__PURE__*/ createReadContract({
  abi: recipientEtherAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"owner"`
 */
export const readRecipientEtherOwner = /*#__PURE__*/ createReadContract({
  abi: recipientEtherAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link recipientEtherAbi}__
 */
export const writeRecipientEther = /*#__PURE__*/ createWriteContract({
  abi: recipientEtherAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"cancel"`
 */
export const writeRecipientEtherCancel = /*#__PURE__*/ createWriteContract({
  abi: recipientEtherAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"checkin"`
 */
export const writeRecipientEtherCheckin = /*#__PURE__*/ createWriteContract({
  abi: recipientEtherAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"fund"`
 */
export const writeRecipientEtherFund = /*#__PURE__*/ createWriteContract({
  abi: recipientEtherAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"initialize"`
 */
export const writeRecipientEtherInitialize = /*#__PURE__*/ createWriteContract({
  abi: recipientEtherAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"register"`
 */
export const writeRecipientEtherRegister = /*#__PURE__*/ createWriteContract({
  abi: recipientEtherAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeRecipientEtherRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: recipientEtherAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"settle"`
 */
export const writeRecipientEtherSettle = /*#__PURE__*/ createWriteContract({
  abi: recipientEtherAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeRecipientEtherTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: recipientEtherAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link recipientEtherAbi}__
 */
export const simulateRecipientEther = /*#__PURE__*/ createSimulateContract({
  abi: recipientEtherAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"cancel"`
 */
export const simulateRecipientEtherCancel = /*#__PURE__*/ createSimulateContract({
  abi: recipientEtherAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"checkin"`
 */
export const simulateRecipientEtherCheckin = /*#__PURE__*/ createSimulateContract({
  abi: recipientEtherAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"fund"`
 */
export const simulateRecipientEtherFund = /*#__PURE__*/ createSimulateContract({
  abi: recipientEtherAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateRecipientEtherInitialize = /*#__PURE__*/ createSimulateContract({
  abi: recipientEtherAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"register"`
 */
export const simulateRecipientEtherRegister = /*#__PURE__*/ createSimulateContract({
  abi: recipientEtherAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateRecipientEtherRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: recipientEtherAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"settle"`
 */
export const simulateRecipientEtherSettle = /*#__PURE__*/ createSimulateContract({
  abi: recipientEtherAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link recipientEtherAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateRecipientEtherTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: recipientEtherAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link recipientEtherAbi}__
 */
export const watchRecipientEtherEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: recipientEtherAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link recipientEtherAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchRecipientEtherOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: recipientEtherAbi,
  eventName: 'OwnershipTransferred',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link recipientTokenAbi}__
 */
export const readRecipientToken = /*#__PURE__*/ createReadContract({
  abi: recipientTokenAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"getConditions"`
 */
export const readRecipientTokenGetConditions = /*#__PURE__*/ createReadContract({
  abi: recipientTokenAbi,
  functionName: 'getConditions',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"getTotalDeposits"`
 */
export const readRecipientTokenGetTotalDeposits = /*#__PURE__*/ createReadContract({
  abi: recipientTokenAbi,
  functionName: 'getTotalDeposits',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"getTotalFunded"`
 */
export const readRecipientTokenGetTotalFunded = /*#__PURE__*/ createReadContract({
  abi: recipientTokenAbi,
  functionName: 'getTotalFunded',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"name"`
 */
export const readRecipientTokenName = /*#__PURE__*/ createReadContract({
  abi: recipientTokenAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"owner"`
 */
export const readRecipientTokenOwner = /*#__PURE__*/ createReadContract({
  abi: recipientTokenAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link recipientTokenAbi}__
 */
export const writeRecipientToken = /*#__PURE__*/ createWriteContract({
  abi: recipientTokenAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"cancel"`
 */
export const writeRecipientTokenCancel = /*#__PURE__*/ createWriteContract({
  abi: recipientTokenAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"checkin"`
 */
export const writeRecipientTokenCheckin = /*#__PURE__*/ createWriteContract({
  abi: recipientTokenAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"fund"`
 */
export const writeRecipientTokenFund = /*#__PURE__*/ createWriteContract({
  abi: recipientTokenAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"initialize"`
 */
export const writeRecipientTokenInitialize = /*#__PURE__*/ createWriteContract({
  abi: recipientTokenAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"register"`
 */
export const writeRecipientTokenRegister = /*#__PURE__*/ createWriteContract({
  abi: recipientTokenAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeRecipientTokenRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: recipientTokenAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"settle"`
 */
export const writeRecipientTokenSettle = /*#__PURE__*/ createWriteContract({
  abi: recipientTokenAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeRecipientTokenTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: recipientTokenAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link recipientTokenAbi}__
 */
export const simulateRecipientToken = /*#__PURE__*/ createSimulateContract({
  abi: recipientTokenAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"cancel"`
 */
export const simulateRecipientTokenCancel = /*#__PURE__*/ createSimulateContract({
  abi: recipientTokenAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"checkin"`
 */
export const simulateRecipientTokenCheckin = /*#__PURE__*/ createSimulateContract({
  abi: recipientTokenAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"fund"`
 */
export const simulateRecipientTokenFund = /*#__PURE__*/ createSimulateContract({
  abi: recipientTokenAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateRecipientTokenInitialize = /*#__PURE__*/ createSimulateContract({
  abi: recipientTokenAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"register"`
 */
export const simulateRecipientTokenRegister = /*#__PURE__*/ createSimulateContract({
  abi: recipientTokenAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateRecipientTokenRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: recipientTokenAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"settle"`
 */
export const simulateRecipientTokenSettle = /*#__PURE__*/ createSimulateContract({
  abi: recipientTokenAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link recipientTokenAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateRecipientTokenTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: recipientTokenAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link recipientTokenAbi}__
 */
export const watchRecipientTokenEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: recipientTokenAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link recipientTokenAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchRecipientTokenOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: recipientTokenAbi,
  eventName: 'OwnershipTransferred',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link showHubAbi}__
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const readShowHub = /*#__PURE__*/ createReadContract({
  abi: showHubAbi,
  address: showHubAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"getAttendees"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const readShowHubGetAttendees = /*#__PURE__*/ createReadContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'getAttendees',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"getRecord"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const readShowHubGetRecord = /*#__PURE__*/ createReadContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'getRecord',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"getRegistrations"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const readShowHubGetRegistrations = /*#__PURE__*/ createReadContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'getRegistrations',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"isAttending"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const readShowHubIsAttending = /*#__PURE__*/ createReadContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'isAttending',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"isConditionModuleWhitelisted"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const readShowHubIsConditionModuleWhitelisted = /*#__PURE__*/ createReadContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'isConditionModuleWhitelisted',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"isRegistered"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const readShowHubIsRegistered = /*#__PURE__*/ createReadContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'isRegistered',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const readShowHubOwner = /*#__PURE__*/ createReadContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link showHubAbi}__
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const writeShowHub = /*#__PURE__*/ createWriteContract({
  abi: showHubAbi,
  address: showHubAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"cancel"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const writeShowHubCancel = /*#__PURE__*/ createWriteContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'cancel',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"checkin"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const writeShowHubCheckin = /*#__PURE__*/ createWriteContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'checkin',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"create"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const writeShowHubCreate = /*#__PURE__*/ createWriteContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'create',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"fund"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const writeShowHubFund = /*#__PURE__*/ createWriteContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'fund',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"register"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const writeShowHubRegister = /*#__PURE__*/ createWriteContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'register',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const writeShowHubRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"settle"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const writeShowHubSettle = /*#__PURE__*/ createWriteContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'settle',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const writeShowHubTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"updateContentUri"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const writeShowHubUpdateContentUri = /*#__PURE__*/ createWriteContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'updateContentUri',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"updateLimit"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const writeShowHubUpdateLimit = /*#__PURE__*/ createWriteContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'updateLimit',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"updateOwner"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const writeShowHubUpdateOwner = /*#__PURE__*/ createWriteContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'updateOwner',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"whitelistConditionModule"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const writeShowHubWhitelistConditionModule = /*#__PURE__*/ createWriteContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'whitelistConditionModule',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link showHubAbi}__
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const simulateShowHub = /*#__PURE__*/ createSimulateContract({
  abi: showHubAbi,
  address: showHubAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"cancel"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const simulateShowHubCancel = /*#__PURE__*/ createSimulateContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'cancel',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"checkin"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const simulateShowHubCheckin = /*#__PURE__*/ createSimulateContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'checkin',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"create"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const simulateShowHubCreate = /*#__PURE__*/ createSimulateContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'create',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"fund"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const simulateShowHubFund = /*#__PURE__*/ createSimulateContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'fund',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"register"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const simulateShowHubRegister = /*#__PURE__*/ createSimulateContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'register',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const simulateShowHubRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"settle"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const simulateShowHubSettle = /*#__PURE__*/ createSimulateContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'settle',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const simulateShowHubTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"updateContentUri"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const simulateShowHubUpdateContentUri = /*#__PURE__*/ createSimulateContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'updateContentUri',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"updateLimit"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const simulateShowHubUpdateLimit = /*#__PURE__*/ createSimulateContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'updateLimit',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"updateOwner"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const simulateShowHubUpdateOwner = /*#__PURE__*/ createSimulateContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'updateOwner',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link showHubAbi}__ and `functionName` set to `"whitelistConditionModule"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const simulateShowHubWhitelistConditionModule = /*#__PURE__*/ createSimulateContract({
  abi: showHubAbi,
  address: showHubAddress,
  functionName: 'whitelistConditionModule',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link showHubAbi}__
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const watchShowHubEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: showHubAbi,
  address: showHubAddress,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link showHubAbi}__ and `eventName` set to `"Canceled"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const watchShowHubCanceledEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: showHubAbi,
  address: showHubAddress,
  eventName: 'Canceled',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link showHubAbi}__ and `eventName` set to `"CheckedIn"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const watchShowHubCheckedInEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: showHubAbi,
  address: showHubAddress,
  eventName: 'CheckedIn',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link showHubAbi}__ and `eventName` set to `"ConditionModuleWhitelisted"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const watchShowHubConditionModuleWhitelistedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: showHubAbi,
  address: showHubAddress,
  eventName: 'ConditionModuleWhitelisted',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link showHubAbi}__ and `eventName` set to `"Created"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const watchShowHubCreatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: showHubAbi,
  address: showHubAddress,
  eventName: 'Created',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link showHubAbi}__ and `eventName` set to `"Funded"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const watchShowHubFundedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: showHubAbi,
  address: showHubAddress,
  eventName: 'Funded',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link showHubAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const watchShowHubOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: showHubAbi,
  address: showHubAddress,
  eventName: 'OwnershipTransferred',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link showHubAbi}__ and `eventName` set to `"Registered"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const watchShowHubRegisteredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: showHubAbi,
  address: showHubAddress,
  eventName: 'Registered',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link showHubAbi}__ and `eventName` set to `"Settled"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const watchShowHubSettledEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: showHubAbi,
  address: showHubAddress,
  eventName: 'Settled',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link showHubAbi}__ and `eventName` set to `"Updated"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x27d81f79D12327370cdB18DdEa03080621AEAadC)
 */
export const watchShowHubUpdatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: showHubAbi,
  address: showHubAddress,
  eventName: 'Updated',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link splitEtherAbi}__
 */
export const readSplitEther = /*#__PURE__*/ createReadContract({
  abi: splitEtherAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"getConditions"`
 */
export const readSplitEtherGetConditions = /*#__PURE__*/ createReadContract({
  abi: splitEtherAbi,
  functionName: 'getConditions',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"getTotalDeposits"`
 */
export const readSplitEtherGetTotalDeposits = /*#__PURE__*/ createReadContract({
  abi: splitEtherAbi,
  functionName: 'getTotalDeposits',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"getTotalFunded"`
 */
export const readSplitEtherGetTotalFunded = /*#__PURE__*/ createReadContract({
  abi: splitEtherAbi,
  functionName: 'getTotalFunded',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"name"`
 */
export const readSplitEtherName = /*#__PURE__*/ createReadContract({
  abi: splitEtherAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"owner"`
 */
export const readSplitEtherOwner = /*#__PURE__*/ createReadContract({
  abi: splitEtherAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link splitEtherAbi}__
 */
export const writeSplitEther = /*#__PURE__*/ createWriteContract({
  abi: splitEtherAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"cancel"`
 */
export const writeSplitEtherCancel = /*#__PURE__*/ createWriteContract({
  abi: splitEtherAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"checkin"`
 */
export const writeSplitEtherCheckin = /*#__PURE__*/ createWriteContract({
  abi: splitEtherAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"fund"`
 */
export const writeSplitEtherFund = /*#__PURE__*/ createWriteContract({
  abi: splitEtherAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"initialize"`
 */
export const writeSplitEtherInitialize = /*#__PURE__*/ createWriteContract({
  abi: splitEtherAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"register"`
 */
export const writeSplitEtherRegister = /*#__PURE__*/ createWriteContract({
  abi: splitEtherAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeSplitEtherRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: splitEtherAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"settle"`
 */
export const writeSplitEtherSettle = /*#__PURE__*/ createWriteContract({
  abi: splitEtherAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeSplitEtherTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: splitEtherAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link splitEtherAbi}__
 */
export const simulateSplitEther = /*#__PURE__*/ createSimulateContract({
  abi: splitEtherAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"cancel"`
 */
export const simulateSplitEtherCancel = /*#__PURE__*/ createSimulateContract({
  abi: splitEtherAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"checkin"`
 */
export const simulateSplitEtherCheckin = /*#__PURE__*/ createSimulateContract({
  abi: splitEtherAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"fund"`
 */
export const simulateSplitEtherFund = /*#__PURE__*/ createSimulateContract({
  abi: splitEtherAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateSplitEtherInitialize = /*#__PURE__*/ createSimulateContract({
  abi: splitEtherAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"register"`
 */
export const simulateSplitEtherRegister = /*#__PURE__*/ createSimulateContract({
  abi: splitEtherAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateSplitEtherRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: splitEtherAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"settle"`
 */
export const simulateSplitEtherSettle = /*#__PURE__*/ createSimulateContract({
  abi: splitEtherAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link splitEtherAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateSplitEtherTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: splitEtherAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link splitEtherAbi}__
 */
export const watchSplitEtherEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: splitEtherAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link splitEtherAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchSplitEtherOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: splitEtherAbi,
  eventName: 'OwnershipTransferred',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link splitTokenAbi}__
 */
export const readSplitToken = /*#__PURE__*/ createReadContract({
  abi: splitTokenAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"getConditions"`
 */
export const readSplitTokenGetConditions = /*#__PURE__*/ createReadContract({
  abi: splitTokenAbi,
  functionName: 'getConditions',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"getTotalDeposits"`
 */
export const readSplitTokenGetTotalDeposits = /*#__PURE__*/ createReadContract({
  abi: splitTokenAbi,
  functionName: 'getTotalDeposits',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"getTotalFunded"`
 */
export const readSplitTokenGetTotalFunded = /*#__PURE__*/ createReadContract({
  abi: splitTokenAbi,
  functionName: 'getTotalFunded',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"name"`
 */
export const readSplitTokenName = /*#__PURE__*/ createReadContract({
  abi: splitTokenAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"owner"`
 */
export const readSplitTokenOwner = /*#__PURE__*/ createReadContract({
  abi: splitTokenAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link splitTokenAbi}__
 */
export const writeSplitToken = /*#__PURE__*/ createWriteContract({
  abi: splitTokenAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"cancel"`
 */
export const writeSplitTokenCancel = /*#__PURE__*/ createWriteContract({
  abi: splitTokenAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"checkin"`
 */
export const writeSplitTokenCheckin = /*#__PURE__*/ createWriteContract({
  abi: splitTokenAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"fund"`
 */
export const writeSplitTokenFund = /*#__PURE__*/ createWriteContract({
  abi: splitTokenAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"initialize"`
 */
export const writeSplitTokenInitialize = /*#__PURE__*/ createWriteContract({
  abi: splitTokenAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"register"`
 */
export const writeSplitTokenRegister = /*#__PURE__*/ createWriteContract({
  abi: splitTokenAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeSplitTokenRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: splitTokenAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"settle"`
 */
export const writeSplitTokenSettle = /*#__PURE__*/ createWriteContract({
  abi: splitTokenAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeSplitTokenTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: splitTokenAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link splitTokenAbi}__
 */
export const simulateSplitToken = /*#__PURE__*/ createSimulateContract({
  abi: splitTokenAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"cancel"`
 */
export const simulateSplitTokenCancel = /*#__PURE__*/ createSimulateContract({
  abi: splitTokenAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"checkin"`
 */
export const simulateSplitTokenCheckin = /*#__PURE__*/ createSimulateContract({
  abi: splitTokenAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"fund"`
 */
export const simulateSplitTokenFund = /*#__PURE__*/ createSimulateContract({
  abi: splitTokenAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateSplitTokenInitialize = /*#__PURE__*/ createSimulateContract({
  abi: splitTokenAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"register"`
 */
export const simulateSplitTokenRegister = /*#__PURE__*/ createSimulateContract({
  abi: splitTokenAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateSplitTokenRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: splitTokenAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"settle"`
 */
export const simulateSplitTokenSettle = /*#__PURE__*/ createSimulateContract({
  abi: splitTokenAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link splitTokenAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateSplitTokenTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: splitTokenAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link splitTokenAbi}__
 */
export const watchSplitTokenEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: splitTokenAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link splitTokenAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchSplitTokenOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: splitTokenAbi,
  eventName: 'OwnershipTransferred',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link tokenAbi}__
 */
export const readToken = /*#__PURE__*/ createReadContract({ abi: tokenAbi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"allowance"`
 */
export const readTokenAllowance = /*#__PURE__*/ createReadContract({
  abi: tokenAbi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readTokenBalanceOf = /*#__PURE__*/ createReadContract({
  abi: tokenAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"decimals"`
 */
export const readTokenDecimals = /*#__PURE__*/ createReadContract({
  abi: tokenAbi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"name"`
 */
export const readTokenName = /*#__PURE__*/ createReadContract({
  abi: tokenAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"owner"`
 */
export const readTokenOwner = /*#__PURE__*/ createReadContract({
  abi: tokenAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"symbol"`
 */
export const readTokenSymbol = /*#__PURE__*/ createReadContract({
  abi: tokenAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"totalSupply"`
 */
export const readTokenTotalSupply = /*#__PURE__*/ createReadContract({
  abi: tokenAbi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link tokenAbi}__
 */
export const writeToken = /*#__PURE__*/ createWriteContract({ abi: tokenAbi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"approve"`
 */
export const writeTokenApprove = /*#__PURE__*/ createWriteContract({
  abi: tokenAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"mint"`
 */
export const writeTokenMint = /*#__PURE__*/ createWriteContract({
  abi: tokenAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeTokenRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: tokenAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"transfer"`
 */
export const writeTokenTransfer = /*#__PURE__*/ createWriteContract({
  abi: tokenAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writeTokenTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: tokenAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeTokenTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: tokenAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link tokenAbi}__
 */
export const simulateToken = /*#__PURE__*/ createSimulateContract({
  abi: tokenAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"approve"`
 */
export const simulateTokenApprove = /*#__PURE__*/ createSimulateContract({
  abi: tokenAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"mint"`
 */
export const simulateTokenMint = /*#__PURE__*/ createSimulateContract({
  abi: tokenAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateTokenRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: tokenAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"transfer"`
 */
export const simulateTokenTransfer = /*#__PURE__*/ createSimulateContract({
  abi: tokenAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateTokenTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: tokenAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link tokenAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateTokenTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: tokenAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link tokenAbi}__
 */
export const watchTokenEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: tokenAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link tokenAbi}__ and `eventName` set to `"Approval"`
 */
export const watchTokenApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: tokenAbi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link tokenAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchTokenOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: tokenAbi,
  eventName: 'OwnershipTransferred',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link tokenAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchTokenTransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: tokenAbi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link trueMockAbi}__
 */
export const readTrueMock = /*#__PURE__*/ createReadContract({
  abi: trueMockAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link trueMockAbi}__ and `functionName` set to `"name"`
 */
export const readTrueMockName = /*#__PURE__*/ createReadContract({
  abi: trueMockAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link trueMockAbi}__ and `functionName` set to `"owner"`
 */
export const readTrueMockOwner = /*#__PURE__*/ createReadContract({
  abi: trueMockAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link trueMockAbi}__
 */
export const writeTrueMock = /*#__PURE__*/ createWriteContract({
  abi: trueMockAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link trueMockAbi}__ and `functionName` set to `"cancel"`
 */
export const writeTrueMockCancel = /*#__PURE__*/ createWriteContract({
  abi: trueMockAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link trueMockAbi}__ and `functionName` set to `"checkin"`
 */
export const writeTrueMockCheckin = /*#__PURE__*/ createWriteContract({
  abi: trueMockAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link trueMockAbi}__ and `functionName` set to `"fund"`
 */
export const writeTrueMockFund = /*#__PURE__*/ createWriteContract({
  abi: trueMockAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link trueMockAbi}__ and `functionName` set to `"initialize"`
 */
export const writeTrueMockInitialize = /*#__PURE__*/ createWriteContract({
  abi: trueMockAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link trueMockAbi}__ and `functionName` set to `"register"`
 */
export const writeTrueMockRegister = /*#__PURE__*/ createWriteContract({
  abi: trueMockAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link trueMockAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeTrueMockRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: trueMockAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link trueMockAbi}__ and `functionName` set to `"settle"`
 */
export const writeTrueMockSettle = /*#__PURE__*/ createWriteContract({
  abi: trueMockAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link trueMockAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeTrueMockTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: trueMockAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link trueMockAbi}__
 */
export const simulateTrueMock = /*#__PURE__*/ createSimulateContract({
  abi: trueMockAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link trueMockAbi}__ and `functionName` set to `"cancel"`
 */
export const simulateTrueMockCancel = /*#__PURE__*/ createSimulateContract({
  abi: trueMockAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link trueMockAbi}__ and `functionName` set to `"checkin"`
 */
export const simulateTrueMockCheckin = /*#__PURE__*/ createSimulateContract({
  abi: trueMockAbi,
  functionName: 'checkin',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link trueMockAbi}__ and `functionName` set to `"fund"`
 */
export const simulateTrueMockFund = /*#__PURE__*/ createSimulateContract({
  abi: trueMockAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link trueMockAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateTrueMockInitialize = /*#__PURE__*/ createSimulateContract({
  abi: trueMockAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link trueMockAbi}__ and `functionName` set to `"register"`
 */
export const simulateTrueMockRegister = /*#__PURE__*/ createSimulateContract({
  abi: trueMockAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link trueMockAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateTrueMockRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: trueMockAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link trueMockAbi}__ and `functionName` set to `"settle"`
 */
export const simulateTrueMockSettle = /*#__PURE__*/ createSimulateContract({
  abi: trueMockAbi,
  functionName: 'settle',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link trueMockAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateTrueMockTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: trueMockAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link trueMockAbi}__
 */
export const watchTrueMockEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: trueMockAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link trueMockAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchTrueMockOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: trueMockAbi,
  eventName: 'OwnershipTransferred',
})
