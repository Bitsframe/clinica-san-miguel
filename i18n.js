// import { getRequestConfig } from "next-intl/server";

// export default getRequestConfig(async ({ locale }) => ({
//   messages: (await import(`./messages/${locale}.json`)).default,
// }));


import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

export default getRequestConfig(async () => {
  const headersList = await headers(); // ✅ await is now handled properly
  const locale = headersList.get("X-NEXT-INTL-LOCALE") || "en"; // fallback locale

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
