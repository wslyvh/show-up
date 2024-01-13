
export async function TryFetchIpfsFile(contentHash: string) {
    try {
        const response = await fetch(`https://cloudflare-ipfs.com/ipfs/${contentHash}`)
        if (response.ok) {
            return await response.json()
        }
    }
    catch (e) {
        console.error('Unable to fetch from Cloudflare')
    }

    try {
        const response = await fetch(`https://ipfs.io/ipfs/${contentHash}`)
        if (response.ok) {
            return await response.json()
        }
    }
    catch (e) {
        console.error('Unable to fetch from IPFS')
    }

    return null
}