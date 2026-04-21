// Parse amount (supports: 50000, 50k, 1.2m)
function parseAmount(text) {
  if (!text) return null;

  text = text.toLowerCase();

  // digits: 50k, 100000
  const match = text.match(/(\d+(\.\d+)?)(k|m|b)?/i);

  if (match) {
    let value = parseFloat(match[1]);

    if (match[3]) {
      const suffix = match[3].toLowerCase();
      if (suffix === "k") value *= 1000;
      if (suffix === "m") value *= 1000000;
      if (suffix === "b") value *= 1000000000;
    }

    return Math.round(value);
  }

  // basic word handling
  if (text.includes("thousand")) return 1000;
  if (text.includes("million")) return 1000000;

  return null;
}

// Detect transaction type
function detectType(text) {
  if (/(paid|spent|buy|bought)/i.test(text)) return "expense";
  if (/(received|get|got|earned)/i.test(text)) return "income";
  return null;
}

// Detect category
function detectCategory(text) {
  if (/(sales|client|project)/i.test(text)) return "sales";
  if (/(taxi|transport|uber|bus)/i.test(text)) return "transport";
  if (/(food|lunch|dinner|restaurant)/i.test(text)) return "food";
  if (/(rent|office)/i.test(text)) return "rent";
  if (/(salary|wage)/i.test(text)) return "salary";
  if (/(marketing|ads)/i.test(text)) return "marketing";
  if (/(logistics|delivery|shipping)/i.test(text)) return "logistics";

  return null; // important → lets bot ask follow-up
}

// Main parser
function parseMessage(text) {
  if (!text) return {};

  text = text.toLowerCase();

  const amount = parseAmount(text);
  const type = detectType(text);
  const category = detectCategory(text);

  return {
    amount,
    type,
    category,
    note: text,
  };
}

function detectQuery(text) {
  if (!text) return null;
  if (/how much.*spend/i.test(text)) return "total_expense";
  if (/(how much.*earn|how much.*income|total income)/i.test(text))
    return "total_income";
  return null;
}

function detectTimeRange(text) {
  if (!text) return "all";
  if (/today/i.test(text)) return "today";
  if (/this week/i.test(text)) return "week";
  if (/this month/i.test(text)) return "month";
  return "all"; // default
}

function detectCategoryFromQuery(text) {
  if (!text) return null;
  text = text.toLowerCase();

  if (
    text.includes("sales") ||
    text.includes("client") ||
    text.includes("project")
  )
    return "sales";
  if (text.includes("transport") || text.includes("taxi")) return "transport";
  if (
    text.includes("food") ||
    text.includes("lunch") ||
    text.includes("dinner")
  )
    return "food";
  if (text.includes("rent")) return "rent";
  if (text.includes("salary")) return "salary";
  if (text.includes("marketing")) return "marketing";
  if (text.includes("logistics")) return "logistics";

  return null;
}

function detectSummary(text) {
  if (!text) return false;
  return /(summary|report)/i.test(text);
}

module.exports = {
  parseMessage,
  detectQuery,
  detectTimeRange,
  detectCategoryFromQuery,
  detectSummary,
};
