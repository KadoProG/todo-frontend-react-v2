import { useCallback,useState } from 'react';

import { apiClient } from '@/lib/apiClient';

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
