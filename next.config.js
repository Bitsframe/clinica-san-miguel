/** @type {import('next').NextConfig} */

const withNextIntl = require("next-intl/plugin")("./i18n/request.ts");

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
];

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vsvueqtgulraaczqnnvh.supabase.co",
        pathname: "/storage/v1/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    const isStaging = process.env.RAILWAY_ENVIRONMENT_NAME && process.env.RAILWAY_ENVIRONMENT_NAME !== "production" 
      || process.env.NEXT_PUBLIC_SITE_URL?.includes("railway.app") 
      || process.env.VERCEL_ENV === "preview";

    const dynamicHeaders = [...securityHeaders];
    if (isStaging) {
      dynamicHeaders.push({
        key: "X-Robots-Tag",
        value: "noindex, nofollow",
      });
    }

    return [
      {
        source: "/(.*)",
        headers: dynamicHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/favicon.ico", destination: "/favicon.png" },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:locale(en|es)/specials",
        destination: "/:locale/special",
        permanent: true,
      },
      {
        source: "/specials",
        destination: "/special",
        permanent: true,
      },
      // T-1 & T-5b: Map hard 404s and pass the slug path
      {
        source: "/:locale(en|es)/location/:path*",
        destination: "/:locale/contact/:path*",
        permanent: true,
      },
      {
        source: "/location/:path*",
        destination: "/contact/:path*",
        permanent: true,
      },
      // /contents/* family redirect to /contact
      {
        source: "/contents/:path*",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/:locale(en|es)/contents/:path*",
        destination: "/:locale/contact",
        permanent: true,
      },
      // Updated slugs
      { source: "/:locale(en|es)/contact/houston-tx-office", destination: "/:locale/contact/spring", permanent: true },
      { source: "/contact/houston-tx-office", destination: "/contact/spring", permanent: true },
      { source: "/:locale(en|es)/contact/garland", destination: "/:locale/contact/dallas-east", permanent: true },
      { source: "/contact/garland", destination: "/contact/dallas-east", permanent: true },

      // T-5b: Map legacy numeric IDs to new slugs
      { source: "/:locale(en|es)/contact/9", destination: "/:locale/contact/fort-worth-tx-office", permanent: true },
      { source: "/contact/9", destination: "/contact/fort-worth-tx-office", permanent: true },
      { source: "/:locale(en|es)/contact/7", destination: "/:locale/contact/farmers-branch", permanent: true },
      { source: "/contact/7", destination: "/contact/farmers-branch", permanent: true },
      { source: "/:locale(en|es)/contact/15", destination: "/:locale/contact/fondren", permanent: true },
      { source: "/contact/15", destination: "/contact/fondren", permanent: true },
      { source: "/:locale(en|es)/contact/12", destination: "/:locale/contact/channelview", permanent: true },
      { source: "/contact/12", destination: "/contact/channelview", permanent: true },
      { source: "/:locale(en|es)/contact/3", destination: "/:locale/contact/dallas-nw", permanent: true },
      { source: "/contact/3", destination: "/contact/dallas-nw", permanent: true },
      { source: "/:locale(en|es)/contact/2", destination: "/:locale/contact/fort-worth", permanent: true },
      { source: "/contact/2", destination: "/contact/fort-worth", permanent: true },
      { source: "/:locale(en|es)/contact/26", destination: "/:locale/contact/blanco", permanent: true },
      { source: "/contact/26", destination: "/contact/blanco", permanent: true },
      { source: "/:locale(en|es)/contact/18", destination: "/:locale/contact/sw-military", permanent: true },
      { source: "/contact/18", destination: "/contact/sw-military", permanent: true },
      { source: "/:locale(en|es)/contact/19", destination: "/:locale/contact/nacogdoches", permanent: true },
      { source: "/contact/19", destination: "/contact/nacogdoches", permanent: true },
      { source: "/:locale(en|es)/contact/5", destination: "/:locale/contact/arlington", permanent: true },
      { source: "/contact/5", destination: "/contact/arlington", permanent: true },
      { source: "/:locale(en|es)/contact/27", destination: "/:locale/contact/jefferson", permanent: true },
      { source: "/contact/27", destination: "/contact/jefferson", permanent: true },
      { source: "/:locale(en|es)/contact/11", destination: "/:locale/contact/veterans-memorial", permanent: true },
      { source: "/contact/11", destination: "/contact/veterans-memorial", permanent: true },
      { source: "/:locale(en|es)/contact/17", destination: "/:locale/contact/pasadena", permanent: true },
      { source: "/contact/17", destination: "/contact/pasadena", permanent: true },
      { source: "/:locale(en|es)/contact/13", destination: "/:locale/contact/spring", permanent: true },
      { source: "/contact/13", destination: "/contact/spring", permanent: true },
      { source: "/:locale(en|es)/contact/14", destination: "/:locale/contact/hwy-6", permanent: true },
      { source: "/contact/14", destination: "/contact/hwy-6", permanent: true },
      { source: "/:locale(en|es)/contact/8", destination: "/:locale/contact/river-oak", permanent: true },
      { source: "/contact/8", destination: "/contact/river-oak", permanent: true },
      { source: "/:locale(en|es)/contact/6", destination: "/:locale/contact/dallas-east", permanent: true },
      { source: "/contact/6", destination: "/contact/dallas-east", permanent: true },
      { source: "/:locale(en|es)/contact/16", destination: "/:locale/contact/fresno-tx", permanent: true },
      { source: "/contact/16", destination: "/contact/fresno-tx", permanent: true },
      // T-2: Legacy /services/* soft 404s -> exact service pages
      { source: "/:locale(en|es)/services/dot-test", destination: "/:locale/services/7", permanent: true },
      { source: "/services/dot-test", destination: "/services/7", permanent: true },
      { source: "/:locale(en|es)/services/dot-physical", destination: "/:locale/services/7", permanent: true },
      { source: "/services/dot-physical", destination: "/services/7", permanent: true },
      { source: "/:locale(en|es)/services/wart-removal", destination: "/:locale/services/2", permanent: true },
      { source: "/services/wart-removal", destination: "/services/2", permanent: true },
      { source: "/:locale(en|es)/services/blood-tests", destination: "/:locale/services/3", permanent: true },
      { source: "/services/blood-tests", destination: "/services/3", permanent: true },
      { source: "/:locale(en|es)/services/seniors", destination: "/:locale/services/4", permanent: true },
      { source: "/services/seniors", destination: "/services/4", permanent: true },
      { source: "/:locale(en|es)/services/ear-cleaning", destination: "/:locale/services/6", permanent: true },
      { source: "/services/ear-cleaning", destination: "/services/6", permanent: true },
      { source: "/:locale(en|es)/services/diabetes", destination: "/:locale/services/20", permanent: true },
      { source: "/services/diabetes", destination: "/services/20", permanent: true },
      { source: "/:locale(en|es)/services/ekg", destination: "/:locale/services/15", permanent: true },
      { source: "/services/ekg", destination: "/services/15", permanent: true },
      { source: "/:locale(en|es)/services/dentist", destination: "/:locale/services/24", permanent: true },
      { source: "/services/dentist", destination: "/services/24", permanent: true },
      { source: "/:locale(en|es)/services/primary-care", destination: "/:locale/services/23", permanent: true },
      { source: "/services/primary-care", destination: "/services/23", permanent: true },
      { source: "/:locale(en|es)/services/ultrasound", destination: "/:locale/services/16", permanent: true },
      { source: "/services/ultrasound", destination: "/services/16", permanent: true },
      { source: "/:locale(en|es)/services/thyroid-care", destination: "/:locale/services/8", permanent: true },
      { source: "/services/thyroid-care", destination: "/services/8", permanent: true },
      { source: "/:locale(en|es)/services/school-physical", destination: "/:locale/services/14", permanent: true },
      { source: "/services/school-physical", destination: "/services/14", permanent: true },
      { source: "/:locale(en|es)/services/pregnancy-services", destination: "/:locale/services/10", permanent: true },
      { source: "/services/pregnancy-services", destination: "/services/10", permanent: true },
      { source: "/:locale(en|es)/services/psa-test", destination: "/:locale/services/11", permanent: true },
      { source: "/services/psa-test", destination: "/services/11", permanent: true },
      { source: "/:locale(en|es)/services/ingrown-toenail-removal", destination: "/:locale/services/12", permanent: true },
      { source: "/services/ingrown-toenail-removal", destination: "/services/12", permanent: true },
      { source: "/:locale(en|es)/services/womens-preventive-screening", destination: "/:locale/services/17", permanent: true },
      { source: "/services/womens-preventive-screening", destination: "/services/17", permanent: true },
      { source: "/:locale(en|es)/services/vitamin-b-12", destination: "/:locale/services/19", permanent: true },
      { source: "/services/vitamin-b-12", destination: "/services/19", permanent: true },
      { source: "/:locale(en|es)/services/high-cholesterol", destination: "/:locale/services/9", permanent: true },
      { source: "/services/high-cholesterol", destination: "/services/9", permanent: true },
      { source: "/:locale(en|es)/services/high-cholesterol-and-triglycerides", destination: "/:locale/services/9", permanent: true },
      { source: "/services/high-cholesterol-and-triglycerides", destination: "/services/9", permanent: true },
      { source: "/:locale(en|es)/services/children-healthcare", destination: "/:locale/services/5", permanent: true },
      { source: "/services/children-healthcare", destination: "/services/5", permanent: true },
      { source: "/:locale(en|es)/services/pediatrics", destination: "/:locale/services/5", permanent: true },
      { source: "/services/pediatrics", destination: "/services/5", permanent: true },
      { source: "/:locale(en|es)/services/hypertension", destination: "/:locale/services/22", permanent: true },
      { source: "/services/hypertension", destination: "/services/22", permanent: true },
      { source: "/:locale(en|es)/services/walk-in-procedure-care", destination: "/:locale/services/21", permanent: true },
      { source: "/services/walk-in-procedure-care", destination: "/services/21", permanent: true },
      { source: "/:locale(en|es)/services/sexual-health-checkups", destination: "/:locale/services/18", permanent: true },
      { source: "/services/sexual-health-checkups", destination: "/services/18", permanent: true },

    ];
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));

