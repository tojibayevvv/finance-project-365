const axios = require("axios");
const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

const {
  parseMessage,
  detectQuery,
  detectTimeRange,
  detectCategoryFromQuery,
  detectSummary,
} = require("../utils/parser");

const transactionService = require("../services/transactionService");
const { transcribeAudio } = require("../services/speechService");

bot.on("voice", async (msg) => {
  const chatId = msg.chat.id;

  try {
    const fileId = msg.voice.file_id;

    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

    const filePath = "./voice.ogg";

    const response = await axios({
      url: fileUrl,
      method: "GET",
      responseType: "stream",
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve) => writer.on("finish", resolve));

    // 🎤 TRANSCRIBE
    const text = await transcribeAudio(filePath);

    console.log("VOICE TEXT:", text); // 👈 VERY IMPORTANT

    const parsed = parseMessage(text);

    if (!parsed.amount || !parsed.type) {
      return bot.sendMessage(
        chatId,
        `🎤 I heard: "${text}"\n\nCould you say it like:\n"paid 50k for food" or "received 200k salary"?`,
      );
    }

    if (!parsed.category) {
      return bot.sendMessage(
        chatId,
        `🎤 Got it: "${text}"\n\nWhat category should I use? (food, transport, etc.)`,
      );
    }

    const saved = await transactionService.createTransaction(parsed);

    await bot.sendMessage(
      chatId,
      `🎤 Saved from voice!\n\nType: ${saved.type}\nAmount: ${saved.amount} UZS\nCategory: ${saved.category}`,
    );

    // cleanup file
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("VOICE ERROR:", error);
    bot.sendMessage(chatId, "❌ Voice processing failed");
  }
});

bot.on("message", async (msg) => {
  if (!msg.text) return;
  const chatId = msg.chat.id;
  const text = msg.text;

  try {
    // 🔍 Detect intents
    const isSummary = detectSummary(text);
    const queryType = detectQuery(text);
    const timeRange = detectTimeRange(text);
    const category = detectCategoryFromQuery(text);

    // 📊 1. SUMMARY FEATURE
    if (isSummary) {
      const totals = await transactionService.getTotalsByRange("today");

      return bot.sendMessage(
        chatId,
        `📊 Today Summary\n\n💰 Income: ${totals.income} UZS\n💸 Expenses: ${totals.expense} UZS\n📈 Net: ${totals.net} UZS`,
      );
    }

    // 💸 2. EXPENSE QUERY
    if (queryType === "total_expense") {
      const total = await transactionService.getTotalExpenses(
        timeRange,
        category,
      );

      return bot.sendMessage(
        chatId,
        `💸 Expenses (${category || "all"}, ${timeRange}): ${total} UZS`,
      );
    }

    // 💰 3. INCOME QUERY
    if (queryType === "total_income") {
      const total = await transactionService.getTotalIncome(
        timeRange,
        category,
      );

      return bot.sendMessage(
        chatId,
        `💰 Income (${category || "all"}, ${timeRange}): ${total} UZS`,
      );
    }

    // 🧾 4. TRANSACTION FLOW
    const parsed = parseMessage(text);

    if (!parsed.amount || !parsed.type) {
      return bot.sendMessage(
        chatId,
        "❗ Try: 'paid 50k for taxi' or ask 'how much did we spend?'",
      );
    }

    if (!parsed.category) {
      return bot.sendMessage(
        chatId,
        `❓ What category?\n\nAmount: ${parsed.amount}\nType: ${parsed.type}`,
      );
    }

    const saved = await transactionService.createTransaction(parsed);

    // ✅ Confirm save
    await bot.sendMessage(
      chatId,
      `✅ Saved!\n\nType: ${saved.type}\nAmount: ${saved.amount} UZS\nCategory: ${saved.category}`,
    );

    // ⚠️ 5. SMART ALERT FEATURE
    const { today, yesterday } =
      await transactionService.getTodayVsYesterdayExpenses();

    if (yesterday > 0 && today > yesterday * 1.5) {
      await bot.sendMessage(
        chatId,
        "⚠️ Your spending today is much higher than yesterday",
      );
    }
  } catch (error) {
    console.error("BOT ERROR:", error);
    bot.sendMessage(chatId, "❌ Something went wrong");
  }
});

module.exports = bot;
