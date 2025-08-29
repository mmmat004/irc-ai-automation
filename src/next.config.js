/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    css: './styles/globals.css'
  },
  images: {
    domains: ['images.unsplash.com'],
  },
}

module.exports = nextConfig