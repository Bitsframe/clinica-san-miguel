const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { error } = await supabase.from("Locations").update({ tenant_id: 1 }).eq("id", 28);
  console.log("Updated Kempwood tenant_id:", error);
}

run();
