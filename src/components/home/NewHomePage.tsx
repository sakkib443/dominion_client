"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import NewProductCard from '@/components/shared/NewProductCard';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice: number;
    discount: number;
    category: string;
    categoryId: number;
    image: string;
    images: string[];
    rating: number;
    reviews: number;
    stock: number;
    brand: string;
    features: string[];
    isNew?: boolean;
    isFeatured?: boolean;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    image?: string;
}

const NewHomePage: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const categoryFromUrl = searchParams.get('category') || '';
    const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [productsError, setProductsError] = useState<string | null>(null);
    
    // Fetch products from local JSON
    useEffect(() => {
        const fetchData = async () => {
            try {
                setProductsLoading(true);
                const response = await fetch('/data/products.json');
                if (!response.ok) throw new Error('Failed to load products');
                const data = await response.json();
                setCategories(data.categories || []);
                setProducts(data.products || []);
                setProductsError(null);
            } catch (error) {
                setProductsError(error instanceof Error ? error.message : 'Failed to load products');
            } finally {
                setProductsLoading(false);
            }
        };
        fetchData();
    }, []);
    
    // Sync with URL params
    useEffect(() => {
        setSelectedCategory(categoryFromUrl);
    }, [categoryFromUrl]);

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        if (categoryId) {
            router.push(`/?category=${categoryId}`);
        } else {
            router.push('/');
        }
    };
    
    // Filter products by selected category
    const filteredProducts = selectedCategory 
        ? products.filter(p => p.categoryId.toString() === selectedCategory)
        : products;

    if (productsLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="w-[95%] mx-auto py-8">
                    {/* Product Grid Skeleton */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-md overflow-hidden animate-pulse">
                                <div className="aspect-square bg-gray-200"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (productsError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-lg">{productsError}</p>
                    <p className="text-gray-500 text-sm mt-2">Please check if the data file exists</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-[95%] mx-auto py-8">
                {/* Selected Category Title */}
                {selectedCategory && (
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {categories.find(c => c.id.toString() === selectedCategory)?.name || 'Category'}
                        </h2>
                        <button 
                            onClick={() => handleCategoryChange('')}
                            className="text-sm text-[#0B4222] hover:underline"
                        >
                            View All Products
                        </button>
                    </div>
                )}

                {/* Product Grid - 5 columns on desktop, responsive on smaller screens */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredProducts.map((product: Product) => (
                        <NewProductCard 
                            key={product.id} 
                            product={{
                                id: product.id.toString(),
                                name: product.name,
                                image: product.image || product.images?.[0] || 'https://via.placeholder.com/300x300/E8957A/E8957A',
                                price: product.price,
                                originalPrice: product.originalPrice,
                                warranty: product.brand ? `${product.brand} Brand` : 'Guarantee/Warranty/others',
                                categoryName: product.category,
                                priceType: 'negotiable'
                            }} 
                        />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products found</p>
                        {selectedCategory && (
                            <button 
                                onClick={() => handleCategoryChange('')}
                                className="mt-4 text-[#0B4222] hover:underline"
                            >
                                View all products
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewHomePage;
