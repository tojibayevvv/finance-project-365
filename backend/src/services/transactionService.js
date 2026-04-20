const supabase = require("../db/supabase");

console.log("USING SUPABASE SERVICE");

// CREATE TRANSACTION
async function createTransaction(data) {
  const { amount, type, category, note } = data;

  const { data: result, error } = await supabase
    .from("transactions")
    .insert([
      {
        amount,
        type,
        category,
        note,
      },
    ])
    .select();

  if (error) {
    console.error("Supabase insert error:", error);
    throw error;
  }

  console.log("Inserted into DB:", result);

  return result[0];
}

// GET TRANSACTIONS
async function getTransactions() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetch error:", error);
    throw error;
  }

  return data;
}

module.exports = {
  createTransaction,
  getTransactions,
};