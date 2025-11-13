import baseApi from '../api/baseApi';

export const clientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<any[], void>({
      query: () => '/clients',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Client' as const, id })),
              { type: 'Client', id: 'LIST' },
            ]
          : [{ type: 'Client', id: 'LIST' }],
    }),
    getClientById: builder.query<any, string>({
      query: (id) => `/clients/${id}`,
      providesTags: (result, error, id) => (result ? [{ type: 'Client', id }, { type: 'Client', id: 'LIST' }] : [{ type: 'Client', id }]),
    }),
    createClient: builder.mutation<any, any>({
      query: (body) => ({ url: '/clients', method: 'POST', body }),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),
    updateClient: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/clients/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Client', id }, { type: 'Client', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetClientsQuery, useGetClientByIdQuery, useCreateClientMutation, useUpdateClientMutation } = clientsApi;