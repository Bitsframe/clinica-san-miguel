const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from("Locations")
    .select("id, title, address, phone, slug")
  // 1. Disable duplicate Fort Worth (id: 9)
  await supabase.from("Locations").update({ is_active: false }).eq("id", 9);

  // 2. Set Kempwood slug
  await supabase.from("Locations").update({ slug: "kempwood" }).eq("id", 28);

  // 3. Fix accent slugs
  await supabase.from("Locations").update({ slug: "blanco" }).eq("id", 26);
  await supabase.from("Locations").update({ slug: "jefferson" }).eq("id", 27);

  // 4. Fix Fresno slug
  await supabase.from("Locations").update({ slug: "fresno-tx" }).eq("id", 16);

  // 5. Fix mismatched titles
  await supabase.from("Locations").update({ title: "Clinica San Miguel Dallas East" }).eq("id", 6);
  await supabase.from("Locations").update({ title: "Clinica San Miguel Spring" }).eq("id", 13);

  console.log("Location data fixed!");
}

run();
