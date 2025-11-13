import baseApi from '../api/baseApi';

export const quotesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuotes: builder.query<any[], void>({
      query: () => '/quotes',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Quote' as const, id })),
              { type: 'Quote', id: 'LIST' },
            ]
          : [{ type: 'Quote', id: 'LIST' }],
    }),
    createQuote: builder.mutation<any, { clientId: string; items: any[] }>({
      query: (body) => ({ url: '/quotes', method: 'POST', body }),
      invalidatesTags: [{ type: 'Quote', id: 'LIST' }],
    }),
    sendQuote: builder.mutation<any, { id: string; emailTo?: string }>({
      query: ({ id, emailTo }) => ({ url: `/quotes/${id}/send`, method: 'POST', body: emailTo ? { emailTo } : undefined }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetQuotesQuery, useCreateQuoteMutation, useSendQuoteMutation } = quotesApi;