import { getToken } from './auth';

export const getApiBaseUrl = (): string => {
  return (
    import.meta.env.VITE_API_URL ||
    (typeof window !== 'undefined'
      ? window.location.hostname.includes('stg')
        ? 'https://stg.engine.unisole.org'
        : window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
        ? 'https://api.unisole.org'
        : 'http://localhost:3000'
      : 'http://localhost:3000')
  ).replace(/\/+$/, '');
};

export const getLmsUrl = (): string => {
  return (
    import.meta.env.VITE_LMS_URL ||
    (typeof window !== 'undefined'
      ? window.location.hostname.includes('stg')
        ? 'https://stg.lms.unisole.org'
        : window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
        ? 'https://lms.unisole.org'
        : 'http://localhost:5174'
      : 'http://localhost:5174')
  ).replace(/\/+$/, '');
};

export async function openLmsWithSso(nextPath: string = '/enrolled'): Promise<{
  success: boolean;
  fallbackUrl: string;
  error?: string;
}> {
  const lmsUrl = getLmsUrl();
  const fallbackUrl = `${lmsUrl}/login`;
  const token = getToken();

  if (!token) {
    window.location.assign(fallbackUrl);
    return { success: true, fallbackUrl };
  }

  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/api/auth/sso/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`SSO code request failed (${res.status})`);
    }

    const data = await res.json();
    if (!data?.code) {
      throw new Error('No SSO code returned by server');
    }

    const targetUrl = `${lmsUrl}/sso?code=${encodeURIComponent(data.code)}&next=${encodeURIComponent(nextPath)}`;
    window.location.assign(targetUrl);
    return { success: true, fallbackUrl };
  } catch (err: any) {
    console.error('SSO handoff error:', err);
    return {
      success: false,
      fallbackUrl,
      error: err?.message || 'Could not initiate single sign-on. Redirecting to login...',
    };
  }
}
