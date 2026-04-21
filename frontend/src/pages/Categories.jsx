import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  text-align: center;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const CategoryCard = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
  font-weight: 600;
  color: #374151;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    transform: translateY(-2px);
  }
`;

const categories = [
  { name: 'Sales', icon: '💰', color: '#16a34a' },
  { name: 'Food', icon: '🍽️', color: '#dc2626' },
  { name: 'Transport', icon: '🚗', color: '#2563eb' },
  { name: 'Rent', icon: '🏠', color: '#7c3aed' },
  { name: 'Salary', icon: '💼', color: '#16a34a' },
  { name: 'Marketing', icon: '📢', color: '#ea580c' },
  { name: 'Logistics', icon: '📦', color: '#0891b2' },
];

const Categories = () => {
  return (
    <Container>
      <h1 style={{ marginBottom: '2rem', color: '#1e293b' }}>Transaction Categories</h1>

      <Card>
        <h3 style={{ marginBottom: '1rem' }}>Available Categories</h3>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          These are the predefined categories you can use when adding transactions.
        </p>

        <CategoryGrid>
          {categories.map((category) => (
            <CategoryCard key={category.name}>
              <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}>
                {category.icon}
              </span>
              {category.name}
            </CategoryCard>
          ))}
        </CategoryGrid>
      </Card>
    </Container>
  );
};

export default Categories;