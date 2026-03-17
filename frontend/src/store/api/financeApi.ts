import { baseApi } from './baseApi';

export const financeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Fiscal Years
    getFiscalYears: builder.query<any, void>({
      query: () => ({ url: '/finance/fiscal-years' }),
      providesTags: ['Finance'],
    }),
    createFiscalYear: builder.mutation<any, any>({
      query: (data: any) => ({ url: '/finance/fiscal-years', method: 'POST', data }),
      invalidatesTags: ['Finance'],
    }),
    updateFiscalYear: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }: any) => ({ url: `/finance/fiscal-years/${id}`, method: 'PATCH', data }),
      invalidatesTags: ['Finance'],
    }),
    
    // ── Bank Statements
    getBankStatements: builder.query<any, { fiscal_year_id?: string; bank_account_id?: string }>({
      query: (params: any) => ({ url: '/finance/bank-statements', params }),
      providesTags: ['Finance'],
    }),
    createBankStatement: builder.mutation<any, any>({
      query: (data: any) => ({ url: '/finance/bank-statements', method: 'POST', data }),
      invalidatesTags: ['Finance'],
    }),

    // ── Cost Requests
    getCostRequests: builder.query<any, { fiscal_year_id?: string; status?: string }>({
      query: (params: any) => ({ url: '/finance/costs', params }),
      providesTags: ['Finance'],
    }),
    getCostRequestById: builder.query<any, string>({
      query: (id: string) => ({ url: `/finance/costs/${id}` }),
      providesTags: (result: any, error: any, id: string) => [{ type: 'Finance', id }],
    }),
    createCostRequest: builder.mutation<any, any>({
      query: (data: any) => ({ url: '/finance/costs', method: 'POST', data }),
      invalidatesTags: ['Finance'],
    }),
    updateCostRequest: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }: any) => ({ url: `/finance/costs/${id}`, method: 'PATCH', data }),
      invalidatesTags: (result: any, error: any, { id }: any) => [{ type: 'Finance', id }, 'Finance'],
    }),
    deleteCostRequest: builder.mutation<any, string>({
      query: (id: string) => ({ url: `/finance/costs/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Finance'],
    }),

    // ── Cost Request Approvals
    approveL1: builder.mutation<any, string>({
      query: (id: string) => ({ url: `/finance/costs/${id}/approve-l1`, method: 'POST' }),
      invalidatesTags: (result: any, error: any, id: string) => [{ type: 'Finance', id }, 'Finance'],
    }),
    approveL2: builder.mutation<any, string>({
      query: (id: string) => ({ url: `/finance/costs/${id}/approve-l2`, method: 'POST' }),
      invalidatesTags: (result: any, error: any, id: string) => [{ type: 'Finance', id }, 'Finance'],
    }),
    rejectCost: builder.mutation<any, { id: string; reason: string }>({
      query: ({ id, reason }: any) => ({ url: `/finance/costs/${id}/reject`, method: 'POST', data: { rejection_reason: reason } }),
      invalidatesTags: (result: any, error: any, { id }: any) => [{ type: 'Finance', id }, 'Finance'],
    }),
    addCheckNumber: builder.mutation<any, { id: string; check_number: string }>({
      query: ({ id, check_number }: any) => ({ url: `/finance/costs/${id}/add-check`, method: 'POST', data: { check_number } }),
      invalidatesTags: (result: any, error: any, { id }: any) => [{ type: 'Finance', id }, 'Finance'],
    }),

    // ── Approvers
    getApprovers: builder.query<any, void>({
      query: () => ({ url: '/finance/approvers' }),
    }),
  }),
});

export const {
  useGetFiscalYearsQuery,
  useCreateFiscalYearMutation,
  useUpdateFiscalYearMutation,
  useGetBankStatementsQuery,
  useCreateBankStatementMutation,
  useGetCostRequestsQuery,
  useGetCostRequestByIdQuery,
  useCreateCostRequestMutation,
  useUpdateCostRequestMutation,
  useDeleteCostRequestMutation,
  useApproveL1Mutation,
  useApproveL2Mutation,
  useRejectCostMutation,
  useAddCheckNumberMutation,
  useGetApproversQuery,
} = financeApi;


