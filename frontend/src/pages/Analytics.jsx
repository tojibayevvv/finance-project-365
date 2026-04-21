import { useEffect, useState } from "react";
import api from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ChartCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;

  h3 {
    margin-bottom: 1.5rem;
    color: #1e293b;
    font-size: 1.25rem;
    text-align: center;
  }
`;

const COLORS = ["#4ade80", "#f87171", "#60a5fa", "#facc15", "#a78bfa", "#fb7185", "#34d399"];

function Analytics() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.get("/transactions").then((res) => {
      setTransactions(res.data.data);
    });
  }, []);

  // 🧠 Group expenses by category
  const expenseData = Object.values(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = { name: t.category, value: 0 };
        }
        acc[t.category].value += t.amount;
        return acc;
      }, {})
  );

  // 🧠 Income vs Expense
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const summaryData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: '#1e293b' }}>Financial Analytics</h1>

      <Container>
        {/* 💸 Expenses by Category */}
        <ChartCard>
          <h3>Expenses by Category</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={expenseData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {expenseData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value.toLocaleString()} UZS`, 'Amount']} />
          </PieChart>
        </ChartCard>

        {/* 📊 Income vs Expense */}
        <ChartCard>
          <h3>Income vs Expense</h3>
          <BarChart width={350} height={300} data={summaryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip formatter={(value) => [`${value.toLocaleString()} UZS`, 'Amount']} />
            <Bar dataKey="value" fill="#4ade80" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>
      </Container>
    </div>
  );
}

export default Analytics;