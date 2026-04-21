import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

// --- Animations ---

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const overlayIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const modalIn = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

// --- Data ---

const categories = [
  {
    name: 'Sales',
    icon: '💰',
    color: '#16a34a',
    light: '#f0fdf4',
    border: '#bbf7d0',
    text: '#14532d',
    description: 'Revenue earned from selling products or services.',
    examples: ['Product sales', 'Service fees', 'Online store revenue', 'Wholesale orders', 'Commission income'],
    type: 'income',
  },
  {
    name: 'Salary',
    icon: '💼',
    color: '#0284c7',
    light: '#f0f9ff',
    border: '#bae6fd',
    text: '#0c4a6e',
    description: 'Regular compensation received for employment or freelance work.',
    examples: ['Monthly paycheck', 'Freelance payment', 'Contractor fees', 'Bonuses', 'Overtime pay'],
    type: 'income',
  },
  {
    name: 'Food',
    icon: '🍽️',
    color: '#dc2626',
    light: '#fff1f2',
    border: '#fecdd3',
    text: '#7f1d1d',
    description: 'Daily meals, groceries, and dining expenses.',
    examples: ['Grocery shopping', 'Restaurant meals', 'Coffee & cafes', 'Food delivery', 'Snacks & drinks'],
    type: 'expense',
  },
  {
    name: 'Transport',
    icon: '🚗',
    color: '#2563eb',
    light: '#eff6ff',
    border: '#bfdbfe',
    text: '#1e3a8a',
    description: 'Costs related to moving around — fuel, fares, and maintenance.',
    examples: ['Fuel / petrol', 'Taxi & ride-share', 'Public transit pass', 'Car maintenance', 'Parking fees'],
    type: 'expense',
  },
  {
    name: 'Rent',
    icon: '🏠',
    color: '#7c3aed',
    light: '#f5f3ff',
    border: '#ddd6fe',
    text: '#4c1d95',
    description: 'Housing and workspace rental payments.',
    examples: ['Monthly rent', 'Office space', 'Storage unit', 'Utility bills', 'Internet & phone'],
    type: 'expense',
  },
  {
    name: 'Marketing',
    icon: '📢',
    color: '#ea580c',
    light: '#fff7ed',
    border: '#fed7aa',
    text: '#7c2d12',
    description: 'Spending on advertising, branding, and customer acquisition.',
    examples: ['Social media ads', 'Print materials', 'Influencer deals', 'SEO tools', 'Email campaigns'],
    type: 'expense',
  },
  {
    name: 'Logistics',
    icon: '📦',
    color: '#0891b2',
    light: '#ecfeff',
    border: '#a5f3fc',
    text: '#164e63',
    description: 'Shipping, delivery, and supply chain related costs.',
    examples: ['Shipping fees', 'Warehousing', 'Packaging materials', 'Courier services', 'Import duties'],
    type: 'expense',
  },
];

// --- Styled Components ---

const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
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

const SectionLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #cbd5e1;
  margin-bottom: 0.75rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CategoryCard = styled.div`
  background: ${p => p.$light};
  border: 1px solid ${p => p.$border};
  border-radius: 14px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 14px;
    border: 2px solid ${p => p.$color};
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);

    &::after { opacity: 1; }
  }

  &:active { transform: translateY(0); }
`;

const CardIconRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardIcon = styled.span`
  font-size: 1.75rem;
  line-height: 1;
`;

const TypeBadge = styled.span`
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2rem 0.55rem;
  border-radius: 20px;
  background: ${p => p.$type === 'income' ? '#dcfce7' : '#fee2e2'};
  color: ${p => p.$type === 'income' ? '#15803d' : '#b91c1c'};
`;

const CardName = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${p => p.$text};
`;

const CardDesc = styled.div`
  font-size: 0.78rem;
  color: #94a3b8;
  line-height: 1.4;
`;

const InfoHint = styled.div`
  font-size: 0.72rem;
  color: ${p => p.$color};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  opacity: 0.7;
  margin-top: 0.25rem;
`;

// --- Modal ---

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: ${overlayIn} 0.2s ease;
`;

