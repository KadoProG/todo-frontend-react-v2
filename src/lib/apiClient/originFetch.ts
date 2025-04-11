import { LOCAL_STORAGE_TOKEN_KEY } from '@/const/const';

export const originFetch: typeof fetch = (input, init) => {
  const request = fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)}`,
    },
  }).then((res) => res.clone());

  return request;
};
