/**
 * NotificationsScreen — شاشة الإشعارات الرئيسية
 * ═══════════════════════════════════════════════
 * زر الإغلاق يعمل سواء عبر prop أو عبر navigate(-1)
 */

import { useState } from 'react';
import { X, CheckCheck } from 'lucide-react';
import { MOCK_NOTIFICATIONS, NotificationItem } from '../../data/notifications';
import { NotificationListItem } from './NotificationListItem';
import { useTranslation } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router@7.1.1';
import { Icon3D } from '../ui/Icon3D';
import { Bell, Inbox, Zap } from 'lucide-react';

const f = 'Cairo, sans-serif';

interface NotificationsScreenProps {
  onClose?: () => void;
}

export function NotificationsScreen({ onClose }: NotificationsScreenProps) {
  const { t, dir } = useTranslation('notifications');
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'offers'>('all');

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const handleAction = (notification: NotificationItem) => {
    if (notification.actionTarget) {
      const target = notification.actionTarget;
      switch (target.screen) {
        case 'projects':
          navigate('/projects');
          break;
        case 'maps':
          navigate('/maps');
          break;
        case 'shop':
          navigate('/marketplace');
          break;
        case 'profile':
          navigate('/profile');
          break;
        case 'services':
          navigate(target.id ? `/services/${target.id}` : '/services');
          break;
      }
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'unread') return !notif.isRead;
    if (activeTab === 'offers') return notif.type === 'offer';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const offersCount = notifications.filter(n => n.type === 'offer').length;

  const tabs = [
    { id: 'all' as const, label: t('all'), count: notifications.length, Icon: Bell, theme: 'blue' },
    { id: 'unread' as const, label: t('unread'), count: unreadCount, Icon: Inbox, theme: 'gold' },
    { id: 'offers' as const, label: t('flashOffers'), count: offersCount, Icon: Zap, theme: 'orange' },
  ];

  return (
    <div className="fixed inset-0 bg-[#F5EEE1] z-50 flex flex-col" dir={dir}>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2C1810] via-[#5C3A20] to-[#D4AF37] px-5 pt-6 pb-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white" style={{ fontFamily: f, fontWeight: 800, fontSize: '24px' }}>
            {t('title')}
          </h1>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-3 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white text-xs flex items-center gap-1.5 hover:bg-white/30 transition-colors border-[2px] border-white/10"
                style={{ fontFamily: f, fontWeight: 700 }}
              >
                <CheckCheck className="w-4 h-4" />
                {t('markAllRead')}
              </button>
            )}
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors border-[2px] border-white/10"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all border-[3px] ${
                activeTab === tab.id
                  ? 'bg-white text-[#2C1810] border-white shadow-lg'
                  : 'bg-white/15 text-white/90 border-white/10 hover:bg-white/25'
              }`}
              style={{ fontFamily: f, fontWeight: 700 }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-[#D4AF37] text-white'
                    : 'bg-white/20 text-white'
                }`} style={{ fontFamily: f, fontWeight: 800 }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Icon3D icon={Bell} theme="gold" size="xl" hoverable={false} />
            <p className="text-[#2C1810]/60 mt-4 text-sm" style={{ fontFamily: f, fontWeight: 700 }}>
              {activeTab === 'unread' ? t('noUnread') : t('noNotifications')}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <NotificationListItem
              key={notif.id}
              notification={notif}
              onMarkAsRead={handleMarkAsRead}
              onAction={handleAction}
            />
          ))
        )}
      </div>
    </div>
  );
}
