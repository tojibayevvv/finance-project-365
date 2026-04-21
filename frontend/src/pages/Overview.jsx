import { useEffect, useState } from "react";
import api from "../services/api";
import styled from "styled-components";
import Card from "../components/Card";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

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
      border-color: #4ade80;
    }
  }

  button {
    background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s ease;

    &:hover {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

function Overview() {
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("expense");
    const [category, setCategory] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        api.get("/transactions").then((res) => {
            setTransactions(res.data.data);
        });
    }, []);

    const handleAdd = async () => {
        try {
            await api.post("/transactions", {
                amount: Number(amount),
                type,
                category,
                note,
            });

            // clear form
            setAmount("");
            setCategory("");
            setNote("");

            // refresh data
            const res = await api.get("/transactions");
            setTransactions(res.data.data);

        } catch (error) {
            console.error(error);
        }
    };

    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', color: '#1e293b' }}>Financial Overview</h1>

            <Grid>
                <Card>
                    <h3>Total Income</h3>
                    <p style={{ color: '#16a34a' }}>+{income.toLocaleString()} UZS</p>
                </Card>

                <Card>
                    <h3>Total Expenses</h3>
                    <p style={{ color: '#dc2626' }}>-{expense.toLocaleString()} UZS</p>
                </Card>

                <Card>
                    <h3>Net Balance</h3>
                    <p style={{ color: income - expense >= 0 ? '#16a34a' : '#dc2626' }}>
                        {(income - expense).toLocaleString()} UZS
                    </p>
                </Card>
            </Grid>

            <Card>
                <h3 style={{ marginBottom: '1.5rem' }}>Quick Add Transaction</h3>

                <Form>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{ flex: '1', minWidth: '120px' }}
                    />

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={{ minWidth: '120px' }}
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ minWidth: '140px' }}
                    >
                        <option value="">Select Category</option>
                        <option value="sales">Sales</option>
                        <option value="food">Food</option>
                        <option value="transport">Transport</option>
                        <option value="rent">Rent</option>
                        <option value="salary">Salary</option>
                        <option value="marketing">Marketing</option>
                        <option value="logistics">Logistics</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Note (optional)"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        style={{ flex: '2', minWidth: '200px' }}
                    />

                    <button onClick={handleAdd}>Add Transaction</button>
                </Form>
            </Card>
        </div>
    );
}

export default Overview;