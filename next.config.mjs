/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'cbu01.alicdn.com',
      'img.alicdn.com',
      'gw.alicdn.com'
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.alicdn.com' },
      { protocol: 'https', hostname: '**.alicdn.com' },
      { protocol: 'https', hostname: '*.1688.com' },
      { protocol: 'https', hostname: '**.1688.com' }
    ]
  }
};

export default nextConfig;
