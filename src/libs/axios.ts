import Axios from 'axios';

const axios = Axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  withXSRFToken: true,
});

export default axios;

/**
 * CSRFトークンを取得する 基本`await csrf()`だけ記述すればOK
 */
export const csrf = () => axios.get('/sanctum/csrf-cookie');
