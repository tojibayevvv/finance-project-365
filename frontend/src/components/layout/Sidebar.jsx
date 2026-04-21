import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { BiLogoMeta } from "react-icons/bi";
import { FaHome, FaList, FaChartBar, FaTags, FaBars } from "react-icons/fa";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";



const Container = styled.div`
  width: ${(props) => (props.open ? "220px" : "70px")};
  background: #1e293b;
  color: white;
  padding: 20px 10px;
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  position: relative; /* 👈 IMPORTANT */
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  margin-bottom: 30px;
`;

const ToggleBtn = styled.div`
  position: absolute;
  top: 30px;
  right: -12px; /* 👈 pushes outside sidebar */
  
  width: 24px;
  height: 24px;
  background: #334155;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  font-size: 14px;
  color: white;

  border: 2px solid #1e293b; /* clean edge */
`;

const Title = styled.h2`
  display: ${(props) => (props.open ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
`
const Meta = styled(BiLogoMeta)`
 color: #fff;
`

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 👈 ALWAYS */
  color: #cbd5f5;
  margin-bottom: 10px;
  text-decoration: none;
  padding: 10px;
  border-radius: 8px;

  ${(p) =>
    p.$active &&
    `
    background: #394f8b37; /* navy-600 subtle */
    color: #fff; /* navy-800 */
    box-shadow: inset 0 0 0 1px rgba(166, 182, 224, 0.06);
  `}

  &:hover {
    color: #3c518585;
    background: rgba(30,58,138,0.06);
  }
`;

const Label = styled.span`
  opacity: ${(props) => (props.open ? 1 : 0)};
  width: ${(props) => (props.open ? "auto" : "0")};
  overflow: hidden;
  transition: 0.2s;
`;

const IconWrapper = styled.div`
  width: 24px;
  min-width: 24px;
  display: flex;
  justify-content: center;
  margin-right: 12px;
`;

function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

    return (
        <Container open={open}>
            <ToggleBtn open={open} onClick={() => setOpen(!open)}>
                {open ? <MdOutlineArrowBackIos /> : <MdOutlineArrowForwardIos />}
            </ToggleBtn>
            <Header>
                <Logo>
                    <Link to="/">
                        <Meta />
                    </Link>
                </Logo>
                <Title open={open}>Finance & Co</Title>
            </Header>


            <NavItem $active={location.pathname === "/"} open={open} to="/">
                <IconWrapper>
                    <FaHome />
                </IconWrapper>
                <Label open={open}>Overview</Label>
            </NavItem>

            <NavItem $active={location.pathname === "/transactions"} open={open} to="/transactions">
                <IconWrapper>
                    <FaList />
                </IconWrapper>
                <Label open={open}>Transactions</Label>
            </NavItem>

            <NavItem $active={location.pathname === "/analytics"} open={open} to="/analytics">
                <IconWrapper>
                    <FaChartBar />
                </IconWrapper>
                <Label open={open}>Analytics</Label>
            </NavItem>

            <NavItem $active={location.pathname === "/categories"} open={open} to="/categories">
                <IconWrapper>
                    <FaTags />
                </IconWrapper>
                <Label open={open}>Categories</Label>
            </NavItem>
        </Container>
    );
}

export default Sidebar;