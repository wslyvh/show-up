'use client'

import { ActionDrawer } from '@/components/ActionDrawer'
import { LinkComponent } from '@/components/LinkComponent'
import { useEventData } from '@/context/EventData'
import { useNotifications } from '@/context/Notification'
import { useAllowance } from '@/hooks/useAllowance'
import { TruncateMiddle } from '@/utils/format'
import { useQueryClient } from '@tanstack/react-query'
import { LoadingStateData } from '@/utils/types'
import { encodeAbiParameters, formatUnits } from 'viem/utils'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { showHubAddress, simulateShowHub, writeShowHub } from '@/abis'
import { revalidateAll } from '@/app/actions/cache'
import { simulateContract, writeContract } from '@wagmi/core'
import { Alert } from '@/components/Alert'
import { WAGMI_CONFIG } from '@/utils/network'
import { erc20Abi } from 'viem'
import { switchChain, waitForTransactionReceipt } from 'wagmi/actions'

export function Fund() {
  const { address, chainId } = useAccount()
  const eventData = useEventData()
  const queryClient = useQueryClient()
  const notifications = useNotifications()
  const [fundingAmount, setFundingAmount] = useState(eventData.record.conditionModuleData.tokenAddress ? 10 : 0.01)
  const [state, setState] = useState<LoadingStateData>({
    isLoading: false,
    type: '',
    message: '',
    data: false,
  })
  const { allowance, refetch } = useAllowance(
    address,
    eventData.record.conditionModuleId.replace(`${chainId}-`, ''),
    eventData.record.conditionModuleData.tokenAddress
  )

  async function Approve() {
    if (!address) {
      setState({ ...state, isLoading: false, type: 'error', message: 'Not connected' })
      return
    }

    setState({ ...state, isLoading: true, type: 'info', message: `Approving token. Sign transaction` })

    if (chainId !== eventData.chain.id) {
      try {
        console.log(`Switching chains ${chainId} -> ${eventData.chain.id}`)
        await switchChain(WAGMI_CONFIG, { chainId: eventData.chain.id })
      } catch (e) {
        console.log('Unable to switch chains', e)
      }
    }

    const approveConfig = await simulateContract(WAGMI_CONFIG, {
      chainId: eventData.record.conditionModule.chainId,
      address: eventData.record.conditionModuleData.tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [
        eventData.record.conditionModuleId.replace(`${chainId}-`, ''),
        BigInt(fundingAmount * 10 ** (eventData.record.conditionModuleData.tokenDecimals ?? 18)),
      ],
    })

    const hash = await writeContract(WAGMI_CONFIG, approveConfig.request)
    setState({ ...state, isLoading: true, type: 'info', message: 'Transaction sent. Awaiting confirmation' })

    await waitForTransactionReceipt(WAGMI_CONFIG, { hash: hash })

    await notifications.Add({
      created: Date.now(),
      type: 'info',
      message: `Token Approved`,
      from: address,
      cta: {
        label: 'View transaction',
        href: `${eventData.chain.blockExplorers?.default.url}/tx/${hash}`,
      },
      data: { hash },
    })

    await refetch()
    setState({ ...state, isLoading: false, type: 'info', message: '', data: true })
  }

  async function Fund() {
    if (!address) {
      setState({ ...state, isLoading: false, type: 'error', message: 'Not connected' })
      return
    }

    setState({ ...state, isLoading: true, type: 'info', message: `Funding event. Sign transaction` })

    try {
      const amount = BigInt(fundingAmount * 10 ** (eventData.record.conditionModuleData.tokenDecimals ?? 18))
      const params = eventData.record.conditionModuleData.tokenAddress
        ? encodeAbiParameters([{ type: 'uint256' }], [amount])
        : '0x'

      if (chainId !== eventData.chain.id) {
        try {
          console.log(`Switching chains ${chainId} -> ${eventData.chain.id}`)
          await switchChain(WAGMI_CONFIG, { chainId: eventData.chain.id })
        } catch (e) {
          console.log('Unable to switch chains', e)
        }
      }

      // make sure token is approved before registration first
      const txConfig = await simulateShowHub(WAGMI_CONFIG, {
        chainId: eventData.record.conditionModule.chainId,
        address: showHubAddress,
        functionName: 'fund',
        args: [eventData.record.recordId, params],
        value: eventData.record.conditionModuleData.tokenAddress ? BigInt(0) : amount,
      })

      const hash = await writeShowHub(WAGMI_CONFIG, txConfig.request)

      setState({ ...state, isLoading: true, type: 'info', message: 'Transaction sent. Awaiting confirmation' })
      const data = await waitForTransactionReceipt(WAGMI_CONFIG, { hash: hash })

      if (data.status == 'success') {
        setState({ ...state, isLoading: false, type: 'success', message: 'Successfully funded' })

        await notifications.Add({
          created: Date.now(),
          type: 'info',
          message: `Successfully funded event`,
          from: address,
          cta: {
            label: 'View transaction',
            href: `${eventData.chain.blockExplorers?.default.url}/tx/${hash}`,
          },
          data: { hash },
        })

        await revalidateAll()
        queryClient.invalidateQueries({ queryKey: ['events'] })
        eventData.refetch()

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
        <button type='button' className='btn btn-accent btn-outline btn-sm w-full' disabled={!eventData.isActive}>
          Fund
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
              <span>{eventData.chain.name}</span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Organizer</span>
              <span>
                <LinkComponent
                  className='underline'
                  href={`${eventData.chain.blockExplorers?.default.url}/address/${eventData.record.createdBy}`}>
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

          {allowance < BigInt(fundingAmount * 10 ** (eventData.record.conditionModuleData.tokenDecimals ?? 18)) &&
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

          {(allowance >= BigInt(fundingAmount * 10 ** (eventData.record.conditionModuleData.tokenDecimals ?? 18)) ||
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
