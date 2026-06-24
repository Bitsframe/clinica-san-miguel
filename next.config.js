/** @type {import('next').NextConfig} */

const withNextIntl = require("next-intl/plugin")();

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      { source: "/favicon.ico", destination: "/favicon.png" },
    ];
  },
};

module.exports = withNextIntl(nextConfig);

