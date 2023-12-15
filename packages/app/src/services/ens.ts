import { CONFIG } from '@/utils/config'
import { TruncateMiddle } from '@/utils/format'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'
import makeBlockie from 'ethereum-blockies-base64'

const transport = http(`https://eth-mainnet.g.alchemy.com/v2/${CONFIG.NEXT_PUBLIC_ALCHEMY_MAIN}`)
const publicClient = createPublicClient({
  chain: mainnet,
  batch: {
    multicall: true,
  },
  transport: transport,
})

export async function getEnsProfile(address: string) {
  console.log('getEnsProfile', address)
  return {
    address: address,
    name: TruncateMiddle(address),
    avatar: makeBlockie(address),
  }

  // const ensName = await publicClient.getEnsName({
  //   address: address,
  // })

  // const ensAvatar = !ensName
  //   ? makeBlockie(address)
  //   : await publicClient.getEnsAvatar({
  //       name: normalize(ensName),
  //     })

  // return {
  //   address: address,
  //   name: ensName ?? TruncateMiddle(address),
  //   avatar: ensAvatar ?? makeBlockie(address),
  // }
}
