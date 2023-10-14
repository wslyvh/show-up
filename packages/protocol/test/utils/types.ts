import { BigNumber, ethers } from "ethers"

export enum Status {
    Active = 0,
    Cancelled = 1,
    Settled = 2,
}

export const defaultContentUri = 'ipfs://0xCID...'
export const defaultDepositFee = ethers.utils.parseUnits('0.02', 18) // 0.02 ether
export const defaultTokenFee = BigNumber.from('2000000000000000000') // 2 ether
export const defaultTokenMint = BigNumber.from('100000000000000000000') // 100 ether

export const defaultMaxParticipants = 100