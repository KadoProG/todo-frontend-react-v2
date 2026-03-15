import { useMemo } from 'react';
import useSWR from 'swr';

import { apiClient } from '@/lib/apiClient';
import type { components } from '@/lib/apiClient/types/schema';

type NotificationResource = components['schemas']['NotificationResource'];

export const useNotificationList = (page: number = 0, size: number = 20) => {
  const { isLoading, data, mutate } = useSWR(
    `/v1/notifications?page=${page}&size=${size}`,
    () => apiClient.GET('/v1/notifications', { params: { query: { page, size } } }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const notifications = useMemo<NotificationResource[]>(
    () => data?.data?.notifications ?? [],
    [data]
  );
  const unreadCount = useMemo(() => data?.data?.unread_count ?? 0, [data]);
  const pagination = useMemo(
    () => ({
      page: data?.data?.page ?? 0,
      size: data?.data?.size ?? 20,
      totalPages: data?.data?.total_pages ?? 0,
      totalElements: data?.data?.total_elements ?? 0,
    }),
    [data]
  );

  return {
    isLoading,
    notifications,
    unreadCount,
    pagination,
    mutate,
  };
};
