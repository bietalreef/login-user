/**
 * WorkspaceGuard.tsx — بوابة حماية Workspace
 * ═══════════════════════════════════════════
 * يفحص من EffectiveState:
 *   1. isAuthenticated === true
 *   2. role in ['client', 'provider', 'admin']
 *
 * إذا لم يكن المستخدم مسجّل دخول → redirect /home
 * إذا مسجّل دخول بدون role أو بدون ملف مكتمل →
 *   يعرض ServiceGate modal inline لإكمال البيانات
 * إذا تحققت الشروط → يعرض WorkspaceShell
 */

import { lazy, Suspense, useState } from 'react';
import { Navigate, useNavigate } from 'react-router@7.1.1';
import { useEffectiveState } from '../../contexts/EffectiveState';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { Loader2 } from 'lucide-react';
import { checkGate } from '../gates/ServiceGate';

// Lazy load for ServiceGateModal (to avoid circular deps, import dynamically)
import ServiceGateModal from '../gates/ServiceGate';

const WorkspaceShell = lazy(() => import('./WorkspaceShell'));

const ALLOWED_ROLES = ['client', 'provider', 'admin'];

export default function WorkspaceGuardWrapper() {
  const { state, isReady, refresh } = useEffectiveState();
  const { isDark } = useTheme();
  const { language } = useTranslation('common');
  const isEn = language === 'en';
  const navigate = useNavigate();

  const [showGate, setShowGate] = useState(false);
  const [gateCompleted, setGateCompleted] = useState(false);

  // Derive gate status from state (reactive)
  const gateResult = isReady && state.isAuthenticated
    ? checkGate('access_workspace', state)
    : null;
  const needsGate = gateResult ? !gateResult.passed : false;

  // Show gate modal when needed (but not if user already completed it this session)
  const shouldShowGate = needsGate && !gateCompleted;

  // Loading state
  if (!isReady) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-[#1a1a2e]' : 'bg-[#F5EEE1]'}`}>
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  // Gate 1: Must be authenticated
  if (!state.isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // Gate 2+3: role + profile → show ServiceGate modal if needed
  if (shouldShowGate) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#1a1a2e]' : 'bg-[#F5EEE1]'}`}>
        <ServiceGateModal
          isOpen={true}
          service="access_workspace"
          onComplete={async () => {
            setGateCompleted(true);
            await refresh();
          }}
          onClose={() => navigate('/home')}
        />
      </div>
    );
  }

  // All gates passed — render WorkspaceShell
  return (
    <Suspense
      fallback={
        <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-[#1a1a2e]' : 'bg-[#F5EEE1]'}`}>
          <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
        </div>
      }
    >
      <WorkspaceShell />
    </Suspense>
  );
}