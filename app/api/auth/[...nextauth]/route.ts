import { NextAuthOptions } from 'next-auth';
import NextAuth from "next-auth";
import { getCsrfToken } from "next-auth/react";
import { SigninMessage } from "@/utils/shared";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "next-auth";
import { PublicKey, Transaction } from '@solana/web3.js';
import { MEMO_PROGRAM_ID } from '@/constants';

const providers = [
    CredentialsProvider({
        name: "Solana",
        credentials: {
            message: {
                label: "Message",
                type: "text",
            },
            signature: {
                label: "Signature",
                type: "text",
            },
            tx: {
                label: "Tx",
                type: 'text'
            }
        },

        async authorize(credentials, req): Promise<User | null> {
            try {
                const csrfToken = await getCsrfToken({ req: { ...req, body: null } });

                if (credentials?.tx) {
                    const tx = Transaction.from(Buffer.from(credentials.tx, 'base64'))

                    for (let inx of tx.instructions) {
                        if (inx.programId.equals(new PublicKey(MEMO_PROGRAM_ID))) {
                            if (inx.data.toString() != csrfToken) return null
                            if (!tx.verifySignatures()) return null

                            return {
                                id: tx.feePayer!.toBase58()
                            }
                        }

                    }
                    return null
                } else {

                    const signinMessage = new SigninMessage(
                        JSON.parse(credentials?.message || "{}")
                    );


                    if (signinMessage.nonce !== csrfToken) {
                        return null;
                    }

                    const validationResult = await signinMessage.validate(
                        credentials?.signature || ""
                    );

                    if (!validationResult) {
                        throw new Error("Could not validate the signed message");
                    }

                    return {
                        id: signinMessage.publicKey,
                    }
                }
            } catch (e) {
                return null
            }
        }
    })
];

const handler = NextAuth({
    providers,
    session: {
        strategy: "jwt",
        maxAge: 86400,
    },
    secret: process.env.NEXTAUTH_SECRET as string,
    callbacks: {
        async session({ session, token }) {
            // @ts-ignore
            session.publickey = token.sub
            if (session.user) {
                session.user.name = token.sub
            }
            return session;
        },
    },
} as NextAuthOptions);

export { handler as GET, handler as POST }
