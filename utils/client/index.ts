
export async function fetchHeldNFTs(owner: string) {
    const fetchRes = await fetch(`/api/getHeldNFTs?address=${owner}`, {
        method: 'GET',
        cache: 'no-store',
    })
    const res = await fetchRes.json();
    return res;
}