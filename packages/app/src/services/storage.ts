import { CONFIG } from '@/utils/config'
import PinataClient from '@pinata/sdk'

export async function Store(name: string, data: any) {
  console.log('Store Data file to IPFS', name)
  const pinata = PinataClient(CONFIG.NEXT_PUBLIC_PINATA_API_KEY, CONFIG.NEXT_PUBLIC_PINATA_API_SECRET)
  const res = await pinata.pinJSONToIPFS(data, {
    pinataMetadata: {
      name: name,
    },
    pinataOptions: {
      cidVersion: 0,
    },
  })

  return res.IpfsHash
}

export async function Upload(file: File) {
  console.log('Upload file over API', file.name)
  const formData = new FormData()
  formData.append('file', file, file.name)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()
  return data.IpfsHash
}
