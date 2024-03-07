/** @jsxImportSource frog/jsx */
import { showHubAbi, showHubAddress } from '@/abis'
import { Button, Frog, parseEther } from 'frog'
import { handle } from 'frog/next'

const app = new Frog({
  basePath: '/api',
  secret: process.env.FROG_SECRET,
  initialState: {
    user: null,
    txHash: null,
    indexed: false,
  },
})

app.transaction('/rsvp', async (context) => {
  const { previousState, frameData, buttonValue, status } = context

  return context.contract({
    abi: showHubAbi,
    chainId: 'eip155:10',
    functionName: 'register',
    to: showHubAddress[10],
    args: [BigInt(1), '0x63cab69189dBa2f1544a25c8C19b4309f415c8AA', '0x'],
    value: BigInt(0),
  })
})

app.frame('/', (context) => {
  return context.res({
    image: <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>Perform a transaction</div>,
    intents: [
      <Button.Transaction key='rsvp' target='/rsvp'>
        RSVP
      </Button.Transaction>,
      <Button.Link key='link' href='https://www.showup.events/'>
        Show Up
      </Button.Link>,
    ],
  })
})

export const GET = handle(app)
export const POST = handle(app)
