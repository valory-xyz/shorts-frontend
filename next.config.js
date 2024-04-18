/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [{ hostname: 'gateway.autonolas.tech' }],
  },
  webpack: (config) => {
    // eslint-disable-next-line no-param-reassign
    config.snapshot = {
      ...(config.snapshot ?? {}),
      // Add all node_modules but @next module to managedPaths
      // Allows for hot refresh of changes to @next module
      managedPaths: [/^(.+?[\\/]node_modules[\\/])(?!@next)/], // josh: not sure why this stops infinite reload, but it works, will investigate later
    };
    return config;
  },
  redirects: async () => [
    {
      source: '/short/:id',
      destination: `/gnosis/short/:id`,
      permanent: false,
    },
    {
      source: '/requests/:id',
      destination: `/gnosis/requests/:id`,
      permanent: false,
    },
    {
      source: '/',
      destination: '/gnosis',
      permanent: true,
    },
  ],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none';",
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
        ],
      },
    ];
  },
};
