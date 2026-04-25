import { Component } from 'react';
import { LuTriangleAlert, LuRefreshCw } from 'react-icons/lu';
import styles from './ErrorFallback.module.css';

/** Used as the rendered fallback UI */
function ErrorFallbackUI({ error, onRetry }) {
  return (
    <div className={styles.wrapper} role="alert">
      <div className={styles.icon}>
        <LuTriangleAlert size={28} />
      </div>
      <h3 className={styles.title}>Something went wrong</h3>
      <p className={styles.message}>{error?.message || 'An unexpected error occurred.'}</p>
      {onRetry && (
        <button className={styles.retryBtn} onClick={onRetry}>
          <LuRefreshCw size={14} />
          Try Again
        </button>
      )}
    </div>
  );
}

/** Class-based Error Boundary */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallbackUI error={this.state.error} onRetry={this.handleRetry} />
      );
    }
    return this.props.children;
  }
}

export default ErrorFallbackUI;
