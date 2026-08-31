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
    // Vercel's image optimizer is returning 402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED
    // — the plan's optimization allowance is exhausted, so every remotely-hosted
    // image (all Supabase service and clinic photos) fails to load while the
    // underlying files serve 200 fine.
    //
    // Bypassing the optimizer restores the images immediately at the cost of
    // automatic resizing and AVIF/WebP conversion, so pages are heavier. Revert
    // this once the Vercel plan is upgraded, or move resizing to Supabase's own
    // transformation API.
    unoptimized: true,
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
      { source: "/:locale(en|es)/contents/additional-services/physical-exam-dot", destination: "/:locale/services/dot-physical-exam", permanent: true },
      { source: "/contents/additional-services/physical-exam-dot", destination: "/services/dot-physical-exam", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/physical-exam-for-school", destination: "/:locale/services/school-physical", permanent: true },
      { source: "/contents/additional-services/physical-exam-for-school", destination: "/services/school-physical", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/immigration-exams-1", destination: "/:locale/services/immigration-medical-exam", permanent: true },
      { source: "/contents/additional-services/immigration-exams-1", destination: "/services/immigration-medical-exam", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/vitamin-b12", destination: "/:locale/services/vitamin-b12", permanent: true },
      { source: "/contents/additional-services/vitamin-b12", destination: "/services/vitamin-b12", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/ultrasounds-1", destination: "/:locale/services/ultrasound", permanent: true },
      { source: "/contents/additional-services/ultrasounds-1", destination: "/services/ultrasound", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/pap-smear-1", destination: "/:locale/services/womens-preventive-screening", permanent: true },
      { source: "/contents/additional-services/pap-smear-1", destination: "/services/womens-preventive-screening", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/general-blood-exam", destination: "/:locale/services/blood-tests", permanent: true },
      { source: "/contents/additional-services/general-blood-exam", destination: "/services/blood-tests", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/prostate-blood-exam", destination: "/:locale/services/psa-test", permanent: true },
      { source: "/contents/additional-services/prostate-blood-exam", destination: "/services/psa-test", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/sexually-transmitted-diseases-screening", destination: "/:locale/services/sexual-health-checkup", permanent: true },
      { source: "/contents/additional-services/sexually-transmitted-diseases-screening", destination: "/services/sexual-health-checkup", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/drainage-of-abscesses", destination: "/:locale/services/walk-in-procedure-care", permanent: true },
      { source: "/contents/additional-services/drainage-of-abscesses", destination: "/services/walk-in-procedure-care", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/ingrown-nail-removal", destination: "/:locale/services/ingrown-toenail-removal", permanent: true },
      { source: "/contents/additional-services/ingrown-nail-removal", destination: "/services/ingrown-toenail-removal", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/electrocardiogram", destination: "/:locale/services/ekg", permanent: true },
      { source: "/contents/additional-services/electrocardiogram", destination: "/services/ekg", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/complete-diabetes-screening", destination: "/:locale/services/diabetes-care", permanent: true },
      { source: "/contents/additional-services/complete-diabetes-screening", destination: "/services/diabetes-care", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/general-consultation", destination: "/:locale/services/primary-care", permanent: true },
      { source: "/contents/additional-services/general-consultation", destination: "/services/primary-care", permanent: true },
      { source: "/:locale(en|es)/contents/additional-services/odontology", destination: "/:locale/services/dentistry", permanent: true },
      { source: "/contents/additional-services/odontology", destination: "/services/dentistry", permanent: true },
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

      // Legacy service slugs whose slug has since changed. Aliases matching a
      // current slug are deliberately absent — they would collide with the
      // canonical URL and produce a redirect loop.
      { source: "/:locale(en|es)/services/dot-test", destination: "/:locale/services/dot-physical-exam", permanent: true },
      { source: "/services/dot-test", destination: "/services/dot-physical-exam", permanent: true },
      { source: "/:locale(en|es)/services/dot-physical", destination: "/:locale/services/dot-physical-exam", permanent: true },
      { source: "/services/dot-physical", destination: "/services/dot-physical-exam", permanent: true },
      { source: "/:locale(en|es)/services/diabetes", destination: "/:locale/services/diabetes-care", permanent: true },
      { source: "/services/diabetes", destination: "/services/diabetes-care", permanent: true },
      { source: "/:locale(en|es)/services/dentist", destination: "/:locale/services/dentistry", permanent: true },
      { source: "/services/dentist", destination: "/services/dentistry", permanent: true },
      { source: "/:locale(en|es)/services/pregnancy-services", destination: "/:locale/services/pregnancy-care", permanent: true },
      { source: "/services/pregnancy-services", destination: "/services/pregnancy-care", permanent: true },
      { source: "/:locale(en|es)/services/vitamin-b-12", destination: "/:locale/services/vitamin-b12", permanent: true },
      { source: "/services/vitamin-b-12", destination: "/services/vitamin-b12", permanent: true },
      { source: "/:locale(en|es)/services/high-cholesterol", destination: "/:locale/services/cholesterol-triglycerides", permanent: true },
      { source: "/services/high-cholesterol", destination: "/services/cholesterol-triglycerides", permanent: true },
      { source: "/:locale(en|es)/services/high-cholesterol-and-triglycerides", destination: "/:locale/services/cholesterol-triglycerides", permanent: true },
      { source: "/services/high-cholesterol-and-triglycerides", destination: "/services/cholesterol-triglycerides", permanent: true },
      { source: "/:locale(en|es)/services/pediatrics", destination: "/:locale/services/children-healthcare", permanent: true },
      { source: "/services/pediatrics", destination: "/services/children-healthcare", permanent: true },
      { source: "/:locale(en|es)/services/hypertension", destination: "/:locale/services/hypertension-care", permanent: true },
      { source: "/services/hypertension", destination: "/services/hypertension-care", permanent: true },
      { source: "/:locale(en|es)/services/sexual-health-checkups", destination: "/:locale/services/sexual-health-checkup", permanent: true },
      { source: "/services/sexual-health-checkups", destination: "/services/sexual-health-checkup", permanent: true },

    ];
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));

