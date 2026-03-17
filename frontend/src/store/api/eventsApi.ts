import { baseApi } from './baseApi';

export const eventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<any, { page?: number; limit?: number; status?: string; search?: string }>({
      query: (params: any) => ({ url: '/events', params }),
      providesTags: ['Event'],
    }),
    getEventById: builder.query<any, string>({
      query: (id: string) => ({ url: `/events/${id}` }),
      providesTags: (result: any, error: any, id: string) => [{ type: 'Event', id }],
    }),
    createEvent: builder.mutation<any, FormData>({
      query: (data: any) => ({
        url: '/events',
        method: 'POST',
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      invalidatesTags: ['Event'],
    }),
    updateEvent: builder.mutation<any, { id: string; data: FormData | any }>({
      query: ({ id, data }: any) => {
        const isFormData = data instanceof FormData;
        return {
          url: `/events/${id}`,
          method: 'PATCH',
          data,
          ...(isFormData && { headers: { 'Content-Type': 'multipart/form-data' } }),
        };
      },
      invalidatesTags: (result: any, error: any, { id }: any) => [{ type: 'Event', id }, 'Event'],
    }),
    deleteEvent: builder.mutation<any, string>({
      query: (id: string) => ({
        url: `/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventsApi;


