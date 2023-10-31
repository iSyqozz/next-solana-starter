import { Connection, PublicKey, Transaction, sendAndConfirmRawTransaction } from "@solana/web3.js";
import bs58 from "bs58";
import nacl from "tweetnacl";
import { getAssociatedTokenAccountPda } from "./pdas";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
type SignMessage = {
  domain: string;
  publicKey: string;
  nonce: string;
  statement: string;
};

export class SigninMessage {
  domain: any;
  publicKey: any;
  nonce: any;
  statement: any;

  constructor({ domain, publicKey, nonce, statement }: SignMessage) {
    this.domain = domain;
    this.publicKey = publicKey;
    this.nonce = nonce;
    this.statement = statement;
  }

  prepare() {
    return `${this.statement}\n\n${this.nonce}`;
  }

  async validate(signature: string) {
    const msg = this.prepare();
    const signatureUint8 = bs58.decode(signature);
    const msgUint8 = new TextEncoder().encode(msg);
    const pubKeyUint8 = bs58.decode(this.publicKey);

    return nacl.sign.detached.verify(msgUint8, signatureUint8, pubKeyUint8);
  }
}

export async function hydrateTransaction(tx: Transaction, connection: Connection, feePayer: PublicKey) {
  const hash = await connection.getLatestBlockhashAndContext()
  const recentBlockhash = hash.value.blockhash;
  const lastValidBlockHeight = hash.value.lastValidBlockHeight;

  tx.recentBlockhash = recentBlockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;
  tx.feePayer = new PublicKey(feePayer);
}


export async function getTokenSupply(mint: PublicKey, connection: Connection) {
  try {
    const supply = await connection.getTokenSupply(mint);
    return supply.value.uiAmount;
  } catch (e) {
    return 0;
  }
}


export async function getUserTokenSupply(mint: PublicKey, user: PublicKey, connection: Connection): Promise<number> {
  try {
    const ata = getAssociatedTokenAccountPda(mint, user);
    const accountData = await connection.getParsedAccountInfo(ata);
    //@ts-ignore
    return accountData.value!.data.parsed.info.tokenAmount.uiAmount as number;
  } catch (e) {
    return 0
  }
}

export async function getTokenHoldersCount(mint: PublicKey, connection: Connection): Promise<number> {
  try {
    const programAccounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
      filters: [
        {
          "dataSize": 165
        },
        {
          "memcmp": {
            offset: 0,
            bytes: mint.toBase58(),
          }
        }
      ]
    });
    let res = 0;
    for (let entry of programAccounts) {
      try {
        //@ts-ignore
        const amount = (entry.account.data.parsed.info.tokenAmount.uiAmount);
        res += amount > 0 ? 1 : 0;
      } catch (e) {
        continue
      }
    }
    return res;
  } catch (e) {
    return 0
  }
}


export async function getLargestHolders(mint: PublicKey, connection: Connection): Promise<PublicKey[] | null> {
  try {
    const accounts = await connection.getTokenLargestAccounts(mint);
    const res: PublicKey[] = [];

    for (let entry of accounts.value) {
      const accountData = await connection.getParsedAccountInfo(entry.address);
      //@ts-ignore
      const owner = accountData.value?.data.parsed.info.owner
      res.push(new PublicKey(owner));
    }
    return res
  } catch (e) {
    console.log(e)
    return null
  }
}



