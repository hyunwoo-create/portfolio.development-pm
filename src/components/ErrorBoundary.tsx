import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F7F7', padding: '1rem' }}>
          <div style={{ maxWidth: 420, width: '100%', background: '#fff', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.08)', padding: '2.5rem', textAlign: 'center', border: '1px solid #f1f1f1' }}>
            <div style={{ width: 64, height: 64, background: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#DC2626" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#112D4E', marginBottom: '0.5rem' }}>문제가 발생했습니다</h1>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
              화면을 불러오는 중 오류가 발생했습니다.<br />잠시 후 다시 시도해 주세요.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{ width: '100%', padding: '0.85rem 1.5rem', background: '#3F72AF', color: '#fff', fontWeight: 600, borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: '0.95rem', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#2c5a8f')}
              onMouseLeave={e => (e.currentTarget.style.background = '#3F72AF')}
            >
              페이지 새로고침
            </button>
            <details style={{ marginTop: '1.25rem', textAlign: 'left' }}>
              <summary style={{ fontSize: '0.75rem', color: '#9CA3AF', cursor: 'pointer' }}>에러 상세 정보</summary>
              <pre style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#F9F7F7', borderRadius: 8, fontSize: '0.65rem', color: '#6B7280', overflow: 'auto', maxHeight: 120 }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
