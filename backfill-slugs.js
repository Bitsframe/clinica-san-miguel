const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           
    .replace(/[^\w\-]+/g, '')       
    .replace(/\-\-+/g, '-')         
    .replace(/^-+/, '')             
    .replace(/-+$/, '');            
}

async function run() {
  const { data: locations, error } = await supabase
    .from("Locations")
    .select("id, title")
    .eq("tenant_id", 1);

  if (error) {
    console.error("Error fetching locations:", error);
    return;
  }

  for (const location of locations) {
    let rawSlug = slugify(location.title);
    // Overrides for cleaner URLs
    if (rawSlug === 'clinica-san-miguel-houston-tx-office') rawSlug = 'houston-tx-office';
    rawSlug = rawSlug.replace('clinica-san-miguel-', ''); // Clean up the prefix if desired
    
    console.log(`Updating ID ${location.id}: ${location.title} -> ${rawSlug}`);
    
    const { error: updateError } = await supabase
      .from("Locations")
      .update({ slug: rawSlug })
      .eq("id", location.id);
      
    if (updateError) {
      console.error(`Failed to update ID ${location.id}:`, updateError);
    }
  }
  
  console.log("Backfill complete.");
}

run();
