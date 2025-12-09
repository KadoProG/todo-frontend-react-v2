import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/common/button/Button';
import { Skeleton } from '@/components/common/feedback/Skeleton';
import { useNotificationList } from '@/pages/notifications/hooks/useNotificationList';
import { useNotificationMarkAsRead } from '@/pages/notifications/hooks/useNotificationMarkAsRead';
import { useNotificationMarkAllAsRead } from '@/pages/notifications/hooks/useNotificationMarkAllAsRead';
import dayjs from 'dayjs';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils';

export const NotificationPage: React.FC = () => {
  const { isLoading, notifications, unreadCount, mutate } = useNotificationList();
  const { markAsRead, isSubmitting: isMarkAsReadSubmitting } = useNotificationMarkAsRead();
  const { markAllAsRead, isSubmitting: isMarkAllAsReadSubmitting } = useNotificationMarkAllAsRead();

  const handleMarkAsRead = useCallback(
    async (notificationId: number) => {
      await markAsRead(notificationId);
      mutate();
    },
    [markAsRead, mutate]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllAsRead();
    mutate();
  }, [markAllAsRead, mutate]);

  const disabled = isMarkAsReadSubmitting || isMarkAllAsReadSubmitting;

  return (
    <AppLayout>
      <div className="flex flex-col gap-2 px-4 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl">通知</h1>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} disabled={disabled}>
              すべて既読にする
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {isLoading && (
            <>
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-[120px]" />
              ))}
            </>
          )}
          {!isLoading && notifications.length === 0 && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">通知はありません</div>
          )}
          {!isLoading &&
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'rounded border p-4',
                  !notification.is_read
                    ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                    : 'border-border bg-white dark:border-border-dark dark:bg-gray-800'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="mb-1 text-lg font-semibold">{notification.title}</h3>
                    {notification.message && (
                      <p className="mb-2 text-gray-600 dark:text-gray-300">
                        {notification.message}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
                      <span>{dayjs(notification.created_at).format('YYYY年MM月DD日 HH:mm')}</span>
                      {notification.related_task_id && (
                        <Link
                          to={`/todo/${notification.related_task_id}`}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          タスクを表示
                        </Link>
                      )}
                    </div>
                  </div>
                  {!notification.is_read && (
                    <Button
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={disabled}
                      className="shrink-0"
                    >
                      既読
                    </Button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </AppLayout>
  );
};
