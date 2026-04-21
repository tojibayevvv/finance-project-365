import { useEffect, useState } from "react";
import api from "../services/api";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import styled, { keyframes } from "styled-components";

// --- Animations ---

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

// --- Color Palette ---

const PALETTE = [
  { fill: "#3b82f6", light: "#eff6ff", text: "#1d4ed8" },
  { fill: "#f43f5e", light: "#fff1f2", text: "#be123c" },
  { fill: "#10b981", light: "#ecfdf5", text: "#065f46" },
  { fill: "#f59e0b", light: "#fffbeb", text: "#92400e" },
  { fill: "#8b5cf6", light: "#f5f3ff", text: "#5b21b6" },
  { fill: "#06b6d4", light: "#ecfeff", text: "#155e75" },
  { fill: "#ec4899", light: "#fdf2f8", text: "#9d174d" },
];

// --- Styled Components ---

const Page = styled.div`
  animation: ${fadeUp} 0.35s ease;
`;

const PageTitle = styled.h1`
  margin: 0 0 0.25rem;
  font-size: 1.75rem;
  color: #0f172a;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const PageSubtitle = styled.p`
  margin: 0 0 2rem;
  font-size: 0.9rem;
  color: #94a3b8;
`;

const SummaryStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SummaryCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.125rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  }
`;

const SummaryLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #94a3b8;
`;

const SummaryValue = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
  /* font-family: 'Courier New', monospace; */
  color: ${p => p.$color || '#0f172a'};
  letter-spacing: -0.01em;
`;

const SummaryMeta = styled.span`
  font-size: 0.75rem;
  color: #cbd5e1;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
  gap: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.07);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
`;

const CardHint = styled.span`
  font-size: 0.75rem;
  color: #cbd5e1;
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.25rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  background: ${p => p.$bg};
  transition: opacity 0.15s;

  &:hover { opacity: 0.85; }
`;

const LegendLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const LegendDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${p => p.$color};
  flex-shrink: 0;
`;

const LegendName = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${p => p.$color};
  text-transform: capitalize;
`;

const LegendValue = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: ${p => p.$color};
`;

const LegendBar = styled.div`
  height: 3px;
  border-radius: 2px;
  background: ${p => p.$color};
  width: ${p => p.$pct}%;
  opacity: 0.35;
  margin-top: 0.2rem;
`;

const EmptyHint = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #cbd5e1;
  font-size: 0.875rem;
`;

const SkeletonBlock = styled.div`
  height: ${p => p.$h || 14}px;
  width: ${p => p.$w || '100%'};
  border-radius: 6px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s linear infinite;
  margin-bottom: ${p => p.$mb || 0}px;
`;

// --- Custom Tooltip ---

const TooltipBox = styled.div`
  background: #0f172a;
  border-radius: 8px;
  padding: 0.5rem 0.875rem;
  font-size: 0.8rem;
  color: white;

  strong { display: block; font-size: 0.7rem; opacity: 0.6; margin-bottom: 2px; text-transform: capitalize; }
`;

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <TooltipBox>
      <strong>{payload[0].name}</strong>
      {payload[0].value.toLocaleString()} UZS
    </TooltipBox>
  );
};

// --- Component ---

