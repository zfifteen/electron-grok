import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="max-w-2xl p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Error Type:</p>
              <p className="text-sm text-gray-900 bg-gray-100 p-2 rounded">{this.state.error?.name || 'Unknown Error'}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Error Message:</p>
              <p className="text-sm text-gray-900 bg-gray-100 p-2 rounded">{this.state.error?.message || 'No message available'}</p>
            </div>
            {this.state.errorInfo && (
              <details className="mb-4">
                <summary className="text-sm font-semibold text-gray-700 cursor-pointer">Stack Trace</summary>
                <pre className="text-xs text-gray-900 bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-64">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Restart Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;