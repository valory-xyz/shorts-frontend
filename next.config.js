// eslint-disable-next-line import/no-extraneous-dependencies
const withBundleAnalyzer = require('@next/bundle-analyzer');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  pages: {
    '*': {
      maxChunkSize: 30000,
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://verify.walletconnect.com https://verify.walletconnect.org;",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://verify.walletconnect.com',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://verify.walletconnect.org',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With,content-type',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'false',
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
}, nextConfig);
