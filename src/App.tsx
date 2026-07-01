/**
 * App.tsx — بيت الريف
 * ═══════════════════════════════════════════════════════════════
 * فصل تام بين فرعين:
 *
 *  ┌─ PublicShell ──────────────────────────────────────────────┐
 *  │  صفحات SEO العامة — صفر auth — صفر app-providers           │
 *  │  / | /privacy | /terms | /about | /map/:city | /sitemap    │
 *  │  /contractors-in-uae | /provider/:slug | /seo/*  …         │
 *  └────────────────────────────────────────────────────────────┘
 *
 *  ┌─ AppShell ─────────────────────────────────────────────────┐
 *  │  التطبيق الداخلي — يتطلب تسجيل دخول                       │
 *  │  /home | /services | /maps | /shop | /profile …            │
 *  └────────────────────────────────────────────────────────────┘
 *
 * لا يوجد component مشترك بين الفرعين.
 * لا يمكن أن تظهر صفحة SEO داخل layout التطبيق أو العكس.
 */

// ══════════════════════════════════════════════════════════════
// Canonical domain redirect — يجب أن يكون قبل أي شيء آخر
// www.app.bietalreef.ae → app.bietalreef.ae (نفس الـ session)
// ══════════════════════════════════════════════════════════════
if (typeof window !== 'undefined' && window.location.hostname === 'www.app.bietalreef.ae') {
  window.location.replace(
    window.location.href.replace('www.app.bietalreef.ae', 'app.bietalreef.ae')
  );
}

import { useState, useEffect, lazy, Suspense, startTransition } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router@7.1.1";
import { supabase } from "./utils/supabase/client";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WeyaakIdentityProvider } from "./contexts/WeyaakIdentityContext";
import { Toaster } from "./components/ui/sonner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useEffectiveState } from "./contexts/EffectiveState";
import { ZoomProvider } from "./contexts/ZoomContext";

// ── Chunk error detection ──────────────────────────────────────
function isChunkError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  return (
    err.message.includes('Failed to fetch dynamically imported module') ||
    err.message.includes('Importing a module script failed') ||
    err.message.includes('error loading dynamically imported module') ||
    err.name === 'ChunkLoadError'
  );
}

// ── Retry helper — on chunk error: hard reload (stale deploy fix) ──
function lazyRetry<T>(fn: () => Promise<T>, retries = 2, delay = 800): Promise<T> {
  return fn().catch((err) => {
    if (isChunkError(err)) {
      // Stale index.html referencing old asset hashes — force fresh load
      const key = 'chunk_reload_ts';
      const last = Number(sessionStorage.getItem(key) ?? '0');
      if (Date.now() - last > 15_000) {
        sessionStorage.setItem(key, String(Date.now()));
        window.location.reload();
      }
      throw err; // if already reloaded recently, show error UI
    }
    if (retries <= 0) throw err;
    return new Promise<T>((resolve) =>
      setTimeout(() => resolve(lazyRetry(fn, retries - 1, delay)), delay)
    );
  });
}

// ── Route-level error element — auto-reload once, then show button ──
function RouteErrorElement() {
  const hasReloaded = sessionStorage.getItem('route_error_reloaded');
  if (!hasReloaded) {
    sessionStorage.setItem('route_error_reloaded', '1');
    // Unregister service workers + clear caches, then reload
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs =>
        Promise.all(regs.map(r => r.unregister()))
      ).then(() => caches.keys()).then(keys =>
        Promise.all(keys.map(k => caches.delete(k)))
      ).finally(() => window.location.replace('/'));
    } else {
      window.location.replace('/');
    }
    return null;
  }
  // Already tried auto-reload — show manual button
  sessionStorage.removeItem('route_error_reloaded');
  return (
    <div style={{
      minHeight: '100dvh', background: '#0B1120',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, direction: 'rtl', fontFamily: 'Cairo, sans-serif',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24, padding: 36, maxWidth: 420, width: '100%', textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
        <h1 style={{ color: '#F0F4FA', fontSize: 20, fontWeight: 900, marginBottom: 10 }}>
          حدث خطأ في التحميل
        </h1>
        <p style={{ color: '#64748B', fontSize: 13.5, lineHeight: 1.8, marginBottom: 24 }}>
          يرجى الضغط على الزر أدناه لإعادة تحميل التطبيق.
        </p>
        <button
          onClick={() => {
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(regs =>
                Promise.all(regs.map(r => r.unregister()))
              ).then(() => caches.keys()).then(keys =>
                Promise.all(keys.map(k => caches.delete(k)))
              ).finally(() => window.location.replace('/'));
            } else {
              window.location.replace('/');
            }
          }}
          style={{
            background: 'linear-gradient(135deg, #D4AF37, #C8A030)',
            border: 'none', borderRadius: 12, padding: '13px 28px',
            color: '#000', fontFamily: 'Cairo, sans-serif',
            fontSize: 15, fontWeight: 800, cursor: 'pointer',
          }}
        >
          إعادة تحميل التطبيق
        </button>
      </div>
    </div>
  );
}

