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

export function getUserName() {
  const user = getUser();
  return user?.name || localStorage.getItem('userName') || (getUserEmail() ? getUserEmail().split('@')[0] : 'User');
}

export function getUserEmail() {
  const user = getUser();
  return user?.email || localStorage.getItem('userEmail') || '';
}

export function setAuthSession({ token, user }) {
  if (token) localStorage.setItem('token', token);
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    if (user.name) localStorage.setItem('userName', user.name);
    if (user.email) localStorage.setItem('userEmail', user.email);
  }
  window.dispatchEvent(new Event('authChange'));
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  window.dispatchEvent(new Event('authChange'));
}
