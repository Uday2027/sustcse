import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UsePaginatedFetchResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  setPage: (page: number) => void;
  refetch: () => void;
}

export function usePaginatedFetch<T>(
  url: string,
  params?: Record<string, string>,
  limit = 12
): UsePaginatedFetchResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1, limit, total: 0, totalPages: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: String(pagination.page),
        limit: String(limit),
        ...params,
      });
      const { data: res } = await api.get(`${url}?${queryParams}`);
      setData(res.data || []);
      if (res.pagination) {
        setPagination((prev) => ({ ...prev, ...res.pagination }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [url, pagination.page, limit, JSON.stringify(params)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  return { data, loading, error, pagination, setPage, refetch: fetchData };
}
