import { useCallback, useState } from 'react';

import { apiClient } from '@/lib/apiClient';

export const useNotificationMarkAsRead = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const markAsRead = useCallback(async (notificationId: number) => {
    setIsSubmitting(true);
    try {
      await apiClient.PUT('/v1/notifications/{notification}/read', {
        params: { path: { notification: notificationId } },
      });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    markAsRead,
    isSubmitting,
  };
};
