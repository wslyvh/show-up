import { CONFIG } from '@/utils/config'
import { AddressZero } from '@/utils/network'
import { erc20ABI, useContractRead } from 'wagmi'

export function useAllowance(owner: string, spender: string, tokenAddress: string = AddressZero) {
  const {
    data: allowance,
    refetch,
    isLoading,
    isError,
  } = useContractRead({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [owner, spender],
    watch: true,
    enabled: tokenAddress !== AddressZero,
  })

  return {
    allowance: allowance as bigint,
    refetch,
    isLoading,
    isError,
  }
}
