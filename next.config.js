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
      // Legacy /location/tx/{city}/{zip} URLs (recovered from Wayback Machine, May 2022 crawl).
      // Exact 1:1 mappings to current /contact/{slug} pages, matched by city + zip against
      // the Locations table — placed before the blanket wildcard below so they take precedence.
      { source: "/:locale(en|es)/location/tx/arlington/76010", destination: "/:locale/contact/arlington", permanent: true },
      { source: "/location/tx/arlington/76010", destination: "/contact/arlington", permanent: true },
      { source: "/:locale(en|es)/location/tx/dallas/75203", destination: "/:locale/contact/jefferson", permanent: true },
      { source: "/location/tx/dallas/75203", destination: "/contact/jefferson", permanent: true },
      { source: "/:locale(en|es)/location/tx/dallas/75218", destination: "/:locale/contact/dallas-east", permanent: true },
      { source: "/location/tx/dallas/75218", destination: "/contact/dallas-east", permanent: true },
      { source: "/:locale(en|es)/location/tx/dallas/75220", destination: "/:locale/contact/dallas-nw", permanent: true },
      { source: "/location/tx/dallas/75220", destination: "/contact/dallas-nw", permanent: true },
      { source: "/:locale(en|es)/location/tx/farmers-branch", destination: "/:locale/contact/farmers-branch", permanent: true },
      { source: "/location/tx/farmers-branch", destination: "/contact/farmers-branch", permanent: true },
      { source: "/:locale(en|es)/location/tx/fort-worth", destination: "/:locale/contact/fort-worth", permanent: true },
      { source: "/location/tx/fort-worth", destination: "/contact/fort-worth", permanent: true },
      { source: "/:locale(en|es)/location/tx/fresno/77545", destination: "/:locale/contact/fresno-tx", permanent: true },
      { source: "/location/tx/fresno/77545", destination: "/contact/fresno-tx", permanent: true },
      { source: "/:locale(en|es)/location/tx/houston/77015", destination: "/:locale/contact/channelview", permanent: true },
      { source: "/location/tx/houston/77015", destination: "/contact/channelview", permanent: true },
      { source: "/:locale(en|es)/location/tx/houston/77036", destination: "/:locale/contact/fondren", permanent: true },
      { source: "/location/tx/houston/77036", destination: "/contact/fondren", permanent: true },
      { source: "/:locale(en|es)/location/tx/houston/77067", destination: "/:locale/contact/veterans-memorial", permanent: true },
      { source: "/location/tx/houston/77067", destination: "/contact/veterans-memorial", permanent: true },
      // 77076 (Little York) has no current equivalent location — sent to the Houston city hub, not a wrong clinic.
      { source: "/:locale(en|es)/location/tx/houston/77076", destination: "/:locale/houston", permanent: true },
      { source: "/location/tx/houston/77076", destination: "/houston", permanent: true },
      { source: "/:locale(en|es)/location/tx/houston/77084", destination: "/:locale/contact/hwy-6", permanent: true },
      { source: "/location/tx/houston/77084", destination: "/contact/hwy-6", permanent: true },
      { source: "/:locale(en|es)/location/tx/pasadena/77502", destination: "/:locale/contact/pasadena", permanent: true },
      { source: "/location/tx/pasadena/77502", destination: "/contact/pasadena", permanent: true },
      // No zip on the old San Antonio URL — genuinely ambiguous across 3 current locations, sent to the city hub.
      { source: "/:locale(en|es)/location/tx/san-antonio", destination: "/:locale/san-antonio", permanent: true },
      { source: "/location/tx/san-antonio", destination: "/san-antonio", permanent: true },
      { source: "/:locale(en|es)/location/tx/spring/77386", destination: "/:locale/contact/spring", permanent: true },
      { source: "/location/tx/spring/77386", destination: "/contact/spring", permanent: true },

      // Legacy /contents/additional-services/{old-slug} URLs (recovered from Wayback, 2022 crawl)
      // with confident 1:1 mappings to current numeric service IDs.
      { source: "/:locale(en|es)/contents/additional-services/physical-exam-dot", destination: "/:locale/services/7", permanent: true },
      { source: "/contents/additional-services/physical-exam-dot", destination: "/services/7", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/physical-exam-for-school", destination: "/:locale/services/14", permanent: true },
      { source: "/contents/additional-services/physical-exam-for-school", destination: "/services/14", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/immigration-exams-1", destination: "/:locale/services/25", permanent: true },
      { source: "/contents/additional-services/immigration-exams-1", destination: "/services/25", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/vitamin-b12", destination: "/:locale/services/19", permanent: true },
      { source: "/contents/additional-services/vitamin-b12", destination: "/services/19", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/ultrasounds-1", destination: "/:locale/services/16", permanent: true },
      { source: "/contents/additional-services/ultrasounds-1", destination: "/services/16", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/pap-smear-1", destination: "/:locale/services/17", permanent: true },
      { source: "/contents/additional-services/pap-smear-1", destination: "/services/17", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/general-blood-exam", destination: "/:locale/services/3", permanent: true },
      { source: "/contents/additional-services/general-blood-exam", destination: "/services/3", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/prostate-blood-exam", destination: "/:locale/services/11", permanent: true },
      { source: "/contents/additional-services/prostate-blood-exam", destination: "/services/11", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/sexually-transmitted-diseases-screening", destination: "/:locale/services/18", permanent: true },
      { source: "/contents/additional-services/sexually-transmitted-diseases-screening", destination: "/services/18", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/drainage-of-abscesses", destination: "/:locale/services/21", permanent: true },
      { source: "/contents/additional-services/drainage-of-abscesses", destination: "/services/21", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/ingrown-nail-removal", destination: "/:locale/services/12", permanent: true },
      { source: "/contents/additional-services/ingrown-nail-removal", destination: "/services/12", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/electrocardiogram", destination: "/:locale/services/15", permanent: true },
      { source: "/contents/additional-services/electrocardiogram", destination: "/services/15", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/complete-diabetes-screening", destination: "/:locale/services/20", permanent: true },
      { source: "/contents/additional-services/complete-diabetes-screening", destination: "/services/20", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/general-consultation", destination: "/:locale/services/23", permanent: true },
      { source: "/contents/additional-services/general-consultation", destination: "/services/23", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/odontology", destination: "/:locale/services/24", permanent: true },
      { source: "/contents/additional-services/odontology", destination: "/services/24", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services", destination: "/:locale/services", permanent: true },
      { source: "/contents/additional-services", destination: "/services", permanent: true },
      { source: "/:locale(en|es)/contents/about/:path*", destination: "/:locale/about", permanent: true },
      { source: "/contents/about/:path*", destination: "/about", permanent: true },
      { source: "/:locale(en|es)/contents/career", destination: "/:locale/career", permanent: true },
      { source: "/contents/career", destination: "/career", permanent: true },
      { source: "/:locale(en|es)/contents/specials", destination: "/:locale/special", permanent: true },
      { source: "/contents/specials", destination: "/special", permanent: true },
      { source: "/:locale(en|es)/contents/patient-forms", destination: "/:locale/registration", permanent: true },
      { source: "/contents/patient-forms", destination: "/registration", permanent: true },

      // T-1 & T-5b: Map hard 404s and pass the slug path (fallback for any /location/* URL not covered above)
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
      // Legacy Tebra doctor/provider redirects
      {
        source: "/doctor/:path*",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/:locale(en|es)/doctor/:path*",
        destination: "/:locale/about",
        permanent: true,
      },
      {
        source: "/provider/:path*",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/:locale(en|es)/provider/:path*",
        destination: "/:locale/about",
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

