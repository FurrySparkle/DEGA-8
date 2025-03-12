import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const ThinkingContainer = styled.div`
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 0.5rem;
    margin-bottom: 1rem;
`;

const ThinkingFooter = styled.div`
    cursor: pointer;
    padding: 0.5rem;
    user-select: none;
    display: flex;
    align-items: center;
    font-weight: 500;
    margin: -0.5rem -0.5rem 0;
    border-radius: 8px 8px 0 0;
    transition: background-color 0.2s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.05);
    }
`;

const Chevron = styled.span<{ isOpen: boolean }>`
    display: inline-block;
    transition: transform 0.2s ease;
    margin-right: 0.5rem;
    width: 1rem;
    text-align: center;
    transform: rotate(${props => props.isOpen ? '90deg' : '0deg'});
`;

const ThinkingContent = styled.div<{ isOpen: boolean }>`
    max-height: ${props => props.isOpen ? '20000' : '0'};
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    margin-top: ${props => props.isOpen ? '0.5rem' : '0'};
    overflow-y: auto;
    max-height: ${props => props.isOpen ? '400px' : '0'};
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
    }
    pre {
        margin: 0 !important;
        background: rgba(0, 0, 0, 0.3) !important;
    }
`;

interface ThinkingSectionProps {
    content: string;
    isThinking?: boolean;
}

export const ThinkingSection: React.FC<ThinkingSectionProps> = ({ content, isThinking = false }) => {
    const [isOpen, setIsOpen] = useState(isThinking);

    useEffect(() => {
        setIsOpen(isThinking);
    }, [isThinking]);

    return (
        <ThinkingContainer>
            
            <ThinkingContent isOpen={isOpen}>
                <pre>{content}</pre>
            </ThinkingContent>
            <ThinkingFooter onClick={() => setIsOpen(!isOpen)}>
                <Chevron isOpen={isOpen}>&rsaquo;</Chevron>
                💭 Thought Process {isOpen ? ' *head filling*' : 'head full of thoughts'}
            </ThinkingFooter>
        </ThinkingContainer>
    );
}; 