'use client'

import { ActionDrawer } from '@/components/ActionDrawer'
import { LinkComponent } from '@/components/LinkComponent'
import { useEventData } from '@/context/EventData'
import { useNotifications } from '@/context/Notification'
import { useAllowance } from '@/hooks/useAllowance'
import { CONFIG } from '@/utils/config'
import { TruncateMiddle } from '@/utils/format'
import { useQueryClient } from '@tanstack/react-query'
import { LoadingStateData } from '@/utils/types'
import { encodeAbiParameters, formatUnits } from 'viem/utils'
import { useAccount, useNetwork } from 'wagmi'
import { useState } from 'react'
import { erc20ABI, prepareWriteShowHub, writeShowHub } from '@/abis'
import { revalidateAll } from '@/app/actions/cache'
import { waitForTransaction, switchNetwork, prepareWriteContract, writeContract } from '@wagmi/core'
import { Alert } from '@/components/Alert'
import NP from 'number-precision'

export function Fund() {
  const { chain: currentChain } = useNetwork()
  const { address } = useAccount()
  const eventData = useEventData()
  const queryClient = useQueryClient()
  const notifications = useNotifications()
  const chain = CONFIG.DEFAULT_CHAINS.find((i) => i.id === eventData.record.conditionModule.chainId)
  const [fundingAmount, setFundingAmount] = useState(eventData.record.conditionModuleData.tokenAddress ? 10 : 0.1)
  const [state, setState] = useState<LoadingStateData>({
    isLoading: false,
    type: '',
    message: '',
    data: false,
  })
  const { allowance, refetch } = useAllowance(
    address,
    eventData.record.conditionModuleId,
    eventData.record.conditionModuleData.tokenAddress
  )

  async function Approve() {
    if (!address || !chain) {
      setState({ ...state, isLoading: false, type: 'error', message: 'Not connected' })
      return
    }

    setState({ ...state, isLoading: true, type: 'info', message: `Approving token. Sign transaction` })
    const approveConfig = await prepareWriteContract({
      chainId: eventData.record.conditionModule.chainId as any,
      address: eventData.record.conditionModuleData.tokenAddress,
      abi: erc20ABI,
      functionName: 'approve',
      args: [
        eventData.record.conditionModuleId,
        BigInt(NP.times(fundingAmount, 10 ** (eventData.record.conditionModuleData.tokenDecimals ?? 18))),
      ],
    })

    const { hash } = await writeContract(approveConfig)
    setState({ ...state, isLoading: true, type: 'info', message: 'Transaction sent. Awaiting confirmation' })

    await waitForTransaction({
      chainId: chain.id,
      hash: hash,
    })

    await notifications.Add({
      created: Date.now(),
      type: 'info',
      message: `Token Approved`,
      from: address,
      cta: {
        label: 'View transaction',
        href: `${chain?.blockExplorers?.default.url}/tx/${hash}`,
      },
      data: { hash },
    })

    await refetch()
    setState({ ...state, isLoading: false, type: 'info', message: '', data: true })
  }

  async function Fund() {
    if (!address || !chain) {
      setState({ ...state, isLoading: false, type: 'error', message: 'Not connected' })
      return
    }

    setState({ ...state, isLoading: true, type: 'info', message: `Funding event. Sign transaction` })

    try {
      const amount = BigInt(NP.times(fundingAmount, 10 ** (eventData.record.conditionModuleData.tokenDecimals ?? 18)))
      const params = eventData.record.conditionModuleData.tokenAddress
        ? encodeAbiParameters([{ type: 'uint256' }], [amount])
        : '0x'

      // make sure token is approved before registration first

      const txConfig = await prepareWriteShowHub({
        chainId: chain.id as any,
        functionName: 'fund',
        args: [eventData.record.recordId, params],
        value: eventData.record.conditionModuleData.tokenAddress ? BigInt(0) : amount,
      })

      const { hash } = await writeShowHub(txConfig)

      setState({ ...state, isLoading: true, type: 'info', message: 'Transaction sent. Awaiting confirmation' })

      const data = await waitForTransaction({
        chainId: chain.id,
        hash: hash,
      })

      if (data.status == 'success') {
        setState({ ...state, isLoading: false, type: 'success', message: 'Successfully funded' })

        await notifications.Add({
          created: Date.now(),
          type: 'info',
          message: `Successfully funded event`,
          from: address,
          cta: {
            label: 'View transaction',
            href: `${chain?.blockExplorers?.default.url}/tx/${hash}`,
          },
          data: { hash },
        })

        await revalidateAll()
        queryClient.invalidateQueries({ queryKey: ['events'] })

        return
      }

      setState({ ...state, isLoading: false, type: 'error', message: 'Unable to fund event' })
    } catch (e) {
      console.error(e)
      setState({ ...state, isLoading: false, type: 'error', message: 'Unable to fund event' })
    }
  }

  return (
    <ActionDrawer
      title='Fund Event'
      actionComponent={
        <button type='button' className='btn btn-accent btn-outline btn-sm w-full'>
          Fund Event
        </button>
      }>
      <div className='flex flex-col justify-between h-full'>
        <div className='flex flex-col'>
          <p>
            Funding an event can give an extra incentive for people to show up. Funding an event is permissionless.
            Anyone can fund it. The funds are only distributed over checked in attendees and are added on top of any
            other deposit fees. Funds must be in the same currency/token as the deposit fee.
          </p>

          <div className='w-full divide-y divide-gray-800 text-sm gap-4 mt-4'>
            <div className='flex items-center justify-between py-2'>
              <span>Network</span>
              <span>{CONFIG.DEFAULT_CHAINS.find((i) => i.id === chain?.id)?.name}</span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Organizer</span>
              <span>
                <LinkComponent
                  className='underline'
                  href={`${chain?.blockExplorers?.default.url}/address/${eventData.record.createdBy}`}>
                  {TruncateMiddle(eventData.record.createdBy)}
                </LinkComponent>
              </span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Total funded</span>
              <span>
                {formatUnits(
                  BigInt(eventData.record.totalFunded),
                  eventData.record.conditionModuleData.tokenDecimals ?? 18
                )}
              </span>
            </div>
            <div className='form-control w-full'>
              <div className='mt-4'>
                <label className='label' htmlFor='fundingAmount'>
                  <span className='label-text'>
                    {eventData.record.conditionModuleData.tokenSymbol ?? 'ETH'} <span className='text-accent'>*</span>
                  </span>
                </label>
                <input
                  id='fundingAmount'
                  type='number'
                  step={eventData.record.conditionModuleData.tokenAddress ? '1' : '0.01'}
                  max='1000.00'
                  required
                  className='input input-sm input-bordered w-full'
                  value={fundingAmount}
                  onChange={(e) => setFundingAmount(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col justify-end gap-4 mt-4'>
          {state.message && <Alert type={state.type as any} message={state.message} />}

          {currentChain && currentChain?.id !== chain?.id && (
            <button
              className='btn btn-accent btn-sm w-full'
              disabled={state.isLoading || state.type == 'success'}
              onClick={() => switchNetwork({ chainId: eventData.record.conditionModule.chainId as any })}>
              Switch Network
            </button>
          )}

          {currentChain &&
            currentChain?.id == chain?.id &&
            allowance <
              BigInt(NP.times(fundingAmount, 10 ** (eventData.record.conditionModuleData.tokenDecimals ?? 18))) &&
            (eventData.record.conditionModule.name == 'RecipientToken' ||
              eventData.record.conditionModule.name == 'SplitToken') && (
              <>
                <button
                  type='button'
                  disabled={state.isLoading}
                  onClick={Approve}
                  className='btn btn-accent btn-sm w-full'>
                  {state.isLoading && (
                    <>
                      Loading
                      <span className='loading loading-spinner h-4 w-4' />
                    </>
                  )}
                  {!state.isLoading && <>Approve</>}
                </button>
              </>
            )}

          {currentChain &&
            currentChain?.id == chain?.id &&
            (allowance >=
              BigInt(NP.times(fundingAmount, 10 ** (eventData.record.conditionModuleData.tokenDecimals ?? 18))) ||
              eventData.record.conditionModule.name == 'RecipientEther' ||
              eventData.record.conditionModule.name == 'SplitEther') && (
              <button type='button' disabled={state.isLoading} onClick={Fund} className='btn btn-accent btn-sm w-full'>
                <>Fund</>
              </button>
            )}
        </div>
      </div>
    </ActionDrawer>
  )
}
