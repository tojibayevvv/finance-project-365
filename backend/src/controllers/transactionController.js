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

//DELETE
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    await transactionService.deleteTransaction(id);

    res.json({
      success: true,
      message: "Transaction deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//PUT 
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await transactionService.updateTransaction(id, req.body);

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};