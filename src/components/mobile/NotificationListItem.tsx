/**
 * NotificationListItem — بطاقة إشعار واحدة مع Icon3D
 */

import { NotificationItem, NotificationType, NOTIFICATION_COLORS, formatNotificationTime } from '../../data/notifications';
import { ChevronLeft, FileText, Gift, Settings, Star, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Icon3D } from '../ui/Icon3D';

const ICON_MAP: Record<NotificationType, { icon: any; theme: string }> = {
  booking: { icon: FileText, theme: 'blue' },
  offer: { icon: Gift, theme: 'orange' },
  system: { icon: Settings, theme: 'brown' },
  review: { icon: Star, theme: 'gold' },
  chat: { icon: MessageCircle, theme: 'cyan' },
};

interface NotificationListItemProps {
  notification: NotificationItem;
  onMarkAsRead?: (id: string) => void;
  onAction?: (notification: NotificationItem) => void;
}

export function NotificationListItem({ notification, onMarkAsRead, onAction }: NotificationListItemProps) {
  const color = NOTIFICATION_COLORS[notification.type];
  const iconData = ICON_MAP[notification.type] || ICON_MAP.booking;

  const handleClick = () => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (notification.actionTarget && onAction) {
      onAction(notification);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-2xl p-4 shadow-sm border-[3px] cursor-pointer transition-all ${
        notification.isRead 
          ? 'border-gray-200/60' 
          : 'border-[#D4AF37]/30 bg-[#D4AF37]/5'
      }`}
      dir="rtl"
    >
      <div className="flex items-start gap-3">
        {/* Icon3D */}
        <Icon3D icon={iconData.icon} theme={iconData.theme} size="sm" hoverable={false} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm text-[#2C1810] flex-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              {notification.title}
            </h3>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full flex-shrink-0 mt-1" />
            )}
          </div>

          <p className="text-xs text-[#2C1810]/70 mb-2 line-clamp-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#2C1810]/40" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              {formatNotificationTime(notification.createdAt)}
            </span>

            {notification.actionLabel && (
              <div className="flex items-center gap-1 text-xs" style={{ color, fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                {notification.actionLabel}
                <ChevronLeft className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
