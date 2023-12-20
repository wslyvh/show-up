import { BigNumber, ethers } from "ethers"
import dayjs from "dayjs"

export enum Status {
    Active = 0,
    Cancelled = 1,
    Settled = 2,
}

export const defaultContentUri = 'ipfs://bafkreifaa2qgrp2vbiyoz3uido6bgblw4risehacnoujqhpkodeawhfo4e'
export const defaultDepositFee = ethers.utils.parseUnits('0.02', 18) // 0.02 ether
export const defaultTokenDepositFee = ethers.utils.parseUnits('10', 18) // 10 tokens
export const defaultFundFee = ethers.utils.parseUnits('1', 18) // 1 ether
export const defaultTokenFee = BigNumber.from('2000000000000000000') // 2 ether
export const defaultTokenMint = BigNumber.from('100000000000000000000') // 100 ether

export const defaultMaxParticipants = 100

export const eventMetadata = {
    appId: "showup-test",
    title: "Test Event",
    description: "Lorem ipsum dolor sit amet..",
    start: dayjs().add(1, 'day').toISOString(),
    end: dayjs().add(5, 'day').toISOString(),
    timezone: "Europe/Amsterdam",
    location: "0xOnline",
    website: "https://www.showup.events/",
    imageUrl: "ipfs://bafkreif2a4fjasfh63j65g3u5ami4ras4ce2vxzs3zncdusy43it4qxgba",
    links: [],
    tags: []
}