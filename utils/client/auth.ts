import { getCsrfToken, signIn, } from "next-auth/react";
import { PublicKey, Transaction, Connection, SystemProgram, VersionedTransaction, TransactionInstruction } from "@solana/web3.js";
import { SigninMessage } from "../shared";
import bs58 from "bs58";
import { WalletModalContextState } from "@solana/wallet-adapter-react-ui";
import { MEMO_PROGRAM_ID, SIGN_IN_MESSAGE } from '@/constants'


export const handleSignIn = async (
    connected: boolean,
    publicKey: PublicKey,
    signMessage: ((message: Uint8Array) => Promise<Uint8Array>),
    signTransaction: (<T extends Transaction | VersionedTransaction>(transaction: T) => Promise<T>),
    owner: string,
    walletModal: WalletModalContextState,
    usingLedger: boolean,
    setDim:(e:boolean) => void
) => {
    try {
        setDim(true);
        let authPayload: string;

        if (!connected) {
            walletModal.setVisible(true);
        }

        const csrf = await getCsrfToken();
        if (!publicKey || !csrf || !signMessage || !signTransaction) return;

        const message = new SigninMessage({
            domain: window.location.host,
            publicKey: owner,
            statement: SIGN_IN_MESSAGE,
            nonce: csrf,
        });
        if (!usingLedger) {
            const data = new TextEncoder().encode(message.prepare());
            const signature = await signMessage(data);
            authPayload = bs58.encode(signature);
        } else {
            const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL as string);

            const tx = new Transaction().add(new TransactionInstruction({
                programId: new PublicKey(MEMO_PROGRAM_ID),
                keys: [],
                data: Buffer.from(csrf, "utf8")
            }))

            const hash = await connection.getLatestBlockhashAndContext()
            const recentBlockhash = hash.value.blockhash;
            const lastValidBlockHeight = hash.value.lastValidBlockHeight;

            tx.recentBlockhash = recentBlockhash;
            tx.lastValidBlockHeight = lastValidBlockHeight;
            tx.feePayer = new PublicKey(owner);

            const signedTx = await signTransaction(tx);

            const serializedTx = signedTx.serialize({ requireAllSignatures: true }).toString('base64')
            authPayload = serializedTx
        }



        signIn("credentials", {
            message: usingLedger ? '' : JSON.stringify(message),
            redirect: false,
            signature: usingLedger ? '' : authPayload,
            tx: usingLedger ? authPayload : '',
        }).then(()=>{setDim(false)});
    } catch (e) {
        setDim(false)
        console.log(e);
    }
}