import { baseApi } from "./baseApi";

export const reviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Admin: get all reviews — Backend route: GET /api/reviews/
        getAllReviews: builder.query({
            query: (params) => ({
                url: '/reviews',
                method: 'GET',
                params
            }),
            providesTags: ['Reviews']
        }),
        // User: create review (auth required) — Backend route: POST /api/reviews/
        createReview: builder.mutation({
            query: (data) => ({
                url: '/reviews',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Reviews']
        }),
        // Public: create comment (no login required) — Backend route: POST /api/reviews/public
        publicCreateReview: builder.mutation({
            query: (data) => ({
                url: '/reviews/public',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Reviews']
        }),
        // User: update review — Backend route: PATCH /api/reviews/:id
        updateReview: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/reviews/${id}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Reviews']
        }),
        // Delete review — Backend route: DELETE /api/reviews/:id
        deleteReview: builder.mutation({
            query: (id) => ({
                url: `/reviews/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Reviews']
        }),
        // Public: get product reviews — Backend route: GET /api/reviews/product/:productId
        getProductReviews: builder.query({
            query: ({ productId, ...params }) => ({
                url: `/reviews/product/${productId}`,
                method: 'GET',
                params
            }),
            providesTags: (result: any, error: any, { productId }: { productId: string }) => [{ type: 'Reviews' as const, id: productId }]
        }),
    })
});

export const {
    useGetAllReviewsQuery,
    useCreateReviewMutation,
    usePublicCreateReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation,
    useGetProductReviewsQuery
} = reviewApi;

