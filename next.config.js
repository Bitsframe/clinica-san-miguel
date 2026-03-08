/** @type {import('next').NextConfig} */

const withNextIntl = require("next-intl/plugin")();
const { codeInspectorPlugin } = require('code-inspector-plugin');

const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    // Only enable in development mode
    if (dev) {
      config.plugins.push(
        codeInspectorPlugin({
          bundler: 'webpack',  // Next.js uses webpack
        })
      );
    }
    return config;
  },
  images: {
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "vsvueqtgulraaczqnnvh.supabase.co",
    //     port: "",
    //     pathname: "/storage/v1/object/public/**",
    //   },
    // ],
    domains: ["*"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);

