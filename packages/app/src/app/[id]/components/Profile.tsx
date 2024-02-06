'use client'

import { useMyEvents } from '@/hooks/useEvents'
import { Card } from '../../components/Card'
import { Empty } from '@/components/Empty'
import { FaDiscord, FaEthereum, FaGithub, FaTelegram, FaTwitter } from 'react-icons/fa6'
import makeBlockie from 'ethereum-blockies-base64'
import { LinkComponent } from '@/components/LinkComponent'
import { useProfile } from '@/hooks/useProfile'

interface Props {
  id: string
}

export function Profile(props: Props) {
  const { data: owner, isError: isOwnerError } = useProfile(props.id)
  const { data: events, isError: isEventsError } = useMyEvents(props.id)
  if (!owner) return null // loading
  if (isOwnerError || isEventsError) return <Empty text={`Unable to fetch profile`} />

  const onSelect = (option: string) => {
    // filter
  }

  return (
    <>
      <div className='flex flex-col bg-neutral rounded-lg mt-8'>
        <div className='relative'>
          <div className='absolute right-12 -top-12'>
            <div className='avatar border border-4 border-white rounded-lg'>
              <div className='w-24 rounded-lg'>
                <img src={owner.avatar ?? makeBlockie(owner.id)} alt={owner.name} />
              </div>
            </div>
          </div>
        </div>

        <div className='px-4 pb-8'>
          <h1 className='text-xl text-white font-bold mt-4'>{owner.name}</h1>
          <div className='flex flex-row text-primary mt-4 gap-4'>
            {owner.twitter && (
              <LinkComponent href={`https://twitter.com/${owner.twitter}`}>
                <FaTwitter />
              </LinkComponent>
            )}

            {owner.telegram && (
              <LinkComponent href={`https://t.me/${owner.telegram}`}>
                <FaTelegram />
              </LinkComponent>
            )}

            {owner.discord && (
              <LinkComponent href={`https://discordapp.com/users/${owner.discord}`}>
                <FaDiscord />
              </LinkComponent>
            )}

            {owner.github && (
              <LinkComponent href={`https://github.com/${owner.github}`}>
                <FaGithub />
              </LinkComponent>
            )}

            {owner.id && (
              <LinkComponent href={`https://etherscan.io/address/${owner.id}`}>
                <FaEthereum />
              </LinkComponent>
            )}
          </div>

          {owner.website && (
            <div className='mt-8'>
              <LinkComponent href={owner.website}>
                <button type='button' className='btn btn-accent btn-sm w-full'>
                  Website
                </button>
              </LinkComponent>
            </div>
          )}

          <div className='prose max-w-none mt-8'>{owner.description}</div>
        </div>
      </div>

      {/* <div className='flex justify-end my-4'>
        <Tabs options={['Upcoming', 'Past']} onSelect={onSelect} />
      </div> */}

      <div className='flex flex-col my-4 gap-2'>
        {events && events.length > 0 && events.map((event) => <Card key={event.id} event={event} />)}
      </div>

      {events && events.length === 0 && <Empty text={`No events found`} />}
    </>
  )
}
