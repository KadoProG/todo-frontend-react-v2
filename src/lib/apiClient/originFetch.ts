import { store } from '@/lib/store';

export const originFetch: typeof fetch = (input, init) => {
  // openapi-fetch は Request を組み立ててから fetch(request) を呼ぶため、Content-Type は input 側に載る。
  // FormData のときは boundary 付きの値がブラウザによって設定されており、
  // ここで application/json に上書きするとサーバ側でパースできなくなる
  const contentType = input instanceof Request ? input.headers.get('Content-Type') : null;

  const request = fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': contentType ?? 'application/json',
      Authorization: `Bearer ${store.get('token')}`,
    },
  }).then((res) => res.clone());

  return request;
};
