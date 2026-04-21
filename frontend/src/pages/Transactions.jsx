import { useEffect, useState } from "react";
import api from "../services/api";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import styled, { keyframes } from "styled-components";
import { FiTrash2, FiDownload, FiFilter } from "react-icons/fi";

// --- Animations ---

const shimmer = keyframes`
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// --- Styled Components ---

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeIn} 0.3s ease;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.75rem;

  h1 {
    margin: 0;
    font-size: 1.75rem;
    color: #0f172a;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
  padding: 0.875rem 1.125rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  margin-bottom: 1.25rem;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  select {
    padding: 0.4rem 0.65rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 7px;
    background: white;
    font-size: 0.85rem;
    color: #1e293b;
    cursor: pointer;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #94a3b8;
    }
  }
`;

const FilterIcon = styled(FiFilter)`
  color: #94a3b8;
  width: 15px;
  height: 15px;
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #0f172a;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.01em;

  &:hover {
    background: #1e293b;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.25);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: #f8fafc;
  border-bottom: 1.5px solid #e2e8f0;
`;

const TableHeader = styled.th`
  padding: 0.875rem 1.125rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  white-space: nowrap;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 0.9rem 1.125rem;
  color: #475569;
  font-size: 0.875rem;
  vertical-align: middle;

  &.amount {
    font-weight: 700;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    color: #1e293b;
    letter-spacing: 0.02em;
  }
`;

const TypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  background: ${p => p.$type === 'income' ? '#dcfce7' : '#fee2e2'};
  color: ${p => p.$type === 'income' ? '#15803d' : '#b91c1c'};
`;

const CategoryPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #f1f5f9;
  color: #475569;
  text-transform: capitalize;
`;

const SkeletonCell = styled.div`
  height: 13px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: ${shimmer} 1.4s linear infinite;
`;

const TrashButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #fecaca;
  background: #fff5f5;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: #fee2e2;
    border-color: #fca5a5;
    transform: scale(1.08);
  }

  &:active {
    transform: scale(0.96);
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;

  p {
    font-size: 1.05rem;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 0.4rem;
  }

  span {
    font-size: 0.875rem;
  }
`;

// --- Component ---

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const categories = [...new Set(transactions.map(t => t.category))];

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterType !== "all" && t.type !== filterType) return false;
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    return true;
  });

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  const handleExport = () => {
    const data = filteredTransactions.map(t => ({
      Type: t.type,
      Amount: t.amount,
      Category: t.category,
      Note: t.note,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "transactions.xlsx");
  };

  if (!loading && transactions.length === 0) {
    return (
      <Container>
        <PageHeader><h1>Transactions</h1></PageHeader>
        <EmptyState>
          <p>No transactions yet.</p>
          <span>Add some transactions from the Overview page to get started.</span>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader>
        <h1>Transactions</h1>
        <ExportButton onClick={handleExport}>
          <FiDownload size={15} />
          Export to Excel
        </ExportButton>
      </PageHeader>

      <FilterBar>
        <FilterIcon />
        <FilterGroup>
          <label>Type</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </FilterGroup>
        <FilterGroup>
          <label>Category</label>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </FilterGroup>
      </FilterBar>

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
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {[80, 100, 90, 200, 40].map((w, j) => (
                    <TableCell key={j}>
                      <SkeletonCell style={{ width: w }} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>
                  No transactions match the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map(t => (
                <TableRow key={t.id}>
                  <TableCell>
                    <TypeBadge $type={t.type}>
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </TypeBadge>
                  </TableCell>
                  <TableCell className="amount">
                    {t.type === 'income' ? '+' : '−'}{t.amount.toLocaleString()} UZS
                  </TableCell>
                  <TableCell>
                    <CategoryPill>{t.category}</CategoryPill>
                  </TableCell>
                  <TableCell style={{ color: t.note ? '#475569' : '#cbd5e1' }}>
                    {t.note || '—'}
                  </TableCell>
                  <TableCell>
                    <TrashButton onClick={() => handleDelete(t.id)} title="Delete transaction">
                      <FiTrash2 />
                    </TrashButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Transactions;