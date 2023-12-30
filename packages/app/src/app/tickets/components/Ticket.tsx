import { Record, Status } from '@/utils/types'
import { QRCodeSVG } from 'qrcode.react'
import { useAccount } from 'wagmi'
import { formatEther, formatUnits } from 'viem/utils'
import dayjs from 'dayjs'

interface Props {
  record: Record
}

interface StatusProps {
  status: Status
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

export function TicketBadge(props: StatusProps) {
  let className = 'badge badge-outline self-start mt-2 ml-2 shrink-0'
  if (props.status == Status.Active) className += ' badge-info'
  if (props.status == Status.Cancelled) className += ' badge-error'
  if (props.status == Status.Settled) className += ' badge-success'
  if (props.size) className += ` badge-${props.size}`
  if (props.className) className += ` ${props.className}`

  return <span className={className}>{props.status}</span>
}

export function Ticket(props: Props) {
  const { address } = useAccount()
  const ticket = props.record.registrations.find((p) => p.id.toLowerCase() == address.toLowerCase())

  if (!ticket) return null

  return (
    <article className='flex w-full flex-col md:flex-row'>
      <div className='flex rounded-xl bg-white items-center justify-center p-4 md:p-12'>
        <QRCodeSVG value={ticket.transactionHash} level='Q' />
      </div>

      <div className='flex items-center px-2 md:px-0 md:py-2'>
        <div className='border border-1 border-dashed bg-white border-base-100 w-full md:w-0 md:h-full'></div>
      </div>

      <div className='flex flex-col flex-grow rounded-xl bg-white p-8'>
        <div className='flex items-center gap-2'>
          <span className='flex-grow text-4xl font-bold text-blue-900'>{props.record.metadata?.title}</span>
          <TicketBadge status={props.record.status} />
        </div>
        <span className='text-neutral-800 text-sm mt-2'>{props.record.metadata?.location}</span>

        <div className='flex flex-col mt-8'>
          <span className='text-xs text-neutral-600'>Date</span>
          <span className='font-mono'>{dayjs(props.record.metadata?.start).format('DD/MMM/YYYY')}</span>
        </div>

        <div className='flex flex-row justify-between mt-4'>
          <div className='flex flex-col flex-auto min-w-0 mr-4'>
            <span className='text-xs text-neutral-600'>Address</span>
            <span className='font-mono truncate'>{address}</span>
          </div>
          <div className='flex flex-col shrink-0 w-24'>
            <span className='text-xs text-neutral-600'>Deposit</span>
            <span className='font-mono'>
              {!props.record.conditionModuleData.tokenAddress && (
                <>{formatEther(BigInt(props.record.conditionModuleData.depositFee))} ETH</>
              )}
              {props.record.conditionModuleData.tokenAddress && (
                <>
                  {formatUnits(
                    BigInt(props.record.conditionModuleData.depositFee),
                    props.record.conditionModuleData.tokenDecimals ?? 18
                  )}{' '}
                  {props.record.conditionModuleData.tokenSymbol}
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
