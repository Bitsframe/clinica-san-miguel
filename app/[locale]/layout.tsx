import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Poppins, Dancing_Script } from "next/font/google";
import "./globals.css";

import { Providers } from "../providers";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { locales } from "@/navigation";
import ToastProvider from "@/utils/ToastProvider";
import { getRootMetadata } from "@/utils/seo";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: "400",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const rootMetadata = getRootMetadata(locale);
  
  if (
    process.env.RAILWAY_ENVIRONMENT_NAME && process.env.RAILWAY_ENVIRONMENT_NAME !== "production" ||
    process.env.RAILWAY_ENVIRONMENT ||
    process.env.NEXT_PUBLIC_SITE_URL?.includes("railway.app") ||
    process.env.VERCEL_ENV === "preview"
  ) {
    rootMetadata.robots = {
      index: false,
      follow: false,
    };
  }
  
  return rootMetadata;
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // ✅ handle param as a Promise
}) {
  const { children, params } = props;

  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || '';

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${poppins.variable} ${dancingScript.variable}`}
      suppressHydrationWarning
    >
      <NextIntlClientProvider locale={locale} messages={messages}>
      <body className="font-inter bg-[#F4F5F6] sm:bg-[#F8F5F0] relative overflow-x-hidden w-[100vw]" suppressHydrationWarning>
        {gtmId ? (
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        ) : null}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-368434703"
          strategy="afterInteractive"
        />
        <Script id="google-ads-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-368434703');
          `}
        </Script>
        {/* Google Tag Manager (noscript) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {/* End Google Tag Manager (noscript) */}

          <Providers>
            <ToastProvider>
              {children}
            </ToastProvider>
          </Providers>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
