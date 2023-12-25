import { Chain, createPublicClient, http } from 'viem'
import { baseSepolia, sepolia, optimism } from 'viem/chains'

const ADDRESS_SEPOLIA = '0x6abEaB74bc741ce8daf2e4614DB7485C19c8acc4'
const ADDRESS_BASE_SEPOLIA = '0x70cD0FB06F21aA528b311189A998d03C47CbC056'
const ADDRESS_OPTIMISM = ''

export function GetChainId(source: string) {
    if (source == ADDRESS_BASE_SEPOLIA) return 84532
    if (source == ADDRESS_SEPOLIA) return 11155111
    if (source == ADDRESS_OPTIMISM) return 10

    return 10
}

export function GetClient(chainId: number) {
    let chain: Chain = optimism
    if (chainId == 84532) chain = baseSepolia
    if (chainId == 11155111) chain = sepolia

    return createPublicClient({
        chain: chain,
        transport: http(),
    })
}
