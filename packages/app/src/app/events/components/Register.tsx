'use client'

import { ActionDrawer } from '@/components/ActionDrawer'
import { LinkComponent } from '@/components/LinkComponent'
import { useEventData } from '@/context/EventData'
import { useAllowance } from '@/hooks/useAllowance'
import { CONFIG } from '@/utils/config'
import { TruncateMiddle } from '@/utils/format'
import { Record } from '@/utils/types'
import { formatUnits } from 'viem/utils'
import { useAccount } from 'wagmi'

interface Props {
  event: Record
  buttonText: string
  disabled?: boolean
}

export function Register(props: Props) {
  const eventData = useEventData()
  const { address } = useAccount()
  const { allowance, refetch } = useAllowance(
    address,
    props.event.conditionModuleId,
    props.event.conditionModuleData.tokenAddress
  )
  const chain = CONFIG.DEFAULT_CHAINS.find((i) => i.id === props.event.chainId)
  const actionButton = (
    <button type='button' disabled={props.disabled} className='btn btn-accent btn-outline btn-sm w-full'>
      {props.buttonText}
    </button>
  )

  async function approve() {
    // eventManagement.ApproveToken(
    //   props.event.conditionModuleId,
    //   props.event.conditionModuleData.tokenAddress!,
    //   BigInt(props.event.conditionModuleData.depositFee)
    // )
    // await refetch()
  }

  return (
    <ActionDrawer title='Register' actionComponent={actionButton}>
      <div className='flex flex-col justify-between h-full'>
        <div className='flex flex-col'>
          <p>
            You&apos;re registering for <strong>{props.event.metadata?.title}</strong>.
          </p>

          <div className='w-full divide-y divide-gray-800 text-sm gap-4 mt-4'>
            <div className='flex items-center justify-between py-2'>
              <span>Organizer</span>
              <span>
                <LinkComponent
                  className='underline'
                  href={`${chain?.blockExplorers?.default.url}/address/${props.event.createdBy}`}>
                  {TruncateMiddle(props.event.createdBy)}
                </LinkComponent>
              </span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Available Spots</span>
              <span>
                {props.event.registrations.length}
                {' / '}
                {props.event.limit > 0 ? props.event.limit : 'unlimited'}
              </span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Deposit Fee</span>
              <span>
                {formatUnits(
                  BigInt(props.event.conditionModuleData.depositFee),
                  props.event.conditionModuleData.tokenDecimals ?? 18
                )}{' '}
                {props.event.conditionModuleData.tokenSymbol}
              </span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Current Allowance</span>
              <span>{formatUnits(allowance ?? 0, props.event.conditionModuleData.tokenDecimals ?? 18)}</span>
            </div>
            <p className='pt-4'>* Your deposit will be returned if you check in or if the event is cancelled.</p>
          </div>
        </div>

        <div className='flex flex-col justify-end gap-4 mt-4'>
          {eventData.isParticipant && (
            <button type='button' className='btn btn-accent btn-sm w-full' disabled>
              Already registered
            </button>
          )}

          {allowance < BigInt(props.event.conditionModuleData.depositFee) &&
            (props.event.conditionModule.name == 'RecipientToken' ||
              props.event.conditionModule.name == 'SplitToken') &&
            !eventData.isParticipant && (
              <>
                <p>
                  You need to approve the contract first to spend{' '}
                  {formatUnits(
                    BigInt(props.event.conditionModuleData.depositFee),
                    props.event.conditionModuleData.tokenDecimals ?? 18
                  )}{' '}
                  {props.event.conditionModuleData.tokenSymbol}. You can register for the event after.
                </p>

                {/* <button
                  type='button'
                  disabled={eventManagement.loading}
                  onClick={approve}
                  className='btn btn-accent btn-sm w-full'>
                  {eventManagement.loading && (
                    <>
                      Loading
                      <span className='loading loading-spinner h-4 w-4' />
                    </>
                  )}
                  {!eventManagement.loading && <>Approve</>}
                </button> */}
              </>
            )}

          {allowance >= BigInt(props.event.conditionModuleData.depositFee) &&
            (props.event.conditionModule.name == 'RecipientEther' ||
              props.event.conditionModule.name == 'SplitEther') &&
            !eventData.isParticipant && (
              <>Register</>
              // <button
              //   type='button'
              //   disabled={eventManagement.loading || eventData.isParticipant}
              //   // onClick={() => eventManagement.Register(props.event.id, props.event.condition, address)}
              //   onClick={() => console.log('Register for event')}
              //   className='btn btn-accent btn-sm w-full'>
              //   {eventManagement.loading && (
              //     <>
              //       Loading
              //       <span className='loading loading-spinner h-4 w-4' />
              //     </>
              //   )}
              //   {!eventManagement.loading && <>Register</>}
              // </button>
            )}
        </div>
      </div>
    </ActionDrawer>
  )
}
