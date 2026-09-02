/**
 * Centralized API Base URL configuration for Unisole SEO & Showcase Platform.
 * Automatically resolves to VITE_API_URL or defaults to production 'https://api.unisole.org' when live.
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined'
    ? window.location.hostname.includes('stg')
      ? 'https://stg.engine.unisole.org'
      : window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
      ? 'https://api.unisole.org'
      : 'http://localhost:3000'
    : 'http://localhost:3000')
).replace(/\/+$/, '');

export const API_ENDPOINTS = {
  auth: {
    verifyOtp: `${API_BASE_URL}/api/auth/verify-otp`,
    google: `${API_BASE_URL}/api/auth/google`,
    me: `${API_BASE_URL}/api/auth/me`,
  },
  query: `${API_BASE_URL}/api/query`,
};
