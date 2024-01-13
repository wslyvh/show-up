import { Chain, createPublicClient, http } from 'viem'
import { normalize } from 'viem/ens'
import { baseSepolia, sepolia, optimism, mainnet, base } from 'viem/chains'
import { TruncateMiddle } from './mapping'

export function GetClient(chainId: number) {
    let chain: Chain = optimism
    if (chainId == 10) chain = optimism
    if (chainId == 8453) chain = base
    if (chainId == 11155111) chain = sepolia
    if (chainId == 84532) chain = baseSepolia

    return createPublicClient({
        chain: chain,
        transport: http(),
    })
}

export async function GetEnsProfile(address: string) {
    const client = createPublicClient({
        chain: mainnet,
        batch: {
            multicall: true,
        },
        transport: http(),
    })

    let name = TruncateMiddle(address)
    let avatar = null
    try {
        const ensName = await client.getEnsName({
            address: address as any,
        })
        if (ensName) {
            name = ensName
            const ensAvatar = await client.getEnsAvatar({
                name: normalize(ensName),
            })

            if (ensAvatar) {
                avatar = ensAvatar
            }
        }

    }
    catch (e) {
        // ignore
    }

    return {
        id: address,
        name: name,
        avatar: avatar,
    }
}
