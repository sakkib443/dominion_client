import { baseApi } from './baseApi';

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Public: get all products — Backend route: GET /api/products/
        getProducts: builder.query({
            query: (params) => ({
                url: '/products',
                params,
            }),
            providesTags: ['Products'],
        }),
        // Public: get product by id — Backend route: GET /api/products/:id
        getProductById: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [{ type: 'Products', id }],
        }),
        // Public: get featured products — Backend route: GET /api/products/featured
        getFeaturedProducts: builder.query({
            query: () => '/products/featured',
            providesTags: ['Products'],
        }),
        // Public: get product by slug — Backend route: GET /api/products/slug/:slug
        getProductBySlug: builder.query({
            query: (slug) => `/products/slug/${slug}`,
            providesTags: ['Products'],
        }),
        // Public: get related products — Backend route: GET /api/products/:id/related/:categoryId
        getRelatedProducts: builder.query({
            query: ({ id, categoryId }) => `/products/${id}/related/${categoryId}`,
            providesTags: ['Products'],
        }),
        // Admin: get product stats — Backend route: GET /api/products/admin/stats
        getProductStats: builder.query({
            query: () => '/products/admin/stats',
            providesTags: ['Products'],
        }),
        // Admin: create product — Backend route: POST /api/products/
        createProduct: builder.mutation({
            query: (data) => ({
                url: '/products',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Products'],
        }),
        // Admin: update product — Backend route: PATCH /api/products/:id
        updateProduct: builder.mutation({
            query: ({ id, data }) => ({
                url: `/products/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Products', { type: 'Products', id }],
        }),
        // Admin: delete product — Backend route: DELETE /api/products/:id
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'],
        }),
        // Admin: update stock — Backend route: PATCH /api/products/:id/stock
        updateStock: builder.mutation({
            query: ({ id, quantity }) => ({
                url: `/products/${id}/stock`,
                method: 'PATCH',
                body: { quantity },
            }),
            invalidatesTags: (result, error, { id }) => ['Products', { type: 'Products', id }],
        }),
        // Admin: bulk update status — Backend route: PATCH /api/products/admin/bulk-status
        bulkUpdateStatus: builder.mutation({
            query: (data) => ({
                url: '/products/admin/bulk-status',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Products'],
        }),
        // Admin: bulk delete — Backend route: DELETE /api/products/admin/bulk-delete
        bulkDelete: builder.mutation({
            query: (data) => ({
                url: '/products/admin/bulk-delete',
                method: 'DELETE',
                body: data,
            }),
            invalidatesTags: ['Products'],
        }),
        // Image search — Backend route: POST /api/search/image
        imageSearch: builder.mutation({
            query: (data: { labels: string[]; colors: string[]; colorHexes?: string[]; keywords?: string[] }) => ({
                url: '/search/image',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useGetFeaturedProductsQuery,
    useGetProductBySlugQuery,
    useGetRelatedProductsQuery,
    useGetProductStatsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUpdateStockMutation,
    useBulkUpdateStatusMutation,
    useBulkDeleteMutation,
    useImageSearchMutation,
} = productApi;
