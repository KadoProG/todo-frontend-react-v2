import { Middleware } from 'openapi-fetch';
import { store } from '@/lib/store';

export const headersMiddleware: Middleware = {
  async onRequest({ request }) {
    const token = store.get('token');
    if (token && !request.headers.has('Authorization')) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },
};
