// src/app/fe/src/services/axiosClient.js
import axios from 'axios';
import { keycloakInstance } from '../context/AuthContext';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    if (keycloakInstance?.token) {
      try {
        // Tự động refresh nếu token còn dưới 30 giây hiệu lực
        await keycloakInstance.updateToken(30);
        config.headers.Authorization = `Bearer ${keycloakInstance.token}`;
      } catch (error) {
        console.error('Failed to refresh token', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;