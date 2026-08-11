const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: tests, error } = await supabase.from("Testinomial").select("*");
  if (error) return console.error(error);

  const placeholderPhrases = [
    "truly a gem in the healthcare industry",
    "My experience at Clinica San Miguel was fantastic",
    "I had a fantastic experience at Clinica San Miguel",
    "provided me with exceptional care",
    "I had a wonderful experience at Clinica San Miguel",
    "I can't say enough good things about Clinica San Miguel",
    "exceeded my expectations",
    "My visit to Clinica San Miguel was outstanding",
    "I was thoroughly impressed by the level of care",
    "Clinica San Miguel is truly a gem",
    "I had a fantastic experience at Clinica San",
    "I was thoroughly impressed by Clinica San Miguel"
  ];

  let deletedCount = 0;
  for (const test of tests) {
    if (test.review && placeholderPhrases.some(p => test.review.includes(p))) {
      // Check if it's the real one (id 2 or 76)
      if (test.id === 2 || test.id === 76) continue;

      const { error: delError } = await supabase.from("Testinomial").delete().eq("id", test.id);
      if (delError) {
        console.error("Failed to delete", test.id);
      } else {
        deletedCount++;
        console.log("Deleted placeholder", test.id, test.name);
      }
    }
  }

  console.log("Deleted", deletedCount, "placeholder testimonials.");
}

run();
