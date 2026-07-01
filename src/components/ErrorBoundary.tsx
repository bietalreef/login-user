import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    // Auto-reload on stale chunk errors (after new deployment)
    const isChunkError =
      error.message?.includes('Failed to fetch dynamically imported module') ||
      error.message?.includes('Importing a module script failed') ||
      error.name === 'ChunkLoadError';

    if (isChunkError) {
      const reloadKey = 'chunk_error_reload';
      const lastReload = sessionStorage.getItem(reloadKey);
      const now = Date.now();
      // Reload once — prevent infinite loop
      if (!lastReload || now - parseInt(lastReload) > 10_000) {
        sessionStorage.setItem(reloadKey, String(now));
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#F5EEE1] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-[#1F3D2B] mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              حدث خطأ غير متوقع
            </h1>
            <p className="text-gray-600 mb-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
              عذراً، حدث خطأ أثناء تحميل التطبيق. يرجى تحديث الصفحة أو المحاولة لاحقاً.
            </p>
            {this.state.error && (
              <details className="text-left mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <summary className="cursor-pointer text-sm font-medium text-red-800 mb-2">
                  تفاصيل الخطأ (للمطورين)
                </summary>
                <pre className="text-xs text-red-600 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-l from-[#D4AF37] to-[#3B5BFE] text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              تحديث الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}