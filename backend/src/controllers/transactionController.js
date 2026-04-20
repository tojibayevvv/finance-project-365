const transactionService = require("../services/transactionService");

// CREATE
exports.createTransaction = async (req, res) => {
  try {
    const newTransaction = await transactionService.createTransaction(req.body);

    res.status(201).json({
      success: true,
      data: newTransaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getTransactions();

    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};