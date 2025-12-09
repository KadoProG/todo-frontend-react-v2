import { apiClient } from '@/lib/apiClient';
import useSWR from 'swr';

export const useNotificationUnreadCount = () => {
  const { data, mutate } = useSWR(
    '/v1/notifications/unread-count',
    () => apiClient.GET('/v1/notifications/unread-count'),
    {
      revalidateIfStale: false,
      revalidateOnFocus: true, // フォーカス時に再検証して最新の未読数を取得
      revalidateOnReconnect: true,
      refreshInterval: 30000, // 30秒ごとにポーリング
    }
  );

  const unreadCount = data?.data?.unread_count ?? 0;

  return {
    unreadCount,
    mutate,
  };
};