export type UserType    = "client" | "provider" | null;
export type ProviderType = "company" | "craftsman" | null;

// ═══════════════════════════════════════════════════════════════
// LAZY — Providers
// ═══════════════════════════════════════════════════════════════
const UserProviderLazy = lazy(() =>
  import("./utils/UserContext").then((m) => ({ default: m.UserProvider }))
);
const EffectiveStateProviderLazy = lazy(() =>
  import("./contexts/EffectiveState").then((m) => ({ default: m.EffectiveStateProvider }))
);
const PresenceProviderLazy = lazy(() =>
  import("./contexts/PresenceContext").then((m) => ({ default: m.PresenceProvider }))
);
const WalletProviderLazy = lazy(() =>
  import("./contexts/WalletContext").then((m) => ({ default: m.WalletProvider }))
);
const TaskProviderLazy = lazy(() =>
  import("./contexts/TaskContext").then((m) => ({ default: m.TaskProvider }))
);
const WayakCompanionProviderLazy = lazy(() =>
  import("./components/ui/WayakCompanion").then((m) => ({ default: m.WayakCompanionProvider }))
);
const ImageViewerProviderLazy = lazy(() =>
  import("./components/security/ImageViewer").then((m) => ({ default: m.ImageViewerProvider }))
);
const SecurityGuardLazy = lazy(() =>
  import("./components/security/SecurityGuard").then((m) => ({ default: m.SecurityGuard }))
);
const SEOHeadLazy = lazy(() =>
  import("./components/seo/SEOHead").then((m) => ({ default: m.SEOHead }))
);
const InstallPWAPromptLazy = lazy(() =>
  lazyRetry(() =>
    import("./components/mobile/InstallPWAPrompt").then((m) => ({ default: m.InstallPWAPrompt }))
  )
);
const GoogleMapsProviderLazy = lazy(() =>
  import("./components/providers/GoogleMapsLoader").then((m) => ({ default: m.GoogleMapsProvider }))
);
const LoginAppLazy = lazy(() => lazyRetry(() => import("./LoginApp")));

// ═══════════════════════════════════════════════════════════════
// LAZY — SEO Public Pages (فرع عام فقط)
// ═══════════════════════════════════════════════════════════════
const SEOLandingPage = lazy(() =>
  import("./components/seo/SEOLandingPage").then((m) => ({ default: m.SEOLandingPage }))
);
const SEOServicePage = lazy(() =>
  import("./components/seo/SEOServicePage").then((m) => ({ default: m.SEOServicePage }))
);
const SEOProviderProfile = lazy(() =>
  import("./components/seo/SEOProviderProfile").then((m) => ({ default: m.SEOProviderProfile }))
);
const SEOProductPage = lazy(() =>
  import("./components/seo/SEOProductPage").then((m) => ({ default: m.SEOProductPage }))
);
const SEOMapPage = lazy(() =>
  import("./components/seo/SEOMapPage").then((m) => ({ default: m.SEOMapPage }))
);
const SEOMarketplacePage = lazy(() =>
  import("./components/seo/SEOPlatformFeatures").then((m) => ({ default: m.SEOMarketplacePage }))
);
const SEOStorePage = lazy(() =>
  import("./components/seo/SEOPlatformFeatures").then((m) => ({ default: m.SEOStorePage }))
);
const SEODashboardsPage = lazy(() =>
  import("./components/seo/SEOPlatformFeatures").then((m) => ({ default: m.SEODashboardsPage }))
);
const SEOPlatformPage = lazy(() =>
  import("./components/seo/SEOPlatformFeatures").then((m) => ({ default: m.SEOPlatformPage }))
);
const SEOExternalToolsPage = lazy(() =>
  import("./components/seo/SEOPlatformFeatures").then((m) => ({ default: m.SEOExternalToolsPage }))
);
const SitemapPage = lazy(() =>
  import("./components/seo/SitemapPage").then((m) => ({ default: m.SitemapPage }))
);
const PressPage = lazy(() =>
  import("./components/seo/PressPage").then((m) => ({ default: m.PressPage }))
);
const GSCGuide = lazy(() =>
  import("./components/seo/GSCGuide").then((m) => ({ default: m.GSCGuide }))
);

