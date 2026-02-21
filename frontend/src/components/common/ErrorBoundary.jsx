import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // keep console logging for developer visibility
    console.error('ErrorBoundary caught an error', error, info);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 rounded border border-red-100">
          <h3 className="text-red-700 font-semibold">Something went wrong</h3>
          <p className="text-sm text-red-600 mt-2">{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <div className="mt-4 flex gap-2">
            <button className="px-3 py-1 bg-white border rounded text-sm" onClick={this.reset}>Try again</button>
            <button className="px-3 py-1 bg-red-600 text-white rounded text-sm" onClick={() => window.location.reload()}>Reload page</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
