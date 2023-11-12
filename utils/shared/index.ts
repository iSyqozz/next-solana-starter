import { ComputeBudgetProgram, Connection, PublicKey, Transaction, sendAndConfirmRawTransaction, sendAndConfirmTransaction } from "@solana/web3.js";
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

export async function hydrateMultipleTransactions(Txs: Transaction[], connection: Connection, feePayer: PublicKey) {
  const hashAndCtx = await connection.getLatestBlockhashAndContext()
  const recentBlockhash = hashAndCtx.value.blockhash;
  const lastValidBlockHeight = hashAndCtx.value.lastValidBlockHeight;
  for (let tx of Txs) {
    tx.recentBlockhash = recentBlockhash;
    tx.lastValidBlockHeight = lastValidBlockHeight;
    tx.feePayer = new PublicKey(feePayer);
  }
}

export function increaseTransactionBudget(tx:Transaction, newBudget:number):Transaction{
  const newTx = new Transaction();
  newTx.add(
      ComputeBudgetProgram.setComputeUnitLimit({units:newBudget})
  )
  newTx.add(
      ...tx.instructions
  )
  return newTx
} 

export async function send_transactions(
  Transactions: Transaction[],
  connection:Connection
) {
  var staggeredTransactions: Promise<string>[] = []
  var i = 1
  Transactions.forEach((tx) => {
      const prms = new Promise<string>((resolve) => {
          setTimeout(() => {
              sendAndConfirmRawTransaction(connection, tx.serialize(), { skipPreflight: true, commitment: 'confirmed', maxRetries: 2 })
                  .then(async (sig) => {
                      resolve(sig)
                  })
                  .catch(error => {
                      console.log(error)
                      resolve('failed');
                  })
          }, 100 * i)
      })
      staggeredTransactions.push(prms);
      i += 1
  })
  const result = await Promise.allSettled(staggeredTransactions)
  const values = []
  for (var entry of result) {
      //@ts-ignore      
      values.push(entry.value)
  }
  return values
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

// Function to calculate the current progress based on startTime and current time
function getElapsedTime(startTime: number): number {
  const currentTime = new Date().getTime();
  const elapsedTimeMilliseconds = currentTime - startTime;
  return elapsedTimeMilliseconds;
}


//export function getProgramInstance(programId:PublicKey,idl:any, connection:Connection):Program{
//  const program = new Program(
//    idl,
//    programId,
//    new AnchorProvider(
//      connection,
//      new Wallet(Keypair.generate()),
//      {
//        skipPreflight: true,
//        commitment: 'confirmed'
//      }
//    ) as Provider
//  )
//  return program;
//}


