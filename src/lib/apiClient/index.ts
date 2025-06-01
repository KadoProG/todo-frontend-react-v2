import { paths } from '@/lib/apiClient/types/schema';
import createClient from 'openapi-fetch';
import { headersMiddleware } from '@/lib/apiClient/middlewares/headersMiddleware';

export const apiClient = createClient<paths>({
  baseUrl: `${import.meta.env.VITE_BACKEND_URL}`,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
  credentials: 'include',
});

apiClient.use(headersMiddleware);
