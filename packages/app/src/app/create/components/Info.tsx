import { ActionDrawer } from '@/components/ActionDrawer'
import { LinkComponent } from '@/components/LinkComponent'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

export function InfoDrawer() {
  return (
    <ActionDrawer title='Show Up Protocol' actionComponent={<QuestionMarkCircleIcon className='h-6 w-6 cursor-pointer' />}>
      <div className='flex flex-col'>
        <p>
          Show Up aligns the incentives between event organizers and attendees
        </p>

        <ul className='list-inside list-disc text-sm mt-4'>
          <li>Event organizers request a deposit fee to register</li>
          <li>Attendees get rewarded by showing up</li>
        </ul>

        <p className='mt-4'>win/win for everyone 🤝</p>

        <ul className='list-inside list-disc text-sm mt-4'>
          <li>Show Up is a decentralized App and has no control of your event(s)</li>
          <li>Metadata is stored on IPFS. The conditions and payments are managed onchain via smart contracts</li>
          <li>Once an event is created, it cannot be edited. You can cancel an event at any time</li>
          <li>Anyone can register for your event by paying the deposit fee</li>
          <li>The event host is required to keep track and manage check ins</li>
          <li>The event host needs to settle the event after its end date to distribute the funds</li>
        </ul>

        <p className='mt-4'>
          Check <LinkComponent className='underline' href='https://github.com/wslyvh/show-up'>Github</LinkComponent> for more details.
        </p>
      </div>
    </ActionDrawer >
  )
}
