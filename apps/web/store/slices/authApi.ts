import baseApi from '../api/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { accessToken: string; refreshToken?: string; user?: any },
      { email: string; password: string }
    >({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    register: builder.mutation<
      { accessToken: string; refreshToken?: string; user?: any },
      { email: string; password: string; name: string; organizationName?: string }
    >({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation } = authApi;