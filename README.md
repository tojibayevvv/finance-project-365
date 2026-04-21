# 💰 Finance Manager (Telegram Bot + Dashboard)

## 📌 Overview
This project is designed for small and medium businesses in Uzbekistan to manage their finances in a centralized and efficient way. It enables users to log income and expenses via a Telegram bot using text or voice messages, while providing a web dashboard for real-time monitoring and analysis.

---

## 🚀 Features

### 🤖 Telegram Bot
- Log transactions via text or voice
- Automatic parsing of amount, type, and category
- Natural, human-like responses
- Query financial data (e.g. *"How much did we spend this week?"*)
- Fallback transcription system for reliability

You can test the bot here:  
👉 https://t.me/finanso_manager_bot

Example commands:
- "paid 50k for food"
- "received 200k from client"
- "how much did we spend this week?"

### 🌐 Web Dashboard
- Overview page with income, expenses, and net balance
- Transactions page with:
  - Filtering (type, category)
  - Inline edit & delete
  - Excel export
- Analytics page with charts and breakdowns
- Quick-add transaction form
- Collapsible modern sidebar UI

---

## 🛠 Tech Stack
- **Backend:** Node.js, Express  
- **Database:** Supabase (PostgreSQL)  
- **Frontend:** React (Vite), styled-components  
- **Bot:** node-telegram-bot-api  
- **Charts:** Recharts  

---

## ⚙️ Setup Instructions

### 1. Clone repository
```bash
git clone https://github.com/tojibayevvv/finance-project-365
cd finance-project-365