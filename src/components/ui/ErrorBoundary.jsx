import React from 'react';
import { AlertCircle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl border"
          style={{ background: 'var(--bg-deep)', borderColor: 'var(--danger-glow)' }}>
          <AlertCircle size={32} style={{ color: 'var(--danger)' }} />
          <p className="mt-3 font-medium" style={{ color: 'var(--text-bright)' }}>Something went wrong</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
            style={{ background: 'var(--accent-500)', color: 'white' }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