const Modal = styled.div`
  background: white;
  border-radius: 18px;
  padding: 2rem;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.18);
  animation: ${modalIn} 0.25s ease;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const ModalIconBox = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: ${p => p.$light};
  border: 1px solid ${p => p.$border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  flex-shrink: 0;
`;

const ModalTitleGroup = styled.div`
  flex: 1;
`;

const ModalTitle = styled.h2`
  margin: 0 0 0.2rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
`;

const ModalDesc = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #64748b;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover {
    background: #fee2e2;
    border-color: #fecaca;
    color: #dc2626;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 1.25rem 0;
`;

const ExamplesTitle = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #cbd5e1;
  margin-bottom: 0.75rem;
`;

const ExamplesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const ExampleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  background: ${p => p.$light};
  font-size: 0.85rem;
  color: ${p => p.$text};
  font-weight: 500;
`;

const Dot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${p => p.$color};
  flex-shrink: 0;
`;

const ModalFooter = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FooterNote = styled.span`
  font-size: 0.78rem;
  color: #cbd5e1;
`;

const FooterBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  background: ${p => p.$type === 'income' ? '#dcfce7' : '#fee2e2'};
  color: ${p => p.$type === 'income' ? '#15803d' : '#b91c1c'};
`;

// --- Component ---

const Categories = () => {
  const [selected, setSelected] = useState(null);

  const income = categories.filter(c => c.type === 'income');
  const expense = categories.filter(c => c.type === 'expense');

  return (
    <Page>
      <PageTitle>Categories</PageTitle>
      <PageSubtitle>Click any category to see what it includes</PageSubtitle>

      <SectionLabel>Income</SectionLabel>
      <Grid>
        {income.map(cat => (
          <CategoryCard
            key={cat.name}
            $light={cat.light}
            $border={cat.border}
            $color={cat.color}
            onClick={() => setSelected(cat)}
          >
            <CardIconRow>
              <CardIcon>{cat.icon}</CardIcon>
              <TypeBadge $type={cat.type}>Income</TypeBadge>
            </CardIconRow>
            <CardName $text={cat.text}>{cat.name}</CardName>
            <CardDesc>{cat.description}</CardDesc>
            <InfoHint $color={cat.color}>
              <span>↗</span> {cat.examples.length} examples inside
            </InfoHint>
          </CategoryCard>
        ))}
      </Grid>

      <SectionLabel>Expenses</SectionLabel>
      <Grid>
        {expense.map(cat => (
          <CategoryCard
            key={cat.name}
            $light={cat.light}
            $border={cat.border}
            $color={cat.color}
            onClick={() => setSelected(cat)}
          >
            <CardIconRow>
              <CardIcon>{cat.icon}</CardIcon>
              <TypeBadge $type={cat.type}>Expense</TypeBadge>
            </CardIconRow>
            <CardName $text={cat.text}>{cat.name}</CardName>
            <CardDesc>{cat.description}</CardDesc>
            <InfoHint $color={cat.color}>
              <span>↗</span> {cat.examples.length} examples inside
            </InfoHint>
          </CategoryCard>
        ))}
      </Grid>

      {/* Modal */}
      {selected && (
        <Overlay onClick={() => setSelected(null)}>
          <Modal onClick={e => e.stopPropagation()}>
            <CloseBtn onClick={() => setSelected(null)}>✕</CloseBtn>

            <ModalHeader>
              <ModalIconBox $light={selected.light} $border={selected.border}>
                {selected.icon}
              </ModalIconBox>
              <ModalTitleGroup>
                <ModalTitle>{selected.name}</ModalTitle>
                <ModalDesc>{selected.description}</ModalDesc>
              </ModalTitleGroup>
            </ModalHeader>

            <Divider />

            <ExamplesTitle>What's typically included</ExamplesTitle>
            <ExamplesList>
              {selected.examples.map(ex => (
                <ExampleRow key={ex} $light={selected.light} $text={selected.text}>
                  <Dot $color={selected.color} />
                  {ex}
                </ExampleRow>
              ))}
            </ExamplesList>

            <ModalFooter>
              <FooterNote>Use this when adding a transaction</FooterNote>
              <FooterBadge $type={selected.type}>
                {selected.type === 'income' ? 'Income category' : 'Expense category'}
              </FooterBadge>
            </ModalFooter>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
};

export default Categories;