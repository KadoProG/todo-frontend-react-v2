import { paths } from '@/lib/apiClient/types/schema';
import createClient from 'openapi-fetch';

export const apiClient = createClient<
  paths & {
    '/csrf-cookie': {
      get: {
        responses: {
          200: string;
        };
      };
    };
  }
>({
  baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api`,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
  credentials: 'include',
});
