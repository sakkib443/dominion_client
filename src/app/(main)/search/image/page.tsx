"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/shared/ProductCard';
import { FiImage, FiTag, FiDroplet, FiArrowLeft, FiLoader } from 'react-icons/fi';
import { useGetProductsQuery } from '@/redux/api/productApi';
import { analyzeImage, createImageFromFile, scoreProduct, loadModel, ImageSearchResult } from '@/utils/imageSearch';

function ImageSearchContent() {
    const searchParams = useSearchParams();
    const [searchResult, setSearchResult] = useState<ImageSearchResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [modelLoading, setModelLoading] = useState(true);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [analyzedProducts, setAnalyzedProducts] = useState<any[]>([]);

    const { data: productsData } = useGetProductsQuery({ limit: 100 });
    const allProducts = productsData?.data?.products || productsData?.data || [];

    // Load model on mount
    useEffect(() => {
        loadModel()
            .then(() => setModelLoading(false))
            .catch(() => {
                setModelLoading(false);
                setError('AI model load করতে সমস্যা হয়েছে। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।');
            });
    }, []);

    // Listen for image search events
    useEffect(() => {
        const handleImageSearch = async (e: CustomEvent) => {
            const file = e.detail?.file as File;
            if (!file) return;

            setIsAnalyzing(true);
            setError(null);
            setPreviewImage(URL.createObjectURL(file));

            try {
                const imgElement = await createImageFromFile(file);
                const result = await analyzeImage(imgElement);
                setSearchResult(result);

                // Score and sort products
                if (allProducts.length > 0) {
                    const scored = allProducts
                        .map((product: any) => ({
                            ...product,
                            _searchScore: scoreProduct(product, result),
                        }))
                        .filter((p: any) => p._searchScore > 0)
                        .sort((a: any, b: any) => b._searchScore - a._searchScore);
                    setAnalyzedProducts(scored);
                }
            } catch (err) {
                console.error('Image analysis failed:', err);
                setError('ইমেজ analyze করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
            } finally {
                setIsAnalyzing(false);
            }
        };

        window.addEventListener('imageSearch', handleImageSearch as EventListener);
        return () => window.removeEventListener('imageSearch', handleImageSearch as EventListener);
    }, [allProducts]);

    // Re-score when products load
    useEffect(() => {
        if (searchResult && allProducts.length > 0) {
            const scored = allProducts
                .map((product: any) => ({
                    ...product,
                    _searchScore: scoreProduct(product, searchResult),
                }))
                .filter((p: any) => p._searchScore > 0)
                .sort((a: any, b: any) => b._searchScore - a._searchScore);
            setAnalyzedProducts(scored);
        }
    }, [allProducts, searchResult]);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 py-8">
                <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
                    <div className="flex items-center gap-4 mb-2">
                        <Link href="/" className="text-gray-400 hover:text-[#0B4222] transition-colors">
                            <FiArrowLeft size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Image Search Results</h1>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Link href="/" className="hover:text-[#0B4222] transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-gray-900">Image Search</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Sidebar - Analysis Info */}
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-24 shadow-sm">
                            {/* Uploaded Image Preview */}
                            {previewImage ? (
                                <div className="relative aspect-square bg-gray-100">
                                    <img src={previewImage} alt="Search" className="w-full h-full object-contain" />
                                    {isAnalyzing && (
                                        <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-3">
                                            <div className="w-10 h-10 border-3 border-[#0B4222]/20 border-t-[#0B4222] rounded-full animate-spin"></div>
                                            <p className="text-sm font-medium text-gray-600">Analyzing image...</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="aspect-square bg-gray-50 flex flex-col items-center justify-center gap-3 text-gray-300">
                                    <FiImage size={48} />
                                    <p className="text-sm">No image uploaded</p>
                                </div>
                            )}

                            {/* Analysis Results */}
                            {searchResult && (
                                <div className="p-5 space-y-5">
                                    {/* Detected Category */}
                                    {searchResult.detectedCategory && (
                                        <div>
                                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Detected Category</h3>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B4222]/10 text-[#0B4222] rounded-full text-sm font-semibold">
                                                <FiTag size={12} />
                                                {searchResult.detectedCategory}
                                            </span>
                                        </div>
                                    )}

                                    {/* AI Labels */}
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">AI Detected Labels</h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {searchResult.labels.slice(0, 6).map((label, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                    {label.className.split(',')[0]}
                                                    <span className="text-gray-400 ml-1">{Math.round(label.probability * 100)}%</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Colors */}
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Detected Colors</h3>
                                        <div className="flex items-center gap-2">
                                            {searchResult.dominantColors.map((color, i) => (
                                                <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full text-xs font-medium text-gray-600 border border-gray-100">
                                                    <FiDroplet size={10} />
                                                    {color}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Keywords */}
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Search Keywords</h3>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            {searchResult.searchKeywords.slice(0, 10).join(', ')}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Model Loading State */}
                            {modelLoading && (
                                <div className="p-5 flex items-center gap-3 text-gray-500">
                                    <FiLoader className="animate-spin" size={16} />
                                    <span className="text-sm">AI model loading...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right - Product Results */}
                    <div className="flex-1">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 mb-6 text-sm">
                                {error}
                            </div>
                        )}

                        {isAnalyzing ? (
                            <div className="bg-white rounded-xl border border-gray-100 p-16 text-center shadow-sm">
                                <div className="w-16 h-16 border-4 border-[#0B4222]/20 border-t-[#0B4222] rounded-full animate-spin mx-auto mb-6"></div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Analyzing your image...</h3>
                                <p className="text-sm text-gray-500">AI মডেল আপনার ইমেজ analyze করছে এবং similar products খুঁজছে</p>
                            </div>
                        ) : analyzedProducts.length > 0 ? (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-sm text-gray-500">
                                        <span className="font-bold text-gray-900">{analyzedProducts.length}</span> similar products found
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                    {analyzedProducts.map((product: any, index: number) => (
                                        <div key={product._id || product.id || index} className="relative">
                                            <ProductCard product={product} />
                                            <span className="absolute top-2 left-2 bg-[#0B4222]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                                                {Math.min(Math.round(product._searchScore), 100)}% match
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : searchResult ? (
                            <div className="bg-white rounded-xl border border-gray-100 p-16 text-center shadow-sm">
                                <FiImage className="mx-auto text-gray-300 mb-4" size={48} />
                                <h3 className="text-lg font-bold text-gray-800 mb-2">No matching products found</h3>
                                <p className="text-sm text-gray-500">
                                    AI &quot;{searchResult.labels[0]?.className.split(',')[0]}&quot; detect করেছে কিন্তু matching product পাওয়া যায়নি
                                </p>
                                <Link href="/shop" className="inline-block mt-4 px-6 py-2.5 bg-[#0B4222] text-white rounded-lg text-sm font-semibold hover:bg-[#093519] transition-colors">
                                    Browse All Products
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-100 p-16 text-center shadow-sm">
                                <FiImage className="mx-auto text-gray-300 mb-4" size={48} />
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Upload an image to search</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Header এর search bar এ camera icon এ ক্লিক করে একটা product এর ইমেজ আপলোড করুন
                                </p>
                                <Link href="/" className="inline-block px-6 py-2.5 bg-[#0B4222] text-white rounded-lg text-sm font-semibold hover:bg-[#093519] transition-colors">
                                    Go to Homepage
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ImageSearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#0B4222]/20 border-t-[#0B4222] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 text-sm">Loading...</p>
                </div>
            </div>
        }>
            <ImageSearchContent />
        </Suspense>
    );
}
