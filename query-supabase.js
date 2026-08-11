const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const enText5 = "Our state-of-the-art facilities and dedicated physicians are equipped to serve the diverse healthcare needs of communities across Texas.";
  const esText5 = "Nuestras instalaciones de última generación y médicos dedicados están equipados para servir las diversas necesidades de salud de las comunidades en Texas.";

  const { data: enData, error: enError } = await supabase
    .from("about")
    .update({ text_5: enText5 })
    .eq("id", 1);

  const { data: esData, error: esError } = await supabase
    .from("about_es")
    .update({ text_5: esText5 })
    .eq("id", 1);

  console.log("Updated En Error:", enError);
  console.log("Updated Es Error:", esError);
}

run();