function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/transactions")
      .then(res => setTransactions(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const net = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((net / totalIncome) * 100).toFixed(1) : 0;

  const expenseData = Object.values(
    transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        if (!acc[t.category]) acc[t.category] = { name: t.category, value: 0 };
        acc[t.category].value += t.amount;
        return acc;
      }, {})
  ).sort((a, b) => b.value - a.value);

  const maxExpense = expenseData[0]?.value || 1;

  const barData = [
    { name: "Income",  value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];

  const barColors = ["#10b981", "#f43f5e"];

  return (
    <Page>
      <PageTitle>Analytics</PageTitle>
      <PageSubtitle>A snapshot of your financial activity</PageSubtitle>

      {/* Summary strip */}
      <SummaryStrip>
        <SummaryCard>
          <SummaryLabel>Total Income</SummaryLabel>
          <SummaryValue $color="#10b981">
            {loading ? <SkeletonBlock $h={28} $w="80%" /> : `${totalIncome.toLocaleString()}`}
          </SummaryValue>
          <SummaryMeta>UZS</SummaryMeta>
        </SummaryCard>

        <SummaryCard>
          <SummaryLabel>Total Expenses</SummaryLabel>
          <SummaryValue $color="#f43f5e">
            {loading ? <SkeletonBlock $h={28} $w="80%" /> : `${totalExpense.toLocaleString()}`}
          </SummaryValue>
          <SummaryMeta>UZS</SummaryMeta>
        </SummaryCard>

        <SummaryCard>
          <SummaryLabel>Net Balance</SummaryLabel>
          <SummaryValue $color={net >= 0 ? "#3b82f6" : "#f43f5e"}>
            {loading ? <SkeletonBlock $h={28} $w="80%" /> : `${net >= 0 ? '+' : ''}${net.toLocaleString()}`}
          </SummaryValue>
          <SummaryMeta>UZS</SummaryMeta>
        </SummaryCard>

        <SummaryCard>
          <SummaryLabel>Savings Rate</SummaryLabel>
          <SummaryValue $color={Number(savingsRate) >= 0 ? "#8b5cf6" : "#f43f5e"}>
            {loading ? <SkeletonBlock $h={28} $w="60%" /> : `${savingsRate}%`}
          </SummaryValue>
          <SummaryMeta>of income saved</SummaryMeta>
        </SummaryCard>
      </SummaryStrip>

      <Grid>
        {/* Pie — expenses by category */}
        <ChartCard>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardHint>{expenseData.length} categories</CardHint>
          </CardHeader>

          {loading ? (
            <SkeletonBlock $h={220} />
          ) : expenseData.length === 0 ? (
            <EmptyHint>No expense data yet.</EmptyHint>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {expenseData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={PALETTE[i % PALETTE.length].fill}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <Legend>
                {expenseData.map((item, i) => {
                  const p = PALETTE[i % PALETTE.length];
                  const pct = ((item.value / totalExpense) * 100).toFixed(1);
                  return (
                    <LegendItem key={item.name} $bg={p.light}>
                      <LegendLeft>
                        <LegendDot $color={p.fill} />
                        <div>
                          <LegendName $color={p.text}>{item.name}</LegendName>
                          <LegendBar $color={p.fill} $pct={(item.value / maxExpense) * 100} />
                        </div>
                      </LegendLeft>
                      <div style={{ textAlign: 'right' }}>
                        <LegendValue $color={p.text}>{item.value.toLocaleString()}</LegendValue>
                        <div style={{ fontSize: '0.7rem', color: '#cbd5e1', marginTop: 1 }}>{pct}%</div>
                      </div>
                    </LegendItem>
                  );
                })}
              </Legend>
            </>
          )}
        </ChartCard>

        {/* Bar — income vs expense */}
        <ChartCard>
          <CardHeader>
            <CardTitle>Income vs Expense</CardTitle>
            <CardHint>overall comparison</CardHint>
          </CardHeader>

          {loading ? (
            <SkeletonBlock $h={300} />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} barSize={52} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fontWeight: 600, fill: '#64748b' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickFormatter={v => v >= 1000000
                    ? `${(v / 1000000).toFixed(1)}M`
                    : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
                  width={48}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
                >
                  {barData.map((_, i) => (
                    <Cell key={i} fill={barColors[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* ratio bar */}
          {!loading && totalIncome + totalExpense > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                <span>Income share</span>
                <span>Expense share</span>
              </div>
              <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', height: 8 }}>
                <div style={{
                  width: `${(totalIncome / (totalIncome + totalExpense)) * 100}%`,
                  background: '#10b981', transition: 'width 0.6s ease'
                }} />
                <div style={{
                  flex: 1,
                  background: '#f43f5e'
                }} />
              </div>
            </div>
          )}
        </ChartCard>
      </Grid>
    </Page>
  );
}

export default Analytics;