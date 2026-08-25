export function getToken() {
  return localStorage.getItem('token');
}

export function isAuthenticated() {
  return !!getToken();
}

export function getUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getUserPhone() {
  const user = getUser();
  return user?.phone || localStorage.getItem('userPhone') || '';
}

export function getUserEmail() {
  const user = getUser();
  return user?.email || localStorage.getItem('userEmail') || '';
}

export function getUserName() {
  const user = getUser();
  return (
    user?.name ||
    localStorage.getItem('userName') ||
    (getUserPhone() ? `+91 ${getUserPhone()}` : '') ||
    (getUserEmail() ? getUserEmail().split('@')[0] : 'User')
  );
}

export function setAuthSession({ token, user }) {
  if (token) localStorage.setItem('token', token);
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    if (user.name) localStorage.setItem('userName', user.name);
    if (user.email) localStorage.setItem('userEmail', user.email);
    if (user.phone) localStorage.setItem('userPhone', user.phone);
  }
  window.dispatchEvent(new Event('authChange'));
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userPhone');
  window.dispatchEvent(new Event('authChange'));
}
