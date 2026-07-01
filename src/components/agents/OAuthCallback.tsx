/**
 * OAuthCallback.tsx
 * ─────────────────────────────────────────────────
 * Renders at /oauth/callback
 *
 * Handles two OAuth flows:
 * 1. Authorization Code flow: ?code=xxx&state={"connectorId":"gmail",...}
 * 2. Implicit flow:           #access_token=ya29...&state=key
 *
 * Posts result to window.opener then closes popup.
 */
import { useEffect } from 'react';

export function OAuthCallback() {
  useEffect(() => {
    try {
      const hash   = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const search = new URLSearchParams(window.location.search);

      // Authorization code flow (Google)
      const code   = search.get('code');
      const stateRaw = search.get('state') ?? hash.get('state') ?? '';

      // Implicit flow
      const token  = hash.get('access_token') ?? search.get('access_token');
      const error  = hash.get('error') ?? search.get('error');

      // Parse state
      let connectorId = '';
      try {
        const parsed = JSON.parse(stateRaw);
        connectorId = parsed.connectorId || stateRaw;
      } catch {
        connectorId = stateRaw;
      }

      if (window.opener && !window.opener.closed) {
        if (code) {
          // Authorization code flow — send code to parent
          window.opener.postMessage(
            { type: 'oauth-callback', connectorId, code, success: true },
            window.location.origin,
          );
        } else {
          // Implicit flow — send token
          window.opener.postMessage(
            {
              type: 'weyaak_oauth_callback',
              key: connectorId,
              token,
              error,
              success: !!token && !error,
            },
            window.location.origin,
          );
        }
      }
    } catch (e) {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
          { type: 'oauth-callback', success: false, error: 'parse_error' },
          window.location.origin,
        );
      }
    }
    // Close popup after a short delay to ensure message is sent
    setTimeout(() => window.close(), 500);
  }, []);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F5F0E8', fontFamily: "'Cairo', sans-serif", color: '#0F172A',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
          background: 'rgba(212,175,55,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>جارٍ التفويض...</p>
        <p style={{ fontSize: 12, color: '#64748B' }}>
          سيتم إغلاق هذه النافذة تلقائياً
        </p>
      </div>
    </div>
  );
}
