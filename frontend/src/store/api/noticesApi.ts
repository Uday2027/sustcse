import { baseApi } from './baseApi';

export const noticesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotices: builder.query<any, { page?: number; limit?: number; category?: string; search?: string }>({
      query: (params: any) => ({ url: '/notices', params }),
      providesTags: ['Notice'],
    }),
    getNoticeById: builder.query<any, string>({
      query: (id: string) => ({ url: `/notices/${id}` }),
      providesTags: (result: any, error: any, id: string) => [{ type: 'Notice', id }],
    }),
    createNotice: builder.mutation<any, FormData | any>({
      query: (data: any) => {
        const isFormData = data instanceof FormData;
        return {
          url: '/notices',
          method: 'POST',
          data,
          ...(isFormData && { headers: { 'Content-Type': 'multipart/form-data' } }),
        };
      },
      invalidatesTags: ['Notice'],
    }),
    updateNotice: builder.mutation<any, { id: string; data: FormData | any }>({
      query: ({ id, data }: any) => {
        const isFormData = data instanceof FormData;
        return {
          url: `/notices/${id}`,
          method: 'PATCH',
          data,
          ...(isFormData && { headers: { 'Content-Type': 'multipart/form-data' } }),
        };
      },
      invalidatesTags: (result: any, error: any, { id }: any) => [{ type: 'Notice', id }, 'Notice'],
    }),
    deleteNotice: builder.mutation<any, string>({
      query: (id: string) => ({
        url: `/notices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notice'],
    }),
  }),
});

export const {
  useGetNoticesQuery,
  useGetNoticeByIdQuery,
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
} = noticesApi;


