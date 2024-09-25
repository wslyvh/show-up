export async function TryFetchIpfsFile(contentHash: string) {
  try {
    const response = await fetch(`https://ipfs.io/ipfs/${contentHash}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.error("Unable to fetch from IPFS");
  }
  try {
    const response = await fetch(`https://dweb.link/ipfs/${contentHash}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.error("Unable to fetch from DWeb");
  }

  return null;
}
