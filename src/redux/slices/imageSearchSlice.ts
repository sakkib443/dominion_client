import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ImageSearchState {
    isActive: boolean;
    isSearching: boolean;
    products: any[];
    searchMeta: {
        labels: string[];
        colors: Array<{ hex: string; name: string; percentage: number }>;
        brand: string | null;
        category: string | null;
        totalResults: number;
        matchType: string;
    } | null;
    previewImage: string | null;
}

const initialState: ImageSearchState = {
    isActive: false,
    isSearching: false,
    products: [],
    searchMeta: null,
    previewImage: null,
};

const imageSearchSlice = createSlice({
    name: 'imageSearch',
    initialState,
    reducers: {
        setImageSearching: (state, action: PayloadAction<boolean>) => {
            state.isSearching = action.payload;
        },
        setImageSearchResults: (state, action: PayloadAction<{
            products: any[];
            searchMeta: any;
            previewImage: string;
        }>) => {
            state.isActive = true;
            state.isSearching = false;
            state.products = action.payload.products;
            state.searchMeta = action.payload.searchMeta;
            state.previewImage = action.payload.previewImage;
        },
        clearImageSearch: (state) => {
            state.isActive = false;
            state.isSearching = false;
            state.products = [];
            state.searchMeta = null;
            state.previewImage = null;
        },
    },
});

export const { setImageSearching, setImageSearchResults, clearImageSearch } = imageSearchSlice.actions;
export default imageSearchSlice.reducer;
