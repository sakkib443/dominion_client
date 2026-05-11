import { baseApi } from './baseApi';

export const uploadApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Upload single image — POST /api/upload/image
        uploadImage: builder.mutation<{ data: { url: string } }, FormData>({
            query: (formData) => ({
                url: '/upload/image',
                method: 'POST',
                body: formData,
                formData: true,
            }),
        }),

        // Upload multiple images — POST /api/upload/images
        uploadImages: builder.mutation<{ data: { urls: string[] } }, FormData>({
            query: (formData) => ({
                url: '/upload/images',
                method: 'POST',
                body: formData,
                formData: true,
            }),
        }),

        // Upload single file (image or PDF) — POST /api/upload/file
        uploadFile: builder.mutation<{ data: { url: string; type: 'image' | 'pdf' } }, FormData>({
            query: (formData) => ({
                url: '/upload/file',
                method: 'POST',
                body: formData,
                formData: true,
            }),
        }),
    }),
});

export const {
    useUploadImageMutation,
    useUploadImagesMutation,
    useUploadFileMutation,
} = uploadApi;
