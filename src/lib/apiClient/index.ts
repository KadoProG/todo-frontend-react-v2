import createClient from 'openapi-fetch';

import { originFetch } from '@/lib/apiClient/originFetch';
import { paths } from '@/lib/apiClient/types/schema';

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
  baseUrl: `${import.meta.env.VITE_BACKEND_URL}`,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  fetch: originFetch,
});
