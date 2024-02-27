import { AddressZero } from '@/utils/network'
import { useEffect } from 'react'
import { erc20Abi } from 'viem'
import { useBlockNumber, useReadContract } from 'wagmi'

export function useAllowance(owner: string, spender: string, tokenAddress: string = AddressZero) {
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const {
    data: allowance,
    refetch,
    isLoading,
    isError,
  } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [owner, spender],
    query: {
      enabled: tokenAddress !== AddressZero,
    },
  })

  useEffect(() => {
    refetch()
  }, [blockNumber])

  return {
    allowance: BigInt((allowance as string) ?? 0),
    refetch,
    isLoading,
    isError,
  }
}
