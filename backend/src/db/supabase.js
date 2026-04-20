const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase URL:", process.env.SUPABASE_URL);
console.log("Supabase KEY:", process.env.SUPABASE_KEY ? "Loaded" : "Missing");

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;