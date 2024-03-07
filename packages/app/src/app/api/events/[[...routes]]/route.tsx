/** @jsxImportSource frog/jsx */
import { showHubAbi, showHubAddress } from '@/abis'
import { GetEventBySlug } from '@/services/showhub'
import { SITE_EMOJI } from '@/utils/site'
import { Button, Frog } from 'frog'
import { handle } from 'frog/next'
import { type NeynarVariables, neynar } from 'frog/middlewares'
import { createPublicClient, http } from 'viem'
import { base, optimism } from 'viem/chains'
import dayjs from 'dayjs'

const app = new Frog<{
  Variables: NeynarVariables
}>({
  basePath: '/api/events',
  browserLocation: '/events/:id',
  secret: process.env.FROG_SECRET,
  initialState: {
    user: null,
    txHash: null,
    indexed: false,
  },
})

app.use(
  neynar({
    apiKey: 'NEYNAR_FROG_FM',
    features: ['interactor', 'cast'],
  })
)

app.transaction('/:id/rsvp', async (context) => {
  const { id } = context.req.param()
  const event = await GetEventBySlug(id)
  if (!event?.metadata) {
    console.error('EVENT NOT FOUND:', id)
  }

  const chainId = event?.chainId ?? 10
  const { custodyAddress, verifiedAddresses } = context.var.interactor || {}
  const address = verifiedAddresses?.ethAddresses[0] ?? custodyAddress
  if (!event || event.conditionModuleData.tokenAddress || !address) {
    console.error('Unable to RSVP for this event')
    //
  }

  const publicClient = createPublicClient({
    chain: chainId === 8543 ? base : optimism,
    transport: http(),
  })
  const isParticipant = await publicClient.readContract({
    abi: showHubAbi,
    functionName: 'isRegistered',
    address: showHubAddress[10],
    args: [event?.recordId, address],
  })

  if (isParticipant) {
    console.error('Already registered..')
    //
  }

  return context.contract({
    abi: showHubAbi,
    chainId: `eip155:${chainId}` as any,
    functionName: 'register',
    to: showHubAddress[10],
    args: [event?.recordId, address, '0x'],
    value: BigInt(0),
  })
})

app.frame('/:id', async (context) => {
  const { id } = context.req.param()
  const event = await GetEventBySlug(id)
  if (!event?.metadata) {
    return context.res({
      image: <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>Event not found</div>,
      intents: [
        <Button key='retry' value='find' action={`/${event?.slug}`}>
          Try again
        </Button>,
      ],
    })
  }

  const sameDay = dayjs(event?.metadata.start).isSame(event?.metadata.end, 'day')
  return context.res({
    image: (
      <div
        tw='flex flex-col w-full h-full p-8'
        style={{
          background: 'linear-gradient(to bottom, rgb(0, 0, 0), rgb(15, 23, 41), rgb(15, 23, 41))',
        }}>
        <div tw='text-4xl'>{SITE_EMOJI}</div>

        <div tw='flex flex-col grow h-auto items-center justify-center'>
          <h1 tw='text-6xl text-white'>{event?.metadata.title}</h1>
          <div tw='flex flex-row items-center justify-center gap-12'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke-width='1.5'
              stroke='white'
              style={{ height: '32px', width: '32px', marginRight: '24px' }}>
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z'
              />
            </svg>
            <p tw='text-white' style={{ fontSize: 32 }}>
              {dayjs(event?.metadata.start).format('ddd MMM DD · HH:mm')}
              {' → '}
              {dayjs(event?.metadata.end).format(sameDay ? 'HH:mm' : 'ddd MMM DD · HH:mm')}
            </p>
          </div>
          <div tw='flex flex-row items-center justify-center'>
            <p tw='text-white text-2xl'>{event?.chainId === 8543 ? 'Base' : 'Optimism'}</p>
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button.Transaction key='rsvp' target={`/${event?.slug}/rsvp`}>
        RSVP (
        {event?.conditionModuleData.depositFee == BigInt(0)
          ? 'free'
          : `${event?.conditionModuleData.depositFee.toString()} ETH`}
        )
      </Button.Transaction>,
      <Button.Link key='link' href={`https://www.showup.events/events/${event?.slug}`}>
        Event Details
      </Button.Link>,
    ],
  })
})

export const GET = handle(app)
export const POST = handle(app)
