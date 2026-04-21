import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

const Container = styled.div`
  width: 280px;
  height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 2rem 1.5rem;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 100;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
`;

const NavItem = styled(Link)`
  display: block;
  color: #cbd5f5;
  margin-bottom: 1rem;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.active {
    color: white;
    background-color: #4ade80;
    box-shadow: 0 2px 8px rgba(74, 222, 128, 0.3);
  }
`;

function Sidebar() {
  const location = useLocation();

  return (
    <Container>
      <Title>Finance Manager</Title>

      <NavItem to="/" className={location.pathname === "/" ? "active" : ""}>
        Overview
      </NavItem>
      <NavItem to="/transactions" className={location.pathname === "/transactions" ? "active" : ""}>
        Transactions
      </NavItem>
      <NavItem to="/analytics" className={location.pathname === "/analytics" ? "active" : ""}>
        Analytics
      </NavItem>
      <NavItem to="/categories" className={location.pathname === "/categories" ? "active" : ""}>
        Categories
      </NavItem>
    </Container>
  );
}

export default Sidebar;