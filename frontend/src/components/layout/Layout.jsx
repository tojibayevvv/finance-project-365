import { useState } from "react";
import styled from "styled-components";
import Sidebar from "./Sidebar";

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px 70px;
  background: #f1f5f9;
  min-height: 100vh;
`;

function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <Wrapper>
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Content>{children}</Content>
        </Wrapper>
    );
}

export default Layout;