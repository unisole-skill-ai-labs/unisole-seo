import { jwtDecode } from 'jwt-decode';

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

export function loginWithGoogle(credential) {
  const user = jwtDecode(credential);
  localStorage.setItem('token', credential);
  localStorage.setItem('userName', user.name || user.given_name || 'Google User');
  localStorage.setItem('userEmail', user.email || '');
  return user;
}