// ═══════════════════════════════════════════════════════════════
// LAZY — App Internal Pages (فرع خاص فقط)
// ═══���═══════════════════════════════════════════════════════════
const NewHomeContent = lazy(() =>
  import("./components/mobile/NewHomeContent").then((m) => ({ default: m.NewHomeContent }))
);
const ServicesContent = lazy(() =>
  import("./components/mobile/ServicesContent").then((m) => ({ default: m.ServicesContent }))
);
const ServiceRouteHandler = lazy(() =>
  import("./components/ServiceRouteHandler").then((m) => ({ default: m.ServiceRouteHandler }))
);
const AboutScreen = lazy(() =>
  import("./components/mobile/AboutTermsScreens").then((m) => ({ default: m.AboutScreen }))
);
const PrivacyPage = lazy(() =>
  import("./components/legal/LegalPages").then((m) => ({ default: m.PrivacyPage }))
);
const TermsPage = lazy(() =>
  import("./components/legal/LegalPages").then((m) => ({ default: m.TermsPage }))
);
const InstallPWAPrompt = lazy(() =>
  lazyRetry(() =>
    import("./components/mobile/InstallPWAPrompt").then((m) => ({ default: m.InstallPWAPrompt }))
  )
);
const AppOnlyPage = lazy(() =>
  import("./components/browser/GuestGuard").then((m) => ({ default: m.AppOnlyPage }))
);
const BrowserLayout = lazy(() =>
  import("./components/layout/BrowserLayout").then((m) => ({ default: m.BrowserLayout }))
);
const ShopScreen = lazy(() =>
  import("./components/mobile/ShopScreen").then((m) => ({ default: m.ShopScreen }))
);
const ToolsScreen = lazy(() =>
  import("./components/mobile/ToolsScreen").then((m) => ({ default: m.ToolsScreen }))
);
const WayakScreen = lazy(() =>
  import("./components/mobile/WayakScreen").then((m) => ({ default: m.WayakScreen }))
);
const DashboardScreen = lazy(() =>
  import("./components/mobile/DashboardScreen").then((m) => ({ default: m.DashboardScreen }))
);
const MapsScreen = lazy(() =>
  import("./components/mobile/MapsScreen").then((m) => ({ default: m.MapsScreen }))
);
const RecommendationsScreen = lazy(() =>
  import("./components/mobile/RecommendationsScreen").then((m) => ({ default: m.RecommendationsScreen }))
);
const OffersScreen = lazy(() =>
  import("./components/mobile/OffersScreen").then((m) => ({ default: m.OffersScreen }))
);
const DesignStudio = lazy(() =>
  import("./components/browser/DesignStudio").then((m) => ({ default: m.DesignStudio }))
);
const ProfileScreen = lazy(() =>
  import("./components/mobile/ProfileScreen").then((m) => ({ default: m.ProfileScreen }))
);
const MarketplaceScreen = lazy(() =>
  import("./components/mobile/MarketplaceScreen").then((m) => ({ default: m.MarketplaceScreen }))
);
const WalletScreen = lazy(() =>
  import("./components/mobile/WalletScreen").then((m) => ({ default: m.WalletScreen }))
);
const NotificationsScreen = lazy(() =>
  import("./components/mobile/NotificationsScreen").then((m) => ({ default: m.NotificationsScreen }))
);
const SubscriptionsScreen = lazy(() =>
  import("./components/mobile/SubscriptionsScreen").then((m) => ({ default: m.SubscriptionsScreen }))
);
const PlatformShowcase = lazy(() =>
  import("./components/mobile/PlatformShowcase").then((m) => ({ default: m.PlatformShowcase }))
);
const ATSDashboard = lazy(() => import("./components/mobile/ATSDashboard"));
const DashboardShowcase = lazy(() =>
  import("./components/mobile/DashboardShowcase").then((m) => ({ default: m.DashboardShowcase }))
);
const AdminPage = lazy(() =>
  import("./components/admin/AdminPage").then((m) => ({ default: m.AdminPage }))
);
const AdminInviteAccept = lazy(() =>
  import("./components/admin/AdminInviteAccept").then((m) => ({ default: m.AdminInviteAccept }))
);
const WorkspaceGuard = lazy(() => import("./components/workspace/WorkspaceGuard"));
const ChatScreen = lazy(() =>
  import("./components/messaging/ChatScreen").then((m) => ({ default: m.ChatScreen }))
);
const MarketplaceProfile = lazy(() =>
  import("./components/marketplace/MarketplaceProfile").then((m) => ({ default: m.MarketplaceProfile }))
);
const ConnectorsScreen = lazy(() =>
  import("./components/mobile/ConnectorsScreen").then((m) => ({ default: m.ConnectorsScreen }))
);
const ConnectorsPage = lazy(() =>
  import("./components/agents/ConnectorsPage").then((m) => ({ default: m.ConnectorsPage }))
);
const OAuthCallback = lazy(() =>
  import("./components/agents/OAuthCallback").then((m) => ({ default: m.OAuthCallback }))
);
const WebPConverter = lazy(() =>
  import("./components/tools/WebPConverter").then((m) => ({ default: m.WebPConverter }))
);
const WayakComputerPage = lazy(() =>
  import("./components/mobile/WayakComputerPage").then((m) => ({ default: m.default }))
);

