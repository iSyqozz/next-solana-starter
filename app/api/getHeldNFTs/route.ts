import { NextResponse } from "next/server";
import { NextURL } from "next/dist/server/web/next-url";
import { getHeldProjectNfts } from "@/utils/server";
import mints from "@/constants/mints.json"
import { Connection } from "@solana/web3.js";
import { PublicKey } from "@metaplex-foundation/js";
async function GET(req: Request) {
    try {
        const address = new NextURL(req.url).searchParams.get('address');
        if (!address) {
            return NextResponse.json([]);
        }
        const connection = new Connection(process.env.RPC_URL as string);
        const nfts = await getHeldProjectNfts(mints, new PublicKey(address), connection);
        return NextResponse.json(nfts.map((e)=>e.toBase58()))
    } catch (e) {
        console.log(e)
        return NextResponse.json([]);
    }
}
export {
    GET,
}

export const dynamic = 'force-dynamic'