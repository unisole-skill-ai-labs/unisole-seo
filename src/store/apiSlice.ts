import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, setCredentials } from './authSlice';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined'
    ? window.location.hostname.includes('stg')
      ? 'https://stg.engine.unisole.org'
      : window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
      ? 'https://api.unisole.org'
      : 'http://localhost:3000'
    : 'http://localhost:3000')
).replace(/\/+$/, '');

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as any)?.auth?.token ||
      localStorage.getItem('unisole-seo:token') ||
      localStorage.getItem('token');
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
  tagTypes: ['User', 'Order', 'College', 'Branch', 'IaptRegistration', 'WorkshopRegistration'],
  endpoints: (builder) => ({
    checkUser: builder.mutation({
      query: (body) => ({
        url: '/api/auth/check-user',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: '/api/auth/login',
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
    registerNain: builder.mutation({
      query: (body: { category: string; institution: string; cityState: string }) => ({
        url: '/api/iapt/nain/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['IaptRegistration'],
    }),
    getMyNainRegistration: builder.query<any, void>({
      query: () => '/api/iapt/nain/my-registration',
      providesTags: ['IaptRegistration'],
    }),
    // Workshop & AI Masterclass Campaign Endpoints
    registerWorkshop: builder.mutation({
      query: (body: {
        name: string;
        phone: string;
        email?: string;
        collegeId?: string;
        collegeName?: string;
        branch?: string;
        yearOfStudy?: string;
        referredBy?: string;
        campaignSource?: string;
        utmSource?: string;
        utmMedium?: string;
        utmCampaign?: string;
      }) => ({
        url: '/api/workshop/register',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.token || data.accessToken) {
            dispatch(setCredentials({ token: data.token || data.accessToken, user: data.user }));
          }
        } catch {
          // handled by caller
        }
      },
      invalidatesTags: ['User', 'WorkshopRegistration'],
    }),
    getMyWorkshopRegistration: builder.query<any, { phone?: string } | void>({
      query: (params) => ({
        url: '/api/workshop/my-registration',
        params: params && typeof params === 'object' && 'phone' in params && params.phone ? { phone: params.phone } : undefined,
      }),
      providesTags: ['WorkshopRegistration'],
    }),
    createWorkshopOrder: builder.mutation({
      query: (body: { registrationId?: string; phone?: string }) => ({
        url: '/api/workshop/payment/create-order',
        method: 'POST',
        body,
      }),
    }),
    verifyWorkshopPayment: builder.mutation({
      query: (body: {
        providerOrderId: string;
        providerPaymentId: string;
        providerSignature?: string;
        registrationId?: string;
      }) => ({
        url: '/api/workshop/payment/verify',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['WorkshopRegistration', 'User'],
    }),
    getWorkshopQr: builder.query<{ success: boolean; qrDataUrl: string; targetUrl: string }, string>({
      query: (url) => ({
        url: `/api/public/workshop/qr?url=${encodeURIComponent(url)}`,
      }),
    }),
  }),
});

export const {
  useCheckUserMutation,
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useGetMeQuery,
  useGetOrdersQuery,
  useGetPublicCollegesQuery,
  useGetPublicBranchesQuery,
  useRegisterNainMutation,
  useGetMyNainRegistrationQuery,
  useRegisterWorkshopMutation,
  useGetMyWorkshopRegistrationQuery,
  useCreateWorkshopOrderMutation,
  useVerifyWorkshopPaymentMutation,
  useGetWorkshopQrQuery,
} = apiSlice;
