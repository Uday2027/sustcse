import { baseApi } from './baseApi';

export const importantDataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getImportantData: builder.query<any, { page?: number; limit?: number; category?: string; search?: string }>({
      query: (params: any) => ({ url: '/important-data', params }),
      providesTags: ['ImportantData'],
    }),
    createImportantData: builder.mutation<any, FormData>({
      query: (data: any) => ({
        url: '/important-data',
        method: 'POST',
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      invalidatesTags: ['ImportantData'],
    }),
    updateImportantData: builder.mutation<any, { id: string; data: FormData | any }>({
      query: ({ id, data }: any) => {
        const isFormData = data instanceof FormData;
        return {
          url: `/important-data/${id}`,
          method: 'PATCH',
          data,
          ...(isFormData && { headers: { 'Content-Type': 'multipart/form-data' } }),
        };
      },
      invalidatesTags: ['ImportantData'],
    }),
    deleteImportantData: builder.mutation<any, string>({
      query: (id: string) => ({
        url: `/important-data/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ImportantData'],
    }),
  }),
});

export const {
  useGetImportantDataQuery,
  useCreateImportantDataMutation,
  useUpdateImportantDataMutation,
  useDeleteImportantDataMutation,
} = importantDataApi;


