import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, setCredentials } from './authSlice';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1'
    ? 'https://api.unisole.org'
    : 'http://localhost:3000')
).replace(/\/+$/, '');

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any)?.auth?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Order', 'College', 'Branch'],
  endpoints: (builder) => ({
    checkUser: builder.mutation({
      query: (body) => ({
        url: '/api/auth/check-user',
        method: 'POST',
        body,
      }),
    }),
    sendOtp: builder.mutation({
      query: (body) => ({
        url: '/api/auth/send-otp',
        method: 'POST',
        body,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (body) => ({
        url: '/api/auth/verify-otp',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ token: data.token || data.accessToken, user: data.user }));
        } catch {
          // handled by the caller
        }
      },
      invalidatesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: '/api/auth/profile',
        method: 'PUT',
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ token: data.token || data.accessToken, user: data.user }));
        } catch {
          // handled by the caller
        }
      },
      invalidatesTags: ['User'],
    }),
    getMe: builder.query({
      query: () => '/api/auth/me',
      providesTags: ['User'],
    }),
    getOrders: builder.query({
      query: () => '/api/orders',
      providesTags: ['Order'],
    }),
    getPublicColleges: builder.query<any[], void>({
      query: () => '/api/public/colleges',
      providesTags: ['College'],
    }),
    getPublicBranches: builder.query<any[], string | void>({
      query: (collegeId) =>
        collegeId ? `/api/public/branches?collegeId=${collegeId}` : '/api/public/branches',
      providesTags: ['Branch'],
    }),
  }),
});

export const {
  useCheckUserMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useUpdateProfileMutation,
  useGetMeQuery,
  useGetOrdersQuery,
  useGetPublicCollegesQuery,
  useGetPublicBranchesQuery,
} = apiSlice;
