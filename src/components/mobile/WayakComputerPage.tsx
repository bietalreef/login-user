/**
 * WayakComputerPage.tsx — Orchestrator لبيئة الحوسبة السحابية
 * ══════════════════════════════════════════════════════════════
 * 1. يتحقق من إعداد السحابة (KV store عبر server)
 * 2. إذا لم يكتمل الإعداد → يعرض CloudDesktopSetup
 * 3. بعد الإعداد → يفتح WayakComputer (Desktop view)
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router@7.1.1';
import { Loader2, Monitor } from 'lucide-react';
import { supabase } from '../../utils/supabase/client';
import { projectId as supaProjectId, publicAnonKey } from '../../utils/supabase/info';
import { CloudDesktopSetup } from '../cloud-desktop/CloudDesktopSetup';
import { WayakComputer } from './WayakComputer';

const API = `https://${supaProjectId}.supabase.co/functions/v1/make-server-ad34c09a`;
const fontCairo = "'Cairo','Tajawal',system-ui,sans-serif";

type Status = 'checking' | 'needs-setup' | 'ready';

interface CloudConfig {
  projectId: string;
  apiKey: string;
  serviceAccountJson?: string;
  completedAt?: string;
}

export default function WayakComputerPage() {
  const navigate      = useNavigate();
  const [status, setStatus]   = useState<Status>('checking');
  const [config, setConfig]   = useState<CloudConfig | null>(null);

  // ── Check if user already has cloud setup ──
  useEffect(() => {
    let cancelled = false;
    async function checkSetup() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        const res = await fetch(`${API}/cloud-desktop/setup`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            ...(token ? { 'X-User-Token': token } : {}),
          },
        });

        if (!res.ok) throw new Error('fetch error');
        const json = await res.json();

        if (cancelled) return;
        if (json.config?.status === 'active') {
          setConfig(json.config);
          setStatus('ready');
        } else {
          setStatus('needs-setup');
        }
      } catch {
        if (!cancelled) setStatus('needs-setup');
      }
    }
    checkSetup();
    return () => { cancelled = true; };
  }, []);

  // ── Setup complete callback ──
  function handleSetupComplete(cfg: CloudConfig) {
    setConfig(cfg);
    setStatus('ready');
  }

  // ── Loading ──
  if (status === 'checking') {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#060C1A', zIndex: 9999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 14, fontFamily: fontCairo,
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '35%', left: '50%', transform: 'translateX(-50%)',
          width: 300, height: 150, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(59,91,254,0.08) 0%, transparent 70%)',
        }} />

        <div style={{
          width: 56, height: 56, borderRadius: 18,
          background: 'rgba(212,175,55,0.08)',
          border: '1px solid rgba(212,175,55,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', zIndex: 1,
        }}>
          <Monitor size={24} style={{ color: '#D4AF37' }} />
        </div>

        <Loader2
          size={22}
          style={{ color: '#D4AF37', animation: 'spin 1s linear infinite', position: 'relative', zIndex: 1 }}
        />
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', position: 'relative', zIndex: 1 }}>
          جاري التحقق من بيئتك السحابية...
        </span>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── Needs Setup ──
  if (status === 'needs-setup') {
    return <CloudDesktopSetup onComplete={handleSetupComplete} />;
  }

  // ── Ready: show the cloud desktop ──
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      <WayakComputer
        isOpen={true}
        onClose={() => navigate('/home')}
        isFullScreen={true}
        defaultView="desktop"
      />
    </div>
  );
}
