/**
 * WayakAgentOSPage.tsx
 * ─────────────────────────────────────────────
 * Standalone full-screen page for /agents route.
 * Provides its own context stack so it can live
 * OUTSIDE BrowserLayout (no TopNav, no scroll wrapper).
 * This is critical — height: 100dvh works cleanly here.
 */
import { Suspense } from 'react';
import { AgentActivationProvider } from '../../contexts/AgentActivationContext';
import { IntegrationProvider } from '../../contexts/IntegrationContext';
import { PreviewProvider } from '../../contexts/PreviewContext';
import { WayakAgentOS } from './WayakAgentOS';

function Spinner() {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#060E1A',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid rgba(212,175,55,0.15)',
        borderTopColor: '#D4AF37',
        animation: 'spin 1s linear infinite',
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function WayakAgentOSPage() {
  return (
    <div style={{ width: '100%', height: '100dvh', overflow: 'hidden', background: '#060E1A' }}>
      <AgentActivationProvider>
        <IntegrationProvider>
          <PreviewProvider>
            <Suspense fallback={<Spinner />}>
              <WayakAgentOS onClose={() => window.history.back()} />
            </Suspense>
          </PreviewProvider>
        </IntegrationProvider>
      </AgentActivationProvider>
    </div>
  );
}

export default WayakAgentOSPage;
