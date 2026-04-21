import { useEffect, useState } from "react";
import api from "../services/api";
import styled, { keyframes } from "styled-components";
import Button from "../components/Button";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";

// --- Styled Components ---

const spin = keyframes`to { transform: rotate(360deg); }`;

const FullLoader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 5px solid #e5e7eb;
  border-top-color: #1e293b;
  animation: ${spin} 1s linear infinite;
`;

// New top-level layout: visa left, stat cards right
const DashboardLayout = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.5rem;
  align-items: start;
  margin-bottom: 2rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  color: #272727;

  &:hover {
    box-shadow: 0 8px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
`;

const Naming = styled.h3`
  margin-bottom: 0.5rem;
  color: #1a1a1a;
  font-size: 1.125rem;
`;

const Description = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #fff;
  border: 2px solid;
  border-radius: 50%;
`;

const ProgressIcon = styled(FaAngleDoubleUp)`color: #138313;`;
const DownGradeIcon = styled(FaAngleDoubleDown)`color: #dc2626;`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
  }

  input, select {
    padding: 0.75rem;
    border-radius: 8px;
    border: 2px solid #e2e8f0;
    font-size: 1rem;
    transition: border-color 0.2s ease;
    &:focus {
      outline: none;
      border-color: #28374f;
    }
  }
`;

// --- Visa Card ---

const VisaCardOuter = styled.div`
  width: 400px;
  height: 225px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0d1b2a 0%, #1b3a5c 50%, #0d1b2a 100%);
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.3);
  font-family: 'Courier New', monospace;
  flex-shrink: 0;
`;

const CardChip = styled.div`
  position: absolute;
  top: 34px; left: 20px;
  width: 48px; height: 34px;
  border-radius: 5px;
  background: linear-gradient(135deg, #c9952a, #f0c060, #b8922d);
  box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  &::before {
    content: '';
    position: absolute;
    width: 100%; height: 1px;
    background: rgba(0,0,0,0.2);
    top: 50%;
  }
  &::after {
    content: '';
    position: absolute;
    height: 100%; width: 1px;
    background: rgba(0,0,0,0.2);
    left: 50%; top: 0;
  }
`;

const CardNumber = styled.div`
  position: absolute;
  bottom: 54px; left: 20px;
  font-size: 16px;
  letter-spacing: 2.5px;
  color: rgba(255,255,255,0.8);
  font-family: 'Roboto', system-ui, -apple-system, 'Segoe UI', sans-serif;
`;

const CardName = styled.div`
  position: absolute;
  bottom: 16px; left: 20px;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 2.8px;
  color: rgba(255,255,255,0.88);
`;

const CardExpiry = styled.div`
  position: absolute;
  bottom: 18px; left: 155px;
  font-size: 16px;
  color: rgba(255,255,255,0.6);
  letter-spacing: 1.5px;
`;

const VisaLogo = styled.div`
  position: absolute;
  top: 16px; right: 18px;
  font-family: serif;
  font-style: italic;
  font-weight: 900;
  font-size: 24px;
  color: #fff;
  letter-spacing: -1px;
`;

const BalanceRow = styled.div`
  width: 400px;
  margin-top: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BalanceBadge = styled.span`
  font-size: 13px;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 600;
  background: ${p => p.$positive ? '#dcfce7' : '#fee2e2'};
  color: ${p => p.$positive ? '#15803d' : '#b91c1c'};
`;

// --- Main Component ---

function Overview() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("expense");
    const [category, setCategory] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        api.get("/transactions")
            .then(res => {
                console.log("FETCH:", res.data);

                const data = res?.data?.data || res?.data || [];

                if (mounted) setTransactions(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.error("FETCH ERROR:", err);
                if (mounted) setTransactions([]);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    const handleAdd = async () => {
        setLoading(true);

        try {
            await api.post("/transactions", {
                amount: Number(amount),
                type,
                category,
                note,
            });

            setAmount("");
            setCategory("");
            setNote("");

            const res = await api.get("/transactions");

            const data = res?.data?.data || res?.data || [];

            setTransactions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("ADD ERROR:", error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const safeTransactions = transactions || [];

    const income = safeTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = safeTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    if (loading) {
        return (
            <FullLoader>
                <Spinner aria-label="Loading" />
                <p>Loading...</p>
            </FullLoader>
        );
    }

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', color: '#1e293b' }}>Financial Overview</h1>

            <DashboardLayout>
                {/* LEFT — Visa card + net balance */}
                <NetBalanceCard income={income} expense={expense} />

                {/* RIGHT — income & expense stacked */}
                <RightColumn>
                    <Card>
                        <div>
                            <Naming>Total Income</Naming>
                            <Description className="numeric" style={{ color: '#16a34a' }}>
                                +{income.toLocaleString()} UZS
                            </Description>
                        </div>
                        <IconWrap style={{ color: '#16a34a' }}>
                            <ProgressIcon />
                        </IconWrap>
                    </Card>

                    <Card>
                        <div>
                            <Naming>Total Expenses</Naming>
                            <Description className="numeric" style={{ color: '#dc2626' }}>
                                −{expense.toLocaleString()} UZS
                            </Description>
                        </div>
                        <IconWrap style={{ color: '#dc2626' }}>
                            <DownGradeIcon />
                        </IconWrap>
                    </Card>
                </RightColumn>
            </DashboardLayout>

            <h3 style={{ marginBottom: '1.5rem' }}>Quick Add Transaction</h3>

            <Form>
                <input type="number" placeholder="Amount" value={amount}
                    onChange={e => setAmount(e.target.value)} style={{ flex: '1', minWidth: '120px' }} />
                <select value={type} onChange={e => setType(e.target.value)} style={{ minWidth: '120px' }}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
                <select value={category} onChange={e => setCategory(e.target.value)} style={{ minWidth: '140px' }}>
                    <option value="">Select Category</option>
                    <option value="sales">Sales</option>
                    <option value="food">Food</option>
                    <option value="transport">Transport</option>
                    <option value="rent">Rent</option>
                    <option value="salary">Salary</option>
                    <option value="marketing">Marketing</option>
                    <option value="logistics">Logistics</option>
                </select>
                <input type="text" placeholder="Note (optional)" value={note}
                    onChange={e => setNote(e.target.value)} style={{ flex: '2', minWidth: '200px' }} />
                <Button onClick={handleAdd}>Add Transaction</Button>
            </Form>
        </div>
    );
}

export default Overview;

// --- NetBalanceCard ---

function NetBalanceCard({ income, expense }) {
    const net = income - expense;
    const isPositive = net >= 0;

    return (
        <div>
            <VisaCardOuter>
                <CardChip />
                <CardNumber>•••• •••• •••• 4821</CardNumber>
                <CardName>DATA 365</CardName>
                <CardExpiry>09/28</CardExpiry>
                <VisaLogo>VISA</VisaLogo>
            </VisaCardOuter>

            <BalanceRow>
                <div>
                    <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 4px' }}>Net Balance</p>
                    <p className="numeric" style={{
                        fontSize: 18, fontWeight: 700, margin: 0,
                        color: isPositive ? '#16a34a' : '#dc2626'
                    }}>
                        {isPositive ? '+' : ''}{net.toLocaleString()} UZS
                    </p>
                </div>
                <BalanceBadge $positive={isPositive}>
                    {isPositive ? 'Surplus' : 'Deficit'}
                </BalanceBadge>
            </BalanceRow>
        </div>
    );
}