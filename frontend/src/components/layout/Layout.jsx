import styled from "styled-components";
import Sidebar from "./Sidebar";

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
`;

const SidebarWrapper = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 2rem;
  background: #f8fafc;
  margin-left: 0;

  @media (min-width: 769px) {
    margin-left: 280px;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

function Layout({ children }) {
  return (
    <Wrapper>
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>
      <Content>{children}</Content>
    </Wrapper>
  );
}

export default Layout;