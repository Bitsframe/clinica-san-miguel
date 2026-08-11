const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  await supabase.from("Locations").update({ Group: "B" }).eq("id", 28);
  await supabase.from("Locations").update({ Group: "A" }).eq("id", 27);
  console.log("Groups updated");
}

run();
