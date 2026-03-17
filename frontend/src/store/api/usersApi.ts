import { baseApi } from './baseApi';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<any, { page?: number; limit?: number; role?: string; approval_status?: string; search?: string }>({
      query: (params: any) => ({ url: '/users', params }),
      providesTags: ['User'],
    }),
    getUserById: builder.query<any, string>({
      query: (id: string) => ({ url: `/users/${id}` }),
      providesTags: (result: any, error: any, id: string) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }: any) => ({ url: `/users/${id}`, method: 'PATCH', data }),
      invalidatesTags: (result: any, error: any, { id }: any) => [{ type: 'User', id }, 'User'],
    }),
    approveUser: builder.mutation<any, string>({
      query: (id: string) => ({ url: `/users/${id}/approve`, method: 'POST' }),
      invalidatesTags: (result: any, error: any, id: string) => [{ type: 'User', id }, 'User'],
    }),
    rejectUser: builder.mutation<any, { id: string; reason: string }>({
      query: ({ id, reason }: any) => ({ url: `/users/${id}/reject`, method: 'POST', data: { reason } }),
      invalidatesTags: (result: any, error: any, { id }: any) => [{ type: 'User', id }, 'User'],
    }),
    bulkCreateUsers: builder.mutation<any, { users: any[] }>({
      query: (data: any) => ({ url: '/users/bulk', method: 'POST', data }),
      invalidatesTags: ['User'],
    }),
    // Own Profile endpoints
    getMe: builder.query<any, void>({
      query: () => ({ url: '/users/me' }),
      providesTags: ['User'],
    }),
    updateMe: builder.mutation<any, any>({
      query: (data: any) => ({ url: '/users/me', method: 'PATCH', data }),
      invalidatesTags: ['User'],
    }),
    uploadAvatar: builder.mutation<any, FormData>({
      query: (data: any) => ({
        url: '/users/me/avatar',
        method: 'POST',
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useApproveUserMutation,
  useRejectUserMutation,
  useBulkCreateUsersMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useUploadAvatarMutation,
} = usersApi;


