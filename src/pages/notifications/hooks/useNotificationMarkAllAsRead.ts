import { apiClient } from '@/lib/apiClient';
import { useState, useCallback } from 'react';

export const useNotificationMarkAllAsRead = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const markAllAsRead = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await apiClient.PUT('/v1/notifications/read-all');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    markAllAsRead,
    isSubmitting,
  };
};
