export function getToken() {
  return localStorage.getItem('token');
}

export function isAuthenticated() {
  return !!getToken();
}

export function getUserName() {
  return localStorage.getItem('userName') || 'User';
}

export function getUserEmail() {
  return localStorage.getItem('userEmail') || '';
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
}