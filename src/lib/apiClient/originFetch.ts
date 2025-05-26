import { store } from '@/lib/store';

export const originFetch: typeof fetch = (input, init) => {
  const request = fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${store.get('token')}`,
    },
  }).then((res) => res.clone());

  return request;
};
