import baseApi from '../api/baseApi';

export const clientEmployeesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientEmployees: builder.query<any[], string>({
      query: (clientId) => `/clients/${clientId}/employees`,
      providesTags: (result, error, clientId) =>
        result
          ? [
              ...result.map((e: any) => ({ type: 'ClientEmployee' as const, id: e.id })),
              { type: 'ClientEmployee', id: `LIST-${clientId}` },
            ]
          : [{ type: 'ClientEmployee', id: `LIST-${clientId}` }],
    }),
    createClientEmployee: builder.mutation<any, { clientId: string; data: any }>({
      query: ({ clientId, data }) => ({ url: `/clients/${clientId}/employees`, method: 'POST', body: data }),
      invalidatesTags: (result, error, { clientId }) => [{ type: 'ClientEmployee', id: `LIST-${clientId}` }],
    }),
    updateClientEmployee: builder.mutation<any, { clientId: string; employeeId: string; data: any }>({
      query: ({ clientId, employeeId, data }) => ({ url: `/clients/${clientId}/employees/${employeeId}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { clientId, employeeId }) => [
        { type: 'ClientEmployee', id: employeeId },
        { type: 'ClientEmployee', id: `LIST-${clientId}` },
      ],
    }),
    deleteClientEmployee: builder.mutation<any, { clientId: string; employeeId: string }>({
      query: ({ clientId, employeeId }) => ({ url: `/clients/${clientId}/employees/${employeeId}`, method: 'DELETE' }),
      invalidatesTags: (result, error, { clientId, employeeId }) => [
        { type: 'ClientEmployee', id: employeeId },
        { type: 'ClientEmployee', id: `LIST-${clientId}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useGetClientEmployeesQuery, useCreateClientEmployeeMutation, useUpdateClientEmployeeMutation, useDeleteClientEmployeeMutation } = clientEmployeesApi;