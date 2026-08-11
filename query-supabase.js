const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: d1, error: e1 } = await supabase.from("services").select("id");
  console.log("lowercase 'services':", d1?.length, e1);
  const { data: d2, error: e2 } = await supabase.from("Services").select("id");
  console.log("Capital 'Services':", d2?.length, e2);
}

run();
