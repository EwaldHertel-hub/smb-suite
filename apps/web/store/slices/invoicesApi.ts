import baseApi from '../api/baseApi';

export const invoicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query<any[], void>({
      query: () => '/invoices',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Invoice' as const, id })),
              { type: 'Invoice', id: 'LIST' },
            ]
          : [{ type: 'Invoice', id: 'LIST' }],
    }),
    createInvoiceFromQuote: builder.mutation<any, { quoteId: string }>({
      query: (body) => ({ url: '/invoices/from-quote', method: 'POST', body }),
      invalidatesTags: [{ type: 'Invoice', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetInvoicesQuery, useCreateInvoiceFromQuoteMutation } = invoicesApi;