const OnboardingFlowLazy = lazy(() =>
  import("./components/onboarding/OnboardingFlow").then((m) => ({ default: m.OnboardingFlow }))
);

// ═══════════════════════════════════════════════════════════════
// SEO Service Slugs — صفحات الخدمات العامة
// ═══════════════════════════════════════════════════════════════
const SEO_SERVICE_SLUGS = [
  "contractors-in-uae",
  "interior-design-uae",
  "marble-suppliers-uae",
  "electrical-contractors-uae",
  "villa-renovation-uae",
  "building-materials-uae",
  "maintenance-services-uae",
  "craftsmen-uae",
  "cleaning-services-uae",
  "equipment-rental-uae",
  "furniture-decor-uae",
];

// ═══════════════════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════════════════
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5EEE1]">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D4AF37]" />
        <p className="text-xs text-[#1F3D2B]/40 font-semibold" style={{ fontFamily: "Cairo, sans-serif" }}>
          جاري التحميل...
        </p>
      </div>
    </div>
  );
}

function EffectiveLoadingGate({ children }: { children: React.ReactNode }) {
  const { isReady } = useEffectiveState();
  if (!isReady) return <LoadingSpinner />;
  return <>{children}</>;
}

// ═══════════════════════════════════════════════════════════════
// Wrappers
// ═══════════════════════════════════════════════════════════════
function MapsWithProvider() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GoogleMapsProviderLazy>
        <MapsScreen />
      </GoogleMapsProviderLazy>
    </Suspense>
  );
}

function ProfileWithProvider() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GoogleMapsProviderLazy>
        <ProfileScreen />
      </GoogleMapsProviderLazy>
    </Suspense>
  );
}

function DashboardsGuard() { return <Navigate to="/home" replace />; }

function ProfileIdRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.pathname.split("/").pop();
  useEffect(() => { if (id) navigate(`/app-profile/${id}`, { replace: true }); }, [id, navigate]);
  return null;
}

function WayakScreenWrapper() {
  const nav = useNavigate();
  const location = useLocation();
  let initialTask: string | undefined = (location.state as any)?.initialTask;
  if (!initialTask) {
    try {
      const stored = sessionStorage.getItem("weyaak_initial_task");
      if (stored) {
        const parsed = JSON.parse(stored);
        initialTask = parsed.initialTask;
        sessionStorage.removeItem("weyaak_initial_task");
      }
    } catch { /* silent */ }
  }
  return (
    <WayakScreen
      onClose={() => window.history.back()}
      onOpenComputer={() => nav("/wayak-computer")}
      initialTask={initialTask}
    />
  );
}

function PlatformWrapper() { return <PlatformShowcase onBack={() => window.history.back()} />; }
function AboutWrapper()    { return <AboutScreen onBack={() => window.history.back()} />; }
function ChatScreenWrapper() { return <ChatScreen onBack={() => window.history.back()} />; }

function WayakComputerWrapper() {
  return (
    <Suspense
      fallback={
        <div style={{ position: "fixed", inset: 0, background: "#060C1A", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid rgba(212,175,55,0.15)", borderTopColor: "#D4AF37", animation: "spin 1s linear infinite" }} />
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "Cairo,sans-serif" }}>جاري تحميل بيئتك السحابية...</span>
          </div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      }
    >
      <WayakComputerPage />
    </Suspense>
  );
}

function HomeRedirectWild() { return <Navigate to="/home" replace />; }
function HomeRedirect()     { return <Navigate to="/home" replace />; }

function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const roleParam = params.get('role');
  const initialRole = roleParam === 'provider' ? 'provider' : roleParam === 'client' ? 'client' : undefined;
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OnboardingFlowLazy
        initialRole={initialRole}
        onComplete={() => navigate('/home', { replace: true })}
      />
    </Suspense>
  );
}

// ═══════════════════════════════════════════════════════════════
// ██████████████████████████████████████████████████████████████
// PUBLIC SHELL — فرع SEO المستقل
// صفر auth check — صفر app providers — صفر تداخل مع التطبيق
// ██████████████████████████████████████████████████████████████
// ═══════════════════════════════════════════════════════════════
function PublicShell() {
  // أضف رابط الـ Sitemap و noindex=false لكل الصفحات العامة
  useEffect(() => {
    // Sitemap link tag
    if (!document.querySelector('link[rel="sitemap"]')) {
      const link = document.createElement("link");
      link.rel = "sitemap";
      link.type = "application/xml";
      link.title = "Sitemap";
      link.href = `${window.location.origin}/sitemap.xml`;
      document.head.appendChild(link);
    }
    // Preconnect hints
    const hints = ["https://fonts.googleapis.com", "https://images.unsplash.com"];
    hints.forEach((h) => {
      if (!document.querySelector(`link[rel="preconnect"][href="${h}"]`)) {
        const l = document.createElement("link");
        l.rel = "preconnect";
        l.href = h;
        document.head.appendChild(l);
      }
    });
    // Default robots — تُغيَّر لاحقاً بـ SEOHead لكل صفحة
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
  }, []);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
        <Toaster />
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <InstallPWAPromptLazy />
          </Suspense>
        </ErrorBoundary>
      </ThemeProvider>
    </LanguageProvider>
  );
}

