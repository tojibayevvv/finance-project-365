const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());

const testRoutes = require("./routes/test");
app.use("/test", testRoutes);

const transactionRoutes = require("./routes/transactions");
app.use("/transactions", transactionRoutes);

module.exports = app;