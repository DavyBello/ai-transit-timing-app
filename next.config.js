/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-d3-speedometer'],
  images: {
    domains: ['maps.googleapis.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig