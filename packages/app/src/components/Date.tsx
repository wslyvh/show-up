import dayjs from 'dayjs'

interface Props {
  date: string | number | Date
}

export function DateCard(props: Props) {
  const date = dayjs(props.date)

  return (
    <div className='flex flex-col w-20 text-center'>
      <div className='bg-primary rounded-t-lg p-1'>
        <span className='text-white'>{date.format('MMM')}</span>
      </div>
      <div className='flex flex-col bg-white rounded-b-lg p-1'>
        <span className='text-xl text-neutral font-bold'>{date.format('DD')}</span>
        <span className='text-xs'>{date.format('ddd')}</span>
      </div>
    </div>
  )
}
