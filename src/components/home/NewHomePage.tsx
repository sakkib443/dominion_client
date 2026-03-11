"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import NewProductCard from '@/components/shared/NewProductCard';
import { useGetProductsQuery } from '@/redux/api/productApi';
import { useGetCategoriesQuery } from '@/redux/api/categoryApi';
import { useAppSelector, useAppDispatch } from '@/redux';
import { clearImageSearch } from '@/redux/slices/imageSearchSlice';
import { FiX, FiCamera, FiSearch } from 'react-icons/fi';

const LIMIT = 20;

const NewHomePage: React.FC = () => {
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [page, setPage] = useState(1);
    const [accumulatedProducts, setAccumulatedProducts] = useState<any[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Image search state from Redux
    const imageSearch = useAppSelector((state) => state.imageSearch);

    useEffect(() => {
        const cat = searchParams.get('category') || '';
        setSelectedCategory(cat);
        setPage(1);
        setAccumulatedProducts([]);
    }, [searchParams]);

    const queryParams: Record<string, string | number | undefined> = {
        limit: LIMIT,
        page,
        sort: '-createdAt',
    };
    if (selectedCategory) queryParams.category = selectedCategory;

    const { data: productsData, isLoading, isFetching } = useGetProductsQuery(queryParams);
    const { data: categoriesData } = useGetCategoriesQuery({});

    const products = productsData?.data || [];
    const meta = productsData?.meta;
    const totalPages = meta?.totalPages || 1;
    const categories = categoriesData?.data || [];

    // Accumulate products when new data arrives
    useEffect(() => {
        if (products.length > 0 && !isFetching) {
            if (page === 1) {
                setAccumulatedProducts(products);
            } else {
                setAccumulatedProducts(prev => {
                    const existingIds = new Set(prev.map((p: any) => p._id));
                    const newProducts = products.filter((p: any) => !existingIds.has(p._id));
                    return [...prev, ...newProducts];
                });
            }
            setIsLoadingMore(false);
        }
    }, [products, isFetching, page]);

    // ── Handle category change ──────────────────────────────────────
    const handleCategoryChange = (categoryId: string) => {
        const params = new URLSearchParams();
        if (categoryId) params.set('category', categoryId);
        window.history.pushState({}, '', `/?${params.toString()}`);
        setSelectedCategory(categoryId);
        setPage(1);
        setAccumulatedProducts([]);
        dispatch(clearImageSearch());
    };

    // ── Handle load more ────────────────────────────────────────────
    const handleLoadMore = () => {
        if (page < totalPages) {
            setIsLoadingMore(true);
            setPage(prev => prev + 1);
        }
    };

    // ── Determine which products to display ─────────────────────────
    const displayProducts = useMemo(() => {
        if (imageSearch.isActive && imageSearch.products.length > 0) {
            return imageSearch.products;
        }
        return accumulatedProducts;
    }, [imageSearch.isActive, imageSearch.products, accumulatedProducts]);

    // Get the selected category name
    const selectedCategoryName = useMemo(() => {
        if (!selectedCategory) return '';
        const cat = categories.find((c: any) => c._id === selectedCategory);
        return cat?.name || '';
    }, [selectedCategory, categories]);

    // ── Loading skeleton ────────────────────────────────────────────
    if (isLoading && !imageSearch.isActive) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="w-[95%] mx-auto py-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-md overflow-hidden animate-pulse">
                                <div className="aspect-square bg-gray-200" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-[95%] mx-auto py-6">

                {/* ── Image Search Results Banner ── */}
                {imageSearch.isActive && (
                    <div className="mb-6 bg-white border border-gray-200 rounded-xl p-5 shadow-sm animate-fadeIn">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                {imageSearch.previewImage && (
                                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#0B4222]/20 shadow-sm flex-shrink-0">
                                        <img src={imageSearch.previewImage} alt="Search" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FiCamera className="text-[#0B4222]" size={16} />
                                        <h3 className="text-lg font-bold text-gray-800">Image Search Results</h3>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Found <span className="font-bold text-[#0B4222]">{imageSearch.products.length}</span> matching products
                                        {imageSearch.searchMeta?.labels?.length > 0 && (
                                            <span> — detected: <span className="font-medium">{imageSearch.searchMeta.labels.slice(0, 5).join(', ')}</span></span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => dispatch(clearImageSearch())}
                                className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-full text-sm font-semibold transition-colors"
                            >
                                <FiX size={14} />
                                Clear
                            </button>
                        </div>

                        {/* Color chips */}
                        {imageSearch.searchMeta?.colors?.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Colors:</span>
                                {imageSearch.searchMeta.colors.map((color: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                                        <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: color.hex }} />
                                        <span className="text-xs text-gray-600 font-medium capitalize">{color.name}</span>
                                        <span className="text-[10px] text-gray-400">{color.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Image Search Loading State ── */}
                {imageSearch.isSearching && (
                    <div className="mb-6 bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm animate-fadeIn">
                        <div className="w-12 h-12 border-4 border-[#0B4222]/20 border-t-[#0B4222] rounded-full animate-spin mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-800 mb-1">Analyzing your image...</h3>
                        <p className="text-sm text-gray-500">Using AI to identify products and colors</p>
                    </div>
                )}

                {/* ── Selected Category Title ── */}
                {selectedCategory && (
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{selectedCategoryName || 'Category'}</h2>
                            <p className="text-sm text-gray-500 mt-1">Showing all products in this category</p>
                        </div>
                        <button
                            onClick={() => handleCategoryChange('')}
                            className="mt-4 text-[#0B4222] hover:underline"
                        >
                            View all products
                        </button>
                    </div>
                )}

                {/* ── Product Grid ── */}
                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 transition-opacity duration-200 ${(isFetching && page === 1) ? 'opacity-60' : 'opacity-100'}`}>
                    {displayProducts.map((product: any) => (
                        <NewProductCard
                            key={product._id}
                            product={{
                                id: product._id,
                                name: product.name,
                                image: product.thumbnail || product.images?.[0] || '',
                                price: product.price,
                                originalPrice: product.originalPrice || undefined,
                                discount: product.discount,
                                rating: product.rating,
                                reviews: product.reviewCount,
                                warranty: product.brand || 'Warranty Included',
                                categoryName: product.category?.name || '',
                                priceType: 'fixed',
                            }}
                        />
                    ))}
                </div>

                {/* ── Empty State ── */}
                {!isFetching && displayProducts.length === 0 && !imageSearch.isSearching && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                        <p className="text-gray-500 mb-6">Try browsing another category</p>
                        <button
                            onClick={() => handleCategoryChange('')}
                            className="px-8 py-3 bg-[#0B4222] text-white rounded-full font-semibold hover:bg-[#093519] transition-colors"
                        >
                            View All Products
                        </button>
                    </div>
                )}

                {/* ── See More Products Button ── */}
                {!imageSearch.isActive && page < totalPages && displayProducts.length > 0 && (
                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={handleLoadMore}
                            disabled={isLoadingMore || isFetching}
                            className="group relative px-10 py-3.5 bg-[#0B4222] text-white rounded-full font-bold text-sm tracking-wide hover:bg-[#093519] transition-all shadow-md hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                        >
                            {/* Shiny effect on hover */}
                            <div className="absolute top-0 left-0 w-full h-full">
                                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-700 ease-in-out"></div>
                            </div>

                            <span className="relative z-10 flex items-center gap-2">
                                {isLoadingMore || isFetching ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <FiSearch size={16} />
                                        See More Products
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                )}

                {/* ── Loading more skeleton ── */}
                {isLoadingMore && (
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={`skeleton-${i}`} className="bg-white border border-gray-200 rounded-md overflow-hidden animate-pulse">
                                <div className="aspect-square bg-gray-200" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewHomePage;