// ═══════════════════════════════════════════════════════════════
// ██████████████████████████████████████████████████████████████
// APP SHELL — فرع التطبيق الداخلي
// يتطلب تسجيل دخول — يحتوي جميع providers — noindex
// ██████████████████████████████████████████████████████████████
// ═══════════════════════════════════════════════════════════════
function AppShell() {
  const [view, setView] = useState<"loading" | "login" | "app">("loading");
  const navigate  = useNavigate();
  const location  = useLocation();

  // noindex — صفحات التطبيق لا تُفهرَس أبداً
  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, nofollow");

    // إزالة canonical لتجنب تضارب مع SEO Head
    document.querySelector('link[rel="canonical"]')?.remove();
  }, [location.pathname]);

  // تحقق من الجلسة مرة واحدة عند التحميل
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      startTransition(() => {
        setView(session ? "app" : "login");
      });
    });
  }, []);

  // استمع لتغييرات المصادقة
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        startTransition(() => setView("app"));
        const path = window.location.pathname;
        if (path === "/" || path === "/login") navigate("/home", { replace: true });
      } else if (event === "SIGNED_OUT") {
        startTransition(() => setView("login"));
      } else if (event === "TOKEN_REFRESHED" && session) {
        startTransition(() => setView("app"));
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLoginComplete = () => {
    startTransition(() => setView("app"));
    navigate("/home", { replace: true });
  };

  // ── Loading ──
  if (view === "loading") {
    return (
      <LanguageProvider>
        <ThemeProvider>
          <LoadingSpinner />
        </ThemeProvider>
      </LanguageProvider>
    );
  }

  // ── Login ──
  if (view === "login") {
    return (
      <LanguageProvider>
        <ThemeProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <LoginAppLazy onComplete={handleLoginComplete} />
          </Suspense>
          <Toaster />
        </ThemeProvider>
      </LanguageProvider>
    );
  }

  // ── Authenticated App ──
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <ZoomProvider>
            <SecurityGuardLazy />
            <SEOHeadLazy
              title="بيت الريف — لوحة التحكم"
              description="منصة بيت الريف الداخلية"
              canonicalPath="/home"
              noIndex={true}
            />
            <WeyaakIdentityProvider>
            <UserProviderLazy>
              <EffectiveStateProviderLazy>
                <PresenceProviderLazy>
                  <WalletProviderLazy>
                    <TaskProviderLazy>
                      <ImageViewerProviderLazy>
                        <WayakCompanionProviderLazy>
                          <EffectiveLoadingGate>
                            <Suspense fallback={<LoadingSpinner />}>
                              <Outlet />
                            </Suspense>
                          </EffectiveLoadingGate>
                          <Toaster />
                          <ErrorBoundary fallback={null}>
                            <Suspense fallback={null}>
                              <InstallPWAPromptLazy />
                            </Suspense>
                          </ErrorBoundary>
                        </WayakCompanionProviderLazy>
                      </ImageViewerProviderLazy>
                    </TaskProviderLazy>
                  </WalletProviderLazy>
                </PresenceProviderLazy>
              </EffectiveStateProviderLazy>
            </UserProviderLazy>
            </WeyaakIdentityProvider>
          </ZoomProvider>
        </Suspense>
      </ThemeProvider>
    </LanguageProvider>
  );
}

