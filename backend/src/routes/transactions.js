const express = require("express");
const router = express.Router();
const controller = require("../controllers/transactionController");

router.post("/", controller.createTransaction);
router.get("/", controller.getTransactions);

module.exports = router;