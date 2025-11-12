import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Client', 'Quote', 'Invoice'],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<{ accessToken: string; refreshToken?: string; user?: any }, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    // Clients
    getClients: builder.query<any[], void>({
      query: () => '/clients',
      providesTags: (result) => result ? [...result.map(({ id }) => ({ type: 'Client' as const, id })), { type: 'Client', id: 'LIST' }] : [{ type: 'Client', id: 'LIST' }],
    }),
    createClient: builder.mutation<any, Partial<{ name: string; email?: string }>>({
      query: (body) => ({ url: '/clients', method: 'POST', body }),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),
    // Quotes
    getQuotes: builder.query<any[], void>({
      query: () => '/quotes',
      providesTags: (result) => result ? [...result.map(({ id }) => ({ type: 'Quote' as const, id })), { type: 'Quote', id: 'LIST' }] : [{ type: 'Quote', id: 'LIST' }],
    }),
    createQuote: builder.mutation<any, { clientId: string; items: any[] }>({
      query: (body) => ({ url: '/quotes', method: 'POST', body }),
      invalidatesTags: [{ type: 'Quote', id: 'LIST' }],
    }),
    sendQuote: builder.mutation<any, { id: string; emailTo?: string }>({
      query: ({ id, emailTo }) => ({ url: `/quotes/${id}/send`, method: 'POST', body: emailTo ? { emailTo } : undefined }),
    }),
    // Invoices
    getInvoices: builder.query<any[], void>({
      query: () => '/invoices',
      providesTags: (result) => result ? [...result.map(({ id }) => ({ type: 'Invoice' as const, id })), { type: 'Invoice', id: 'LIST' }] : [{ type: 'Invoice', id: 'LIST' }],
    }),
    createInvoiceFromQuote: builder.mutation<any, { quoteId: string }>({
      query: (body) => ({ url: '/invoices/from-quote', method: 'POST', body }),
      invalidatesTags: [{ type: 'Invoice', id: 'LIST' }],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetClientsQuery,
  useCreateClientMutation,
  useGetQuotesQuery,
  useCreateQuoteMutation,
  useSendQuoteMutation,
  useGetInvoicesQuery,
  useCreateInvoiceFromQuoteMutation,
} = api;
