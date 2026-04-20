let transactions = [];

// Create transaction
function createTransaction(data) {
  const newTransaction = {
    id: Date.now(),
    amount: data.amount,
    type: data.type,
    category: data.category,
    date: data.date || new Date(),
    note: data.note || "",
  };

  transactions.push(newTransaction);

  return newTransaction;
}

// Get all transactions
function getTransactions() {
  return transactions;
}

module.exports = {
  createTransaction,
  getTransactions,
};