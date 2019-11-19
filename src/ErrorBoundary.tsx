import React, { ErrorInfo, ReactNode } from 'react';

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<{}, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error(error);
    console.error(errorInfo);
  }

  public render(): ReactNode {
    const { hasError } = this.state;
    if (hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    const { children } = this.props;

    return children;
  }
}
