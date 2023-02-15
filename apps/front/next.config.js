//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require('@nrwl/next/plugins/with-nx');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
   nx: {
      // Set this to true if you would like to to use SVGR
      // See: https://github.com/gregberge/svgr
      svgr: false,
   },
   reactStrictMode: false,
   images: {
      domains: ['cdn.discordapp.com'],
   },
   experimental: {
      appDir: true,
   },
   webpack(config, { nextRuntime }) {
      if (nextRuntime === 'nodejs') {
         config.externals = [
            ...config.externals,
            'erlpack',
            'zlib-sync',
            'bufferutil',
            'utf-8-validate',
         ];
      }

      return config;
   },
};

module.exports = withNx(nextConfig);
