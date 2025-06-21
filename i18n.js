import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));

// import { getRequestConfig } from 'next-intl/server';

// export default getRequestConfig(async ({ requestLocale }) => {
//   const locale = await requestLocale; // ✅ MUST await it
//   return {
//     messages: (await import(`./messages/${locale}.json`)).default
//   };
// });

