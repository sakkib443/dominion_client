"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NewProductCard from '@/components/shared/NewProductCard';
import { useGetProductsQuery } from '@/redux/api/productApi';

const LIMIT = 20;

const NewHomePage: React.FC = () => {
    const searchParams = useSearchParams();

    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

    useEffect(() => {
        setSelectedCategory(searchParams.get('category') || '');
        setPage(Number(searchParams.get('page')) || 1);
    }, [searchParams]);

    const queryParams: Record<string, string | number | undefined> = {
        limit: LIMIT,
        page,
        sort: '-createdAt',
    };
    if (selectedCategory) queryParams.category = selectedCategory;

    const { data: productsData, isLoading, isFetching } = useGetProductsQuery(queryParams);

    const products = productsData?.data || [];
    const meta = productsData?.meta;
    const totalPages = meta?.totalPages || 1;

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (newPage > 1) params.set('page', String(newPage));
        window.history.pushState({}, '', `/?${params.toString()}`);
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Loading skeleton
    if (isLoading) {
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

                {/* Product Grid */}
                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
                    {products.map((product: any) => (
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

                {/* Empty State */}
                {!isFetching && products.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                        <p className="text-gray-500 mb-6">Try browsing another category</p>
                        <button
                            onClick={() => { window.history.pushState({}, '', '/'); setSelectedCategory(''); setPage(1); }}
                            className="px-8 py-3 bg-[#0B4222] text-white rounded-full font-semibold hover:bg-[#093519] transition-colors"
                        >
                            View All Products
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-10 flex justify-center items-center gap-2">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-[#0B4222] hover:text-white hover:border-[#0B4222] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            ← Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                            .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((p, i) =>
                                p === '...' ? (
                                    <span key={`e-${i}`} className="px-2 text-gray-400">…</span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => handlePageChange(p as number)}
                                        className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${page === p
                                                ? 'bg-[#0B4222] text-white border border-[#0B4222]'
                                                : 'border border-gray-200 text-gray-600 hover:bg-[#0B4222] hover:text-white hover:border-[#0B4222]'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )}

                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-[#0B4222] hover:text-white hover:border-[#0B4222] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewHomePage;
