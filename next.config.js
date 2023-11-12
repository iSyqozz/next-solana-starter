/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    poweredByHeader: false,
    
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.com',
            },
            {
                protocol: 'https',
                hostname: '**.net',
            },
            {
                protocol: 'https',
                hostname: '**.org',
            },
            {
                protocol: 'https',
                hostname: '**.io',
            },
            {
                protocol: 'https',
                hostname: '**.link',
            },
            {
                protocol: 'https',
                hostname: 'nftstorage.link',
            }
        ],
    }
}

module.exports = nextConfig
