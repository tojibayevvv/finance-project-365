import React from 'react'
import styled from 'styled-components'

const ComponentButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff; 
    background-color: #1e293b;
    background: linear-gradient(135deg, #28374f 0%, #1e293b 100%);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s ease;

    &:hover {
      background: linear-gradient(135deg, #28374f 0%, #1e293b 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(34, 64, 197, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
`

export default function Button({ children, onClick }) {
    return (
        <ComponentButton onClick={onClick}>{children}</ComponentButton>
    )
}
