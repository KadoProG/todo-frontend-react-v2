import { apiClient } from '@/lib/apiClient';
import { useState, useCallback } from 'react';

export const useNotificationMarkAsRead = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const markAsRead = useCallback(async (notificationId: number) => {
    setIsSubmitting(true);
    try {
      await apiClient.PUT('/v1/notifications/{notificationId}/read', {
        params: { path: { notificationId } },
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
