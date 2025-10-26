//@ts-check

const { withNx } = require('@nx/next/plugins/with-nx');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
   nx: {},
   reactStrictMode: false,
   images: {
      domains: ['cdn.discordapp.com'],
   },
};

module.exports = withNx(nextConfig);
