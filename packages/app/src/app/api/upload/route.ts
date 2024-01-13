import { NextResponse, NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  console.log('IPFS Upload Request', file.name)

  const data = new FormData()
  data.append('file', file)
  data.append('pinataMetadata', JSON.stringify({ name: file.name }))
  console.log('POST files', file.name)

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
    },
    body: data,
  })

  const result = await res.json()
  return NextResponse.json(result, { status: 200 })
}
