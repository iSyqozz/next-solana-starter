import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

export async function getHeldProjectNfts(mintList: string[], owner: PublicKey, connection: Connection): Promise<PublicKey[]> {

    const mint_set = new Set(mintList);
  
    const valid: PublicKey[] = [];
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID });
  
    for (var cand in tokenAccounts.value) {
      try {
        const address = (tokenAccounts.value[cand].account.data.parsed['info'].mint)
        const amount = tokenAccounts.value[cand].account.data.parsed['info'].tokenAmount['amount']
        if (mint_set.has(address) && amount === '1') {
          valid.push(new PublicKey(address));
        }
      } catch (e) {
        continue
      }
    }
    return valid;
  }
  