// ══════════════════════════════════════════════════════════════
// ROUTER — فصل تام بين الفرعين
// ═══════════════════════════════════════════════════════════════
const appRouter = createBrowserRouter([

  // ╔══════════════════════════════════════════════════════════╗
  // ║  BRANCH 1 — PUBLIC SEO                                   ║
  // ║  جميع الصفحات العامة — محركات البحث تصلها وتفهرسها       ║
  // ╚══════════════════════════════════════════════════════════╝
  {
    Component: PublicShell,
    errorElement: <RouteErrorElement />,
    children: [
      // ── الصفحة الرئيسية العامة ──
      { path: "/",                Component: SEOLandingPage },

      // ── صفحات قانونية ──
      { path: "/privacy",         Component: PrivacyPage },
      { path: "/terms",           Component: TermsPage },
      { path: "/about",           Component: AboutWrapper },

      // ── خريطة العناكب (Sitemap) ──
      { path: "/sitemap",         Component: SitemapPage },

      // ── صفحة الصحافة (Press Kit — لاكتساب الروابط الخلفية) ──
      { path: "/press",           Component: PressPage },

      // ── دليل Google Search Console ──
      { path: "/gsc-guide",       Component: GSCGuide },

      // ── WebP Converter (أداة عامة) ──
      { path: "/webp",            Component: WebPConverter },

      // ── صفحات المزودين والمنتجات (SEO) ──
      { path: "/provider/:slug",  Component: SEOProviderProfile },
      { path: "/product/:slug",   Component: SEOProductPage },

      // ── صفحات الخريطة (SEO) ──
      { path: "/map/:city",               Component: SEOMapPage },
      { path: "/map/:city/:service",      Component: SEOMapPage },

      // ── صفحات الخدمات (SEO Slugs) ──
      ...SEO_SERVICE_SLUGS.map((slug) => ({
        path: `/${slug}`,
        Component: SEOServicePage,
      })),

      // ── صفحات ميزات المنصة (SEO) ──
      { path: "/seo/marketplace", Component: SEOMarketplacePage },
      { path: "/seo/store",       Component: SEOStorePage },
      { path: "/seo/dashboards",  Component: SEODashboardsPage },
      { path: "/seo/platform",    Component: SEOPlatformPage },
      { path: "/seo/tools",       Component: SEOExternalToolsPage },
    ],
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  BRANCH 2 — PRIVATE APP                                  ║
  // ║  التطبيق الداخلي — يتطلب تسجيل دخول — noindex           ║
  // ╚══════════════════════════════════════════════════════════╝
  {
    Component: AppShell,
    errorElement: <RouteErrorElement />,
    children: [
      // ── صفحات كاملة بدون BrowserLayout ──
      { path: "/onboarding",          Component: OnboardingPage },
      { path: "/oauth/callback",      Component: OAuthCallback },
      { path: "/auth/callback",       Component: OAuthCallback },
      { path: "/design",              Component: DesignStudio },
      { path: "/ats",                 Component: ATSDashboard },
      { path: "/admin",               Component: AdminPage },
      { path: "/admin/invite/:code",  Component: AdminInviteAccept },
      { path: "/workspace",           Component: WorkspaceGuard },
      { path: "/wayak-computer",      Component: WayakComputerWrapper },
      // ── صفحات التطبيق داخل BrowserLayout ──
      {
        Component: BrowserLayout,
        children: [
          { path: "/home",               Component: NewHomeContent },
          { path: "/services",           Component: ServicesContent },
          { path: "/services/:id",       Component: ServiceRouteHandler },
          { path: "/services/:id/:city", Component: ServiceRouteHandler },
          { path: "/shop",               Component: ShopScreen },
          { path: "/shop/:slug",         Component: ShopScreen },
          { path: "/store/*",            Component: ShopScreen },
          { path: "/maps",               Component: MapsWithProvider },
          { path: "/marketplace",        Component: MarketplaceScreen },
          { path: "/recommendations",    Component: RecommendationsScreen },
          { path: "/offers",             Component: OffersScreen },
          { path: "/tools",              Component: ToolsScreen },
          { path: "/dashboard",          Component: DashboardScreen },
          { path: "/platform",           Component: PlatformWrapper },
          { path: "/dashboards",         Component: DashboardsGuard },
          { path: "/profile",            Component: ProfileWithProvider },
          { path: "/profile/:id",        Component: ProfileIdRedirect },
          { path: "/app-profile/:id",    Component: MarketplaceProfile },
          { path: "/wallet",             Component: WalletScreen },
          { path: "/notifications",      Component: NotificationsScreen },
          { path: "/subscriptions",      Component: SubscriptionsScreen },
          { path: "/messages",           Component: ChatScreenWrapper },
          { path: "/install-pwa",        Component: InstallPWAPrompt },
          { path: "/projects",           Component: AppOnlyPage },
          { path: "/projects/:id",       Component: AppOnlyPage },
          { path: "/rfq",                Component: AppOnlyPage },
          { path: "/connectors",         Component: ConnectorsScreen },
          { path: "/tools/webp-converter", Component: WebPConverter },
          { path: "/wayak",              Component: WayakScreenWrapper },
          // Fallback — أي رابط غير معروف يذهب للرئيسية
          { index: true,                 Component: HomeRedirect },
          { path: "*",                   Component: HomeRedirectWild },
        ],
      },
    ],
  },
]);

// ═══════════════════════════════════════════════════════════════
// Entry Point
// ═══════════════════════════════════════════════════════════════
export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={appRouter} />
    </ErrorBoundary>
  );
}