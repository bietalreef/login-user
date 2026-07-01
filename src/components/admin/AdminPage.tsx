/**
 * AdminPage — Main entry point for the admin dashboard
 * Combines AdminGuard + AdminLayout + Tab-based navigation
 */
import { useState, useEffect } from 'react';
import { AdminGuard } from './AdminGuard';
import { AdminLayout } from './AdminLayout';
import { AdminDashboardPage } from './AdminDashboardPage';
import { AdminUsersTable } from './AdminUsersTable';
import { AdminActivityLog } from './AdminActivityLog';
import { AdminSettings } from './AdminSettings';
import { AdminDeletionRequests } from './AdminDeletionRequests';
import { AdminProviders } from './AdminProviders';
import { AdminAIAssistant } from './AdminAIAssistant';
import { verifyAdmin } from './adminApi';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { Toaster } from '../ui/sonner';

type AdminTab = 'dashboard' | 'users' | 'providers' | 'ai-assistant' | 'activity' | 'deletion-requests' | 'settings';

function AdminContent() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    verifyAdmin().then((res) => {
      if (res.is_admin) {
        setAdminName(res.name || 'Admin');
        setAdminEmail(res.email || '');
      }
    }).catch(() => {});
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboardPage />;
      case 'users':
        return <AdminUsersTable />;
      case 'providers':
        return <AdminProviders />;
      case 'ai-assistant':
        return <AdminAIAssistant />;
      case 'activity':
        return <AdminActivityLog />;
      case 'deletion-requests':
        return <AdminDeletionRequests />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboardPage />;
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      adminName={adminName}
      adminEmail={adminEmail}
    >
      {renderTab()}
    </AdminLayout>
  );
}

export function AdminPage() {
  return (
    <AdminGuard>
      <AdminContent />
    </AdminGuard>
  );
}