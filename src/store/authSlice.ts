import { createSlice } from '@reduxjs/toolkit';

const TOKEN_KEY = 'unisole-seo:token';
const USER_KEY = 'unisole-seo:user';

const getInitialUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY) || localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialState = {
  token: localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token') || null,
  user: getInitialUser(),
  isAuthenticated: !!(localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token')),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { token, accessToken, user } = action.payload;
      const effectiveToken = accessToken || token;

      if (effectiveToken) {
        state.token = effectiveToken;
        localStorage.setItem(TOKEN_KEY, effectiveToken);
        localStorage.setItem('token', effectiveToken);
      }
      if (user) {
        state.user = user;
        const serialized = JSON.stringify(user);
        localStorage.setItem(USER_KEY, serialized);
        localStorage.setItem('user', serialized);
      }
      state.isAuthenticated = true;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
