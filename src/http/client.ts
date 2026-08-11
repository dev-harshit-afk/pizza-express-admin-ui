import axios from "axios";
import { useAuthStore } from "../store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const refresToken = async () => {
  await axios.post(
    `${import.meta.env.VITE_BACKEND_API_URL}/auth/refresh`,
    {},
    { withCredentials: true },
  );
};

api.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config;

    if (err.response.status === 401 && !originalRequest._isRetry) {
      try {
        originalRequest._isRetry = true;
        const headers = originalRequest.headers;
        await refresToken();
        return api.request({ ...originalRequest, headers });
      } catch (error) {
        console.error(error);
        useAuthStore.getState().logout();
        return Promise.reject();
      }
    }
    return Promise.reject(err);
  },
);
