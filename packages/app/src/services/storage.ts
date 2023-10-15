import { Web3Storage } from 'web3.storage'

if (!process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY) {
    console.error('NEXT_PUBLIC_WEB3_STORAGE_API_KEY is not defined')
}

const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY ?? '' })

export async function Store(name: string, serialized: string, verify: boolean = true) {
    return Upload(new File([Buffer.from(serialized)], name), verify)
}

export async function Upload(file: File, verify: boolean = true) {
    console.log('Upload to web3.storage', file.name)

    const cid = await client.put([file], {
        wrapWithDirectory: false,
    })

    if (verify) await Verify(cid)

    return cid
}

export async function List() {
    for await (const item of client.list({ maxResults: 10 })) {
        console.log(item.cid, item.name, item.created)
    }
}

export async function GetFile(cid: string) {
    const res = await client.get(cid)
    if (res) {
        const files = await res.files()
        if (files && files.length > 0) {
            const file = files[0]
            const content = await file.text()

            return content
        }
    }
}

export async function Verify(cid: string, includeGateways: boolean = false) {
    const post = await GetFile(cid)
    if (!post) console.error('Unable to fetch from Web3Storage SDK')

    if (includeGateways) {
        try {
            const ipfs = await fetch(`https://ipfs.io/ipfs/${cid}`)
            if (ipfs.status !== 200) console.error('Unable to fetch from IPFS Gateway')
        } catch (e) {
            console.error('Unable to fetch from IPFS Gateway')
        }
        try {
            const cloudflare = await fetch(`https://cloudflare-ipfs.com/ipfs/${cid}`)
            if (cloudflare.status !== 200) console.error('Unable to fetch from Cloudflare')
        } catch (e) {
            console.error('Unable to fetch from Cloudflare')
        }
    }

    return true
}
