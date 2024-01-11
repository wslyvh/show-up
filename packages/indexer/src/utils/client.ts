import { Chain, createPublicClient, http } from 'viem'
import { normalize } from 'viem/ens'
import { baseSepolia, sepolia, optimism, mainnet } from 'viem/chains'
import { TruncateMiddle } from './mapping'

const ADDRESS_SEPOLIA = '0xd599039AcD9bd440D175E089A05752ed21e1b65f'
const ADDRESS_BASE_SEPOLIA = '0x2015332B900685104889Ef6c0BE07146F342D888'
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
