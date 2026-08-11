const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: locations, error } = await supabase
    .from("Locations")
    .select("id, slug")
    .eq("tenant_id", 1);

  let redirectsStr = '';
  for (const loc of locations) {
    if (!loc.slug) continue;
    redirectsStr += `      { source: "/:locale(en|es)/contact/${loc.id}", destination: "/:locale/contact/${loc.slug}", permanent: true },\n`;
    redirectsStr += `      { source: "/contact/${loc.id}", destination: "/contact/${loc.slug}", permanent: true },\n`;
  }
  
  // also change location/:path* -> contact/:path*
  console.log(redirectsStr);
}

run();
