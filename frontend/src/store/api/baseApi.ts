import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosRequestConfig, AxiosError } from 'axios';
import api from '../../lib/api';

/**
 * Custom base query for RTK Query that uses our existing axios instance.
 * This ensures RTK Query calls use the same interceptors (auth tokens) as the rest of the app.
 */
const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    unknown
  > =>
    async ({ url, method = 'GET', data, params, headers }) => {
      try {
        const result = await api({
          url,
          method,
          data,
          params,
          headers,
        });
        return { data: result.data };
      } catch (axiosError) {
        const err = axiosError as AxiosError;
        return {
          error: {
            status: err.response?.status,
            data: err.response?.data || err.message,
          },
        };
      }
    };

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Event', 'Notice', 'Finance', 'ImportantData', 'User', 'Admin'],
  endpoints: () => ({}),
});
