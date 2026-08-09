import { supabase } from './supabase';

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

export async function logout() {
  await supabase.auth.signOut();
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
}
