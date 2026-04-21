const express = require("express");
const router = express.Router();
const controller = require("../controllers/transactionController");

router.post("/", controller.createTransaction);
router.get("/", controller.getTransactions);
router.delete("/:id", controller.deleteTransaction);
router.put("/:id", controller.updateTransaction);

module.exports = router;