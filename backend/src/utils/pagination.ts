export interface PaginationParams {
  page: number;
  limit: number;
}

export const getPagination = (page: number = 1, limit: number = 10) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { from, to, page, limit };
};

export const formatPaginatedResponse = <T>(
  data: T[],
  count: number,
  page: number,
  limit: number
) => ({
  data,
  pagination: {
    page,
    limit,
    total: count,
    totalPages: Math.ceil(count / limit),
  },
});
