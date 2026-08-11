const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: loc } = await supabase.from("Locations").select("id, title, slug").eq("slug", "fort-worth-tx-office");
  console.log("Location:", loc);
  if (loc && loc.length > 0) {
    const { data: images, error } = await supabase.from("Images").select("*").eq("location_id", loc[0].id);
    console.log("Images count:", images?.length, "Error:", error);
    if (images && images.length > 0) console.log("Sample:", images[0]);
  }
}

run();
