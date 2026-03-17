import { baseApi } from './baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query<any, string | void>({
      query: (userId) => ({ url: '/admin/permissions', params: { userId } }),
      providesTags: ['Admin'],
    }),
    setPermission: builder.mutation<any, { userId: string; section: string; permissions: any }>({
      query: (data: any) => ({ url: '/admin/permissions', method: 'POST', data }),
      invalidatesTags: ['Admin'],
    }),
    removePermission: builder.mutation<any, { userId: string; section: string }>({
      query: (data: any) => ({ url: '/admin/permissions', method: 'DELETE', data }),
      invalidatesTags: ['Admin'],
    }),
    getSessions: builder.query<any, void>({
      query: () => ({ url: '/admin/sessions' }),
      providesTags: ['Admin'],
    }),
    createSession: builder.mutation<any, any>({
      query: (data: any) => ({ url: '/admin/sessions', method: 'POST', data }),
      invalidatesTags: ['Admin'],
    }),
    updateSession: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }: any) => ({ url: `/admin/sessions/${id}`, method: 'PATCH', data }),
      invalidatesTags: ['Admin'],
    }),
    getEmailLogs: builder.query<any, { page?: number; limit?: number; status?: string }>({
      query: (params: any) => ({ url: '/admin/email-logs', params }),
    }),
    sendEmail: builder.mutation<any, { to: string | string[]; subject: string; template: string; data?: any }>({
      query: (data: any) => ({ url: '/admin/send-email', method: 'POST', data }),
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useSetPermissionMutation,
  useRemovePermissionMutation,
  useGetSessionsQuery,
  useCreateSessionMutation,
  useUpdateSessionMutation,
  useGetEmailLogsQuery,
  useSendEmailMutation,
} = adminApi;


