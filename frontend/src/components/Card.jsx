import styled from "styled-components";

const CardBackground = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;

    &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    }
`;

const Seperator = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Naming = styled.h3`
    margin-bottom: 0.5rem;
    color: #505137;
    font-size: 1.125rem;
  `

const Description = styled.p`
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
`

const IconWrap = styled.div`
    background-color: #fff;
    border: yellow;
`

function Card({ name, description, icon }) {
    return (
        <CardBackground>
            <IconWrap>{icon}</IconWrap>
            <Naming>{name}</Naming>
            <Description>{description}</Description>
        </CardBackground>
    )
}

export default Card;