const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { error: e1 } = await supabase.from("Locations").update({ slug: "spring" }).eq("id", 13);
  console.log("Spring updated:", e1);
  const { error: e2 } = await supabase.from("Locations").update({ slug: "dallas-east" }).eq("id", 6);
  console.log("Dallas East updated:", e2);
}

run();
