import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../index";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Client", "ClientEmployee", "Quote", "Invoice"],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<
      { accessToken: string; refreshToken?: string; user?: any },
      { email: string; password: string }
    >({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: builder.mutation<
      { accessToken: string; refreshToken?: string; user?: any },
      {
        email: string;
        password: string;
        name: string;
        organizationName?: string;
      }
    >({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    // Clients
    getClients: builder.query<any[], void>({
      query: () => "/clients",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Client" as const, id })),
              { type: "Client", id: "LIST" },
            ]
          : [{ type: "Client", id: "LIST" }],
    }),
    getClientById: builder.query<any, string>({
      query: (id) => `/clients/${id}`,
      providesTags: (result, error, id) =>
        result
          ? [
              { type: "Client", id },
              { type: "Client", id: "LIST" },
            ]
          : [{ type: "Client", id }],
    }),
    createClient: builder.mutation<
      any,
      {
        name: string;
        email?: string;
        phone?: string;
        street?: string;
        postalCode?: string;
        city?: string;
        country?: string;
        website?: string;
        employees: {
          firstName: string;
          lastName: string;
          email?: string;
          phone?: string;
          department?: string;
          position?: string;
          isPrimary?: boolean;
        }[];
      }
    >({
      query: (body) => ({
        url: "/clients",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Client", id: "LIST" }],
    }),
    updateClient: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/clients/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Client", id },
        { type: "Client", id: "LIST" },
      ],
    }),
    getClientEmployees: builder.query<any[], string>({
      query: (clientId) => `/clients/${clientId}/employees`,
      providesTags: (result, error, clientId) =>
        result
          ? [
              ...result.map((e: any) => ({
                type: "ClientEmployee" as const,
                id: e.id,
              })),
              { type: "ClientEmployee", id: `LIST-${clientId}` },
            ]
          : [{ type: "ClientEmployee", id: `LIST-${clientId}` }],
    }),

    createClientEmployee: builder.mutation<
      any,
      { clientId: string; data: any }
    >({
      query: ({ clientId, data }) => ({
        url: `/clients/${clientId}/employees`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { clientId }) => [
        { type: "ClientEmployee", id: `LIST-${clientId}` },
      ],
    }),

    updateClientEmployee: builder.mutation<
      any,
      { clientId: string; employeeId: string; data: any }
    >({
      query: ({ clientId, employeeId, data }) => ({
        url: `/clients/${clientId}/employees/${employeeId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { clientId, employeeId }) => [
        { type: "ClientEmployee", id: employeeId },
        { type: "ClientEmployee", id: `LIST-${clientId}` },
      ],
    }),

    deleteClientEmployee: builder.mutation<
      any,
      { clientId: string; employeeId: string }
    >({
      query: ({ clientId, employeeId }) => ({
        url: `/clients/${clientId}/employees/${employeeId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { clientId, employeeId }) => [
        { type: "ClientEmployee", id: employeeId },
        { type: "ClientEmployee", id: `LIST-${clientId}` },
      ],
    }),
    // Quotes
    getQuotes: builder.query<any[], void>({
      query: () => "/quotes",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Quote" as const, id })),
              { type: "Quote", id: "LIST" },
            ]
          : [{ type: "Quote", id: "LIST" }],
    }),
    createQuote: builder.mutation<any, { clientId: string; items: any[] }>({
      query: (body) => ({ url: "/quotes", method: "POST", body }),
      invalidatesTags: [{ type: "Quote", id: "LIST" }],
    }),
    sendQuote: builder.mutation<any, { id: string; emailTo?: string }>({
      query: ({ id, emailTo }) => ({
        url: `/quotes/${id}/send`,
        method: "POST",
        body: emailTo ? { emailTo } : undefined,
      }),
    }),
    // Invoices
    getInvoices: builder.query<any[], void>({
      query: () => "/invoices",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Invoice" as const, id })),
              { type: "Invoice", id: "LIST" },
            ]
          : [{ type: "Invoice", id: "LIST" }],
    }),
    createInvoiceFromQuote: builder.mutation<any, { quoteId: string }>({
      query: (body) => ({ url: "/invoices/from-quote", method: "POST", body }),
      invalidatesTags: [{ type: "Invoice", id: "LIST" }],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetClientsQuery,
  useCreateClientMutation,
  useGetClientByIdQuery,
  useUpdateClientMutation,
  useGetClientEmployeesQuery,
  useCreateClientEmployeeMutation,
  useUpdateClientEmployeeMutation,
  useDeleteClientEmployeeMutation,
  useGetQuotesQuery,
  useCreateQuoteMutation,
  useSendQuoteMutation,
  useGetInvoicesQuery,
  useCreateInvoiceFromQuoteMutation,
} = api;
