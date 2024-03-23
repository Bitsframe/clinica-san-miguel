/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;
