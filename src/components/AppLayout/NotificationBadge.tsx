import React from 'react';
import { Link } from 'react-router-dom';

import { useNotificationUnreadCount } from '@/pages/notifications/hooks/useNotificationUnreadCount';
import { cn } from '@/utils';

export const NotificationBadge: React.FC = () => {
  const { unreadCount } = useNotificationUnreadCount();

  return (
    <Link
      to="/notifications"
      className="relative flex items-center justify-center p-2 transition-opacity hover:opacity-80"
      aria-label={`通知${unreadCount > 0 ? `（未読${unreadCount}件）` : ''}`}
    >
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {unreadCount > 0 && (
        <span
          className={cn(
            'absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white',
            unreadCount > 99 && 'px-1.5'
          )}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
};
