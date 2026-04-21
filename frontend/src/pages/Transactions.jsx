import { useEffect, useState } from "react";
import api from "../services/api";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import styled from "styled-components";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;

  label {
    font-weight: 600;
    color: #374151;
  }

  select {
    padding: 0.5rem 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    background: white;
    font-size: 0.875rem;
    min-width: 120px;

    &:focus {
      outline: none;
      border-color: #4ade80;
    }
  }
`;

const ExportButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e2e8f0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #4b5563;
  font-size: 0.875rem;

  &.amount {
    font-weight: 600;
    font-family: 'Monaco', 'Menlo', monospace;
  }

  &.type-income {
    color: #16a34a;
    font-weight: 600;
  }

  &.type-expense {
    color: #dc2626;
    font-weight: 600;
  }
`;

const DeleteButton = styled.button`
  background: #fee2e2;
  border: 1px solid #fecaca;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fecaca;
    border-color: #fca5a5;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;

  p {
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }

  span {
    font-size: 0.875rem;
  }
`;

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [filterType, setFilterType] = useState("all");
    const [filterCategory, setFilterCategory] = useState("all");
    const categories = [...new Set(transactions.map(t => t.category))];

    useEffect(() => {
        fetchTransactions();
    }, []);

    const filteredTransactions = transactions.filter((t) => {
        if (filterType !== "all" && t.type !== filterType) return false;
        if (filterCategory !== "all" && t.category !== filterCategory) return false;
        return true;
    });

    const fetchTransactions = async () => {
        try {
            const res = await api.get("/transactions");
            setTransactions(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };


    const handleDelete = async (id) => {
        try {
            await api.delete(`/transactions/${id}`);
            fetchTransactions(); // refresh list
        } catch (error) {
            console.error(error);
        }
    };

    if (transactions.length === 0) {
        return (
            <Container>
                <h1 style={{ marginBottom: '2rem', color: '#1e293b' }}>Transactions</h1>
                <EmptyState>
                    <p>No transactions yet.</p>
                    <span>Add some transactions from the Overview page to get started.</span>
                </EmptyState>
            </Container>
        );
    }

    const handleExport = () => {
        const data = filteredTransactions.map((t) => ({
            Type: t.type,
            Amount: t.amount,
            Category: t.category,
            Note: t.note,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const file = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });

        saveAs(file, "transactions.xlsx");
    };

    return (
        <Container>
            <Header>
                <h1 style={{ margin: 0, color: '#1e293b' }}>Transactions</h1>
                <ExportButton onClick={handleExport}>
                    Export to Excel
                </ExportButton>
            </Header>

            <Filters>
                <div>
                    <label>Type: </label>
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="all">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>

                <div>
                    <label>Category: </label>
                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </Filters>

            <TableContainer>
                <Table>
                    <TableHead>
                        <tr>
                            <TableHeader>Type</TableHeader>
                            <TableHeader>Amount</TableHeader>
                            <TableHeader>Category</TableHeader>
                            <TableHeader>Note</TableHeader>
                            <TableHeader>Action</TableHeader>
                        </tr>
                    </TableHead>

                    <TableBody>
                        {filteredTransactions.map((t) => (
                            <TableRow key={t.id}>
                                <TableCell className={`type-${t.type}`}>
                                    {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                                </TableCell>
                                <TableCell className="amount">
                                    {t.amount.toLocaleString()} UZS
                                </TableCell>
                                <TableCell>{t.category}</TableCell>
                                <TableCell>{t.note || '-'}</TableCell>
                                <TableCell>
                                    <DeleteButton onClick={() => handleDelete(t.id)}>
                                        Delete
                                    </DeleteButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default Transactions;