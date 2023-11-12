import type { Metadata, ResolvingMetadata, ResolvedMetadata } from 'next'
import { Ubuntu } from 'next/font/google'
import '@/styles/globals.css'
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import SolanaProvider from '@/providers/SolanaProvider';
import NextAuthProvider from '@/providers/NextAuthProvider';
import ScrollProg from '@/components/shared/ScrollProg';
import Favicon from '@/components/shared/Favicon';
import CookieConsentBanner from '@/components/shared/CookieConsent';
import {
  PROJECT_BASE_TITLE,
  PROJECT_DESCRIPTION,
  PROJECT_NAME,
  CREATOR_NAME,
  CREATOR_TWITTER_LINK,
  CREATOR_TWITTER_HANDLE,
  PROJECT_EMAIL_ADDRESS,
  PROJECT_TWITTER_HANDLE,
} from '@/constants'
import { Viewport } from 'next'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//for vercel deployments
const baseUrl = process.env.NODE_ENV === 'development'
  ? `http://localhost:${process.env.PORT || 3000}` :
  'https://' + process.env.VERCEL_URL as string;

type generateMetadatProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export function generateMetadata(
  { params, searchParams }: generateMetadatProps,
  parent: ResolvedMetadata,
): Metadata {

  const metadata: Metadata = {
    title: {
      default: PROJECT_BASE_TITLE,
      template: `${PROJECT_BASE_TITLE} | %s`,
      absolute: `${PROJECT_BASE_TITLE} | Home`
    },
    description: PROJECT_DESCRIPTION,
    abstract: PROJECT_DESCRIPTION,
    icons: {
      icon: '/meta/favicon.ico',
      apple: '/meta/favicon.ico',
    },
    classification: 'Solana Dapp',
    metadataBase: new URL(baseUrl),
    robots: { index: true, follow: true },
    bookmarks: baseUrl,
    keywords: [
      'Solana Dapp',
      'Web3 Application',
      'Cryptocurrency',
      'Solana Blockchain',
      'NFT',
      'Smart Contracts',
      'Decentralized',
      'Crypto',
      'DeFi',
      'Tokenomics',
      'Web3 Integration',
      'Solana Ecosystem',
      'Solana Wallet',
      'Solana RPC',
    ],
    creator: CREATOR_NAME,
    publisher: CREATOR_NAME,
    generator: 'next-solana-starter by @iSyqozz512',
    applicationName: PROJECT_NAME,
    authors: [
      {
        name: CREATOR_NAME,
        url: CREATOR_TWITTER_LINK,
      },
    ],
    openGraph: {
      images: '/meta/opengraph-image.png',
      type: 'website',
      title: PROJECT_BASE_TITLE,
      description: PROJECT_DESCRIPTION,
      siteName: PROJECT_NAME,
      determiner: 'auto',
      emails: PROJECT_EMAIL_ADDRESS,
      locale: 'en_US',
    },
    twitter: {
      images: '/meta/twitter-image.png',
      title: PROJECT_BASE_TITLE,
      description: PROJECT_DESCRIPTION,
      card: 'summary_large_image',
      creator: CREATOR_TWITTER_HANDLE,
      site: PROJECT_TWITTER_HANDLE,
    },
    referrer: 'origin-when-cross-origin',
    verification: {
      me: CREATOR_TWITTER_LINK
    },
    appleWebApp: {
      statusBarStyle: 'black-translucent',
      title: PROJECT_BASE_TITLE,
      capable: true,
    },
    appLinks: {
      web: {
        url: baseUrl,
        should_fallback: true,
      }
    }
  }

  return metadata
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "white" },
  ],
  colorScheme: 'dark',
}

const ubuntu = Ubuntu({ subsets: ['latin'], weight: ['300', '400', '500', '700'] })
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className='dark' lang="en">
      <head>
        <meta name="HandheldFriendly" content="True" />
        <meta name="format-detection" content="telephone=yes, date=yes, address=yes, email=yes, url=yes" />
        <link rel="shortlink" href={baseUrl} />
      </head>
      <body className={ubuntu.className}>
        <SolanaProvider>
          <NextAuthProvider>
            <ScrollProg></ScrollProg>
            <Favicon></Favicon>
            <Navbar></Navbar>
            {children}
            <Footer></Footer>
            <CookieConsentBanner/>
          </NextAuthProvider>
        </SolanaProvider>
      </body>
    </html>
  )
}
