import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  padding: 20px;
  margin: 20px;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  background-color: #f8d7da;
  color: #721c24;
  text-align: center;
`;

const ErrorHeading = styled.h2`
  margin-bottom: 10px;
  font-size: 1.5rem;
`;

const ErrorMessage = styled.p`
  margin-bottom: 15px;
  font-size: 1rem;
`;

const RetryButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #c82333;
  }
`;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.pathname;
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <ErrorContainer>
          <ErrorHeading>Something went wrong</ErrorHeading>
          <ErrorMessage>
            We apologize for the inconvenience. The page could not be displayed properly.
          </ErrorMessage>
          <RetryButton onClick={this.handleRetry}>
            Retry
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
