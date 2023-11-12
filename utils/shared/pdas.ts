import { PublicKey } from "@solana/web3.js";
import {getAssociatedTokenAddressSync} from "@solana/spl-token"

//metadata pda
export function getMetadataPda(mint: PublicKey) {
    const [metadataPda, _] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s').toBuffer(),
            mint.toBuffer(),
        ],
        new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
    )
    return metadataPda
}


//master edition pda 
export function getMasterEditionPda(mint: PublicKey) {
    const [masterEditionPda, _] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s').toBuffer(),
            mint.toBuffer(),
            Buffer.from("edition"),
        ],
        new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
    )
    return masterEditionPda
}

//token record pda 
export function getTokenRecord(mint: PublicKey, ata: PublicKey) {
    const [TokenRecord, _] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s').toBuffer(),
            mint.toBuffer(),
            Buffer.from("token_record"),
            ata.toBuffer(),
        ],
        new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
    )
    return TokenRecord
}


export function getAssociatedTokenAccountPda(mint:PublicKey, owner:PublicKey):PublicKey{
    const ata = getAssociatedTokenAddressSync(
        mint,
        owner,
        true,
    )
    return ata
}

export function getGlobalStatePda(StakingProgram: PublicKey) {
    const [pda, _] = PublicKey.findProgramAddressSync(
        [
            Buffer.from('global_state')
        ],
        new PublicKey(StakingProgram)
    )
    return pda
}