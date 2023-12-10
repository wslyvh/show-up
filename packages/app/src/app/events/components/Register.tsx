'use client'

import { ActionDrawer } from '@/components/ActionDrawer'
import { LinkComponent } from '@/components/LinkComponent'
import { useEventData } from '@/context/EventData'
import { useEventManagement } from '@/context/EventManagement'
import { useAllowance } from '@/hooks/useAllowance'
import { CONFIG } from '@/utils/config'
import { TruncateMiddle } from '@/utils/format'
import { GetTokenDecimals, GetTokenSymbol } from '@/utils/network'
import { ConditionModuleType, Record } from '@/utils/types'
import { formatUnits } from 'viem/utils'
import { useAccount } from 'wagmi'

interface Props {
  event: Record
  buttonText: string
  disabled?: boolean
}

export function Register(props: Props) {
  const eventManagement = useEventManagement()
  const eventData = useEventData()
  const { address } = useAccount()
  const { allowance, refetch } = useAllowance(address, props.event.conditionModule, props.event.condition.tokenAddress)
  const actionButton = (
    <button type='button' disabled={props.disabled} className='btn btn-accent btn-outline btn-sm w-full'>
      {props.buttonText}
    </button>
  )

  async function approve() {
    eventManagement.ApproveToken(
      props.event.conditionModule,
      props.event.condition.tokenAddress!,
      props.event.condition.depositFee
    )
    await refetch()
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
                  href={`${CONFIG.DEFAULT_CHAIN.blockExplorers?.default.url}/address/${props.event.createdBy}`}>
                  {TruncateMiddle(props.event.createdBy)}
                </LinkComponent>
              </span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Available Spots</span>
              <span>
                {props.event.participants.length}
                {' / '}
                {props.event.condition.maxParticipants > 0 ? props.event.condition.maxParticipants : 'unlimited'}
              </span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Deposit Fee</span>
              <span>
                {formatUnits(props.event.condition.depositFee, GetTokenDecimals(props.event.condition.tokenAddress))}{' '}
                {GetTokenSymbol(props.event.condition.tokenAddress)}
              </span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Current Allowance</span>
              <span>{formatUnits(allowance ?? 0, GetTokenDecimals(props.event.condition.tokenAddress))}</span>
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

          {allowance < props.event.condition.depositFee &&
            props.event.condition.type == ConditionModuleType.BasicToken &&
            !eventData.isParticipant && (
              <>
                <p>
                  You need to approve the contract first to spend{' '}
                  {formatUnits(props.event.condition.depositFee, props.event.condition.tokenDecimals ?? 18)}{' '}
                  {GetTokenSymbol(props.event.condition.tokenAddress)}. You can register for the event after.
                </p>

                <button
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
                </button>
              </>
            )}

          {(allowance >= props.event.condition.depositFee ||
            props.event.condition.type == ConditionModuleType.BasicEther) &&
            !eventData.isParticipant && (
              <button
                type='button'
                disabled={eventManagement.loading || eventData.isParticipant}
                onClick={() => eventManagement.Register(props.event.id, props.event.condition, address)}
                className='btn btn-accent btn-sm w-full'>
                {eventManagement.loading && (
                  <>
                    Loading
                    <span className='loading loading-spinner h-4 w-4' />
                  </>
                )}
                {!eventManagement.loading && <>Register</>}
              </button>
            )}
        </div>
      </div>
    </ActionDrawer>
  )
}
