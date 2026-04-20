const transactionService = require("../services/transactionService");

// Create transaction
exports.createTransaction = (req, res) => {
  try {
    const data = req.body;

    const newTransaction = transactionService.createTransaction(data);

    res.status(201).json({
      success: true,
      message: "Transaction created",
      data: newTransaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating transaction",
    });
  }
};

// Get all transactions
exports.getTransactions = (req, res) => {
  try {
    const transactions = transactionService.getTransactions();

    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching transactions",
    });
  }
};