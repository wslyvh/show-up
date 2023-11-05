import { ActionDrawer } from '@/components/ActionDrawer'
import { ConditionModuleData, EventMetadata } from '@/utils/types'
import { useEventManagement } from '@/context/EventManagement'
import { ValidateConditions, ValidateMetadata } from '@/services/protocol'
import { LinkComponent } from '@/components/LinkComponent'
import { GetTokenDecimals, GetTokenSymbol } from '@/utils/network'
import { formatUnits } from 'viem/utils'
import dayjs from 'dayjs'
import { TruncateMiddle } from '@/utils/format'
import { useAccount } from 'wagmi'
import { CONFIG } from '@/utils/config'

interface Props {
  event: EventMetadata
  conditions: ConditionModuleData
  image?: File
}

export function Confirm(props: Props) {
  const { address } = useAccount()
  const eventManagement = useEventManagement()
  const isValid = ValidateMetadata(props.event) && ValidateConditions(props.conditions)
  const actionButton = (
    <button type='button' className='btn btn-accent btn-outline btn-sm w-full'>
      Create Event
    </button>
  )
  return (
    <ActionDrawer title='Confirm Event' actionComponent={actionButton}>
      <div className='flex flex-col justify-between h-full'>
        <div className='flex flex-col'>
          <p>
            Please check and confirm all details before creating your event. Once an event is created, it cannot be edited.
          </p>

          <div className='w-full divide-y divide-gray-800 text-sm gap-4 mt-4'>
            <div className='flex items-center justify-between py-2'>
              <span>Owner</span>
              <span>
                <LinkComponent className='underline' href={`${CONFIG.DEFAULT_CHAIN.blockExplorers?.default.url}/address/${address}`}>
                  {TruncateMiddle(address)}
                </LinkComponent>
              </span>

            </div>
            <div className='flex items-center justify-between py-2'>
              <span>End Date</span>
              <span>{dayjs(props.event.end).format('DD MMM, HH:mm')}</span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Max. Participants</span>
              <span>{props.conditions.maxParticipants === 0 ? 'No limit' : props.conditions.maxParticipants}</span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Deposit Fee</span>
              <span>{formatUnits(props.conditions.depositFee, GetTokenDecimals(props.conditions.tokenAddress))} {GetTokenSymbol(props.conditions.tokenAddress)}</span>
            </div>
          </div>
        </div>

        <div className='flex flex-col justify-end gap-4 mt-4'>
          <p className='text-sm'>
            * It can take up to 10 mins for your event to be visible due to decentralized indexing.
          </p>
          <p className='text-sm'>
            ** The protocol has been thoughtfully designed, built and reviewed by external developers. However, it has not been audited yet.
            Check our <LinkComponent className='underline' href='https://github.com/wslyvh/show-up'>Github</LinkComponent> for more details.
          </p>
          <button
            className='btn btn-accent btn-sm w-full'
            disabled={!isValid || eventManagement.loading}
            onClick={() => eventManagement.Create(props.event, props.conditions, props.image)}>
            {eventManagement.loading && (
              <>
                Loading
                <span className='loading loading-spinner h-4 w-4' />
              </>
            )}
            {!eventManagement.loading && <>Create Event</>}
          </button>
        </div>
      </div>
    </ActionDrawer >
  )
}
