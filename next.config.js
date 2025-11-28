/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  distDir: 'dist',
  assetPrefix: '',
  env: {
    NEXT_PUBLIC_API_URL: 'https://mohamedalamin.wuaze.com/api',
  }
}

module.exports = nextConfig
