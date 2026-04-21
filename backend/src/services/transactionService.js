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

// TOTAL EXPENSES (optionally by period)
async function getTotalExpenses(timeRange = "all", category = null) {
  let query = supabase
    .from("transactions")
    .select("amount")
    .eq("type", "expense");

  const now = new Date();

  if (timeRange === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    query = query.gte("date", start.toISOString());
  }

  if (timeRange === "week") {
    const start = new Date();
    start.setDate(now.getDate() - 7);
    query = query.gte("date", start.toISOString());
  }

  if (timeRange === "month") {
    const start = new Date();
    start.setMonth(now.getMonth() - 1);
    query = query.gte("date", start.toISOString());
  }

  // 🔥 NEW: filter by category
  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data.reduce((sum, t) => sum + Number(t.amount), 0);
}

// TOTAL INCOME
async function getTotalIncome(timeRange = "all", category = null) {
  let query = supabase
    .from("transactions")
    .select("amount")
    .eq("type", "income");

  const now = new Date();

  if (timeRange === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    query = query.gte("date", start.toISOString());
  }

  if (timeRange === "week") {
    const start = new Date();
    start.setDate(now.getDate() - 7);
    query = query.gte("date", start.toISOString());
  }

  if (timeRange === "month") {
    const start = new Date();
    start.setMonth(now.getMonth() - 1);
    query = query.gte("date", start.toISOString());
  }

  // 🔥 filter by category
  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data.reduce((sum, t) => sum + Number(t.amount), 0);
}

async function getTotalsByRange(timeRange = "today") {
  const now = new Date();
  let start = new Date();

  if (timeRange === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (timeRange === "week") {
    start.setDate(now.getDate() - 7);
  } else if (timeRange === "month") {
    start.setMonth(now.getMonth() - 1);
  }

  const { data, error } = await supabase
    .from("transactions")
    .select("amount,type,date")
    .gte("date", start.toISOString());

  if (error) throw error;

  let income = 0;
  let expense = 0;

  data.forEach((t) => {
    if (t.type === "income") income += Number(t.amount);
    if (t.type === "expense") expense += Number(t.amount);
  });

  return {
    income,
    expense,
    net: income - expense,
  };
}

// for alert comparison (today vs yesterday)
async function getTodayVsYesterdayExpenses() {
  const now = new Date();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const yesterdayStart = new Date();
  yesterdayStart.setDate(now.getDate() - 1);
  yesterdayStart.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("transactions")
    .select("amount,type,date")
    .eq("type", "expense");

  if (error) throw error;

  let today = 0;
  let yesterday = 0;

  data.forEach((t) => {
    const d = new Date(t.date);

    if (d >= todayStart) today += Number(t.amount);
    else if (d >= yesterdayStart && d < todayStart)
      yesterday += Number(t.amount);
  });

  return { today, yesterday };
}

async function deleteTransaction(id) {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    throw error;
  }
}

module.exports = {
  createTransaction,
  getTransactions,
  getTotalExpenses,
  getTotalIncome,
  getTotalsByRange,
  getTodayVsYesterdayExpenses,
  deleteTransaction,
};