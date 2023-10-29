'use client'

import { ActionDrawer } from '@/components/ActionDrawer'
import { useEventManagement } from '@/context/EventManagement'
import { ConditionModuleType, Record } from '@/utils/types'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'

interface Props {
  event: Record
  buttonText: string
  disabled?: boolean
}

export function Register(props: Props) {
  const { address } = useAccount()
  const eventManagement = useEventManagement()

  return (
    <ActionDrawer title="Attend Event" buttonText={props.buttonText} disabled={props.disabled}>
      <div className='flex flex-col justify-between h-full'>
        <div className='flex flex-col'>
          <p>
            You're registering for <strong>{props.event.metadata?.title}</strong>.
          </p>

          {props.event.condition.type == ConditionModuleType.BasicToken && (
            <p>You need to approve the contract first to spend {formatUnits(props.event.condition.depositFee, props.event.condition.tokenDecimals ?? 18)} {props.event.condition.tokenSymbol}. You need to sign 2 transactions to complete registration.</p>
          )}
        </div>

        <div className='flex flex-col justify-end gap-4 mt-4'>

          <button
            type='button'
            disabled={eventManagement.loading}
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
        </div>
      </div>
    </ActionDrawer>
  )
}
