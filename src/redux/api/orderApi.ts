import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminOrders: builder.query({
            query: (params) => ({
                url: '/orders/admin/all',
                method: 'GET',
                params,
            }),
            providesTags: ['Orders'],
        }),
        getOrderStats: builder.query({
            query: () => ({
                url: '/orders/admin/stats',
                method: 'GET',
            }),
            providesTags: ['Orders'],
        }),
        getAdminOrderById: builder.query({
            query: (id) => ({
                url: `/orders/admin/${id}`,
                method: 'GET',
            }),
            providesTags: ['Orders'],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/orders/admin/${id}/status`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Orders'],
        }),
        updatePaymentStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/orders/admin/${id}/payment`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Orders'],
        }),
        addAdminNote: builder.mutation({
            query: ({ id, note }) => ({
                url: `/orders/admin/${id}/note`,
                method: 'PATCH',
                body: { note },
            }),
            invalidatesTags: ['Orders'],
        }),
        createOrder: builder.mutation({
            query: (data) => ({
                url: '/orders',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Orders'],
        }),
        getMyOrders: builder.query({
            query: (params) => ({
                url: '/orders/my',
                method: 'GET',
                params,
            }),
            providesTags: ['Orders'],
        }),
    }),
});

export const {
    useGetAdminOrdersQuery,
    useGetOrderStatsQuery,
    useGetAdminOrderByIdQuery,
    useUpdateOrderStatusMutation,
    useUpdatePaymentStatusMutation,
    useAddAdminNoteMutation,
    useCreateOrderMutation,
    useGetMyOrdersQuery,
} = orderApi;
