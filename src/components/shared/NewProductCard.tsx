"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAppDispatch } from '@/redux';
import { addToCart } from '@/redux/slices/cartSlice';

interface Product {
    _id?: string;
    id: string | number;
    slug?: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    mrp?: number;
    discount?: number | string;
    rating?: number;
    reviews?: number;
    categoryName?: string;
    warranty?: string;
    priceType?: 'negotiable' | 'fixed';
    sold?: number;
}

interface NewProductCardProps {
    product: Product;
}

const formatCount = (n: number): string => {
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
    return String(n);
};

const NewProductCard: React.FC<NewProductCardProps> = ({ product }) => {
    const dispatch = useAppDispatch();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showQuickView, setShowQuickView] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({
            id: String(product._id || product.id),
            name: product.name,
            price: product.price,
            mrp: product.mrp || product.originalPrice || product.price,
            image: product.image,
            category: product.categoryName || 'General'
        }));
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    const currentPrice = product.price;
    const oldPrice = product.mrp || product.originalPrice;
    const discountPercent = oldPrice ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : 0;
    const priceType = product.priceType || 'negotiable';
    const soldCount = product.sold || Math.floor(Math.random() * 3000) + 500;

    // Stable random engagement stats based on product id
    const stats = useMemo(() => {
        const seed = String(product._id || product.id);
        const hash = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        return {
            likes: (hash * 17) % 3000 + 500,
            comments: (hash * 13) % 2000 + 200,
            shares: (hash * 19) % 4000 + 500,
            rating: product.rating || ((hash % 15) / 10 + 3.5),
        };
    }, [product._id, product.id, product.rating]);

    return (
        <>
            <Link href={`/product/${product.slug || product.id}`}>
                <div className='bg-white border border-gray-300 overflow-hidden hover:shadow-lg transition-all duration-300 group'>


                    {/* Product Image */}
                    <div className='aspect-square bg-gray-100 overflow-hidden relative'>
                        {/* Sold count + Cart icon — overlaid on image */}
                        <div className='absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-1.5 z-10'>
                            <span className='text-gray-600 text-xs font-medium'>Sold {formatCount(soldCount)}</span>
                            <button
                                onClick={handleAddToCart}
                                className='relative text-gray-600 hover:text-[#0B4222] transition-colors p-1 cart-icon-animate'
                                title='Add to Cart'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.09-.817 2.22-1.924l.975-8.317A1.125 1.125 0 0018.053 3H6.066l-.38-1.429A1.125 1.125 0 004.636.75H2.25M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                </svg>
                            </button>
                        </div>
                        <img
                            src={product.image || 'https://via.placeholder.com/300x300/E8957A/E8957A'}
                            alt={product.name}
                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300/E8957A/E8957A';
                            }}
                        />
                    </div>

                    {/* Product Info */}
                    <div className='px-3 pt-2.5 pb-1.5 space-y-0.5 text-center'>
                        {/* Product Name */}
                        <h3 className='text-gray-900 font-semibold text-sm line-clamp-1 group-hover:text-[#0B4222] transition-colors'>
                            {product.name}
                        </h3>

                        {/* Subtitle / Tagline — scrolling orange text */}
                        <div className='overflow-hidden whitespace-nowrap'>
                            <p className='text-[#E4525C] text-[11px] font-medium inline-block animate-marquee-card'>
                                {product.warranty || 'Lower price than others but quality higher'}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {product.warranty || 'Lower price than others but quality higher'}
                            </p>
                        </div>

                        {/* Price Section */}
                        <div className='flex flex-wrap items-center justify-center gap-x-1.5 text-[12px]'>
                            <span className='text-gray-900 font-bold'>Price Tk.{currentPrice}</span>
                            {oldPrice && (
                                <span className='line-through text-gray-400'>Tk.{oldPrice}</span>
                            )}
                            {discountPercent > 0 && (
                                <span className='text-red-500 font-medium'>{discountPercent}% Off</span>
                            )}
                            <span className='text-gray-400 text-[11px]'>
                                ({priceType === 'negotiable' ? 'price negotiable' : 'price fixed'})
                            </span>
                        </div>
                    </div>

                    {/* Bottom Social Stats Bar */}
                    <div className='flex items-center justify-between px-3 py-1.5 border-t border-gray-100 text-gray-400 text-[11px]'>
                        {/* Heart / Like */}
                        <button
                            onClick={handleWishlist}
                            className={`flex items-center gap-1 hover:text-[#E4525C] transition-colors ${isWishlisted ? 'text-[#E4525C]' : ''}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                            <span>{formatCount(stats.likes)}</span>
                        </button>

                        {/* Comments */}
                        <span className='flex items-center gap-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                            </svg>
                            <span>{formatCount(stats.comments)}</span>
                        </span>

                        {/* Shares */}
                        <span className='flex items-center gap-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                            </svg>
                            <span>{formatCount(stats.shares)}</span>
                        </span>

                        {/* Rating */}
                        <span className='flex items-center gap-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5 text-yellow-400">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span>{stats.rating.toFixed(1)}</span>
                        </span>
                    </div>
                </div>
            </Link>

            {/* Quick View Modal */}
            {showQuickView && (
                <div
                    className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'
                    onClick={() => setShowQuickView(false)}
                >
                    <div
                        className='bg-white max-w-3xl w-full max-h-[90vh] overflow-auto animate-fadeIn'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='flex justify-between items-center p-4 border-b'>
                            <h2 className='font-bold text-lg'>Quick View</h2>
                            <button
                                onClick={() => setShowQuickView(false)}
                                className='w-8 h-8 hover:bg-gray-100 flex items-center justify-center'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className='p-4 grid md:grid-cols-2 gap-6'>
                            <div className='aspect-square bg-gray-100 overflow-hidden'>
                                <img
                                    src={product.image || 'https://via.placeholder.com/300x300/E8957A/E8957A'}
                                    alt={product.name}
                                    className='w-full h-full object-cover'
                                />
                            </div>

                            <div className='space-y-4'>
                                <h3 className='text-xl font-bold text-gray-900'>{product.name}</h3>
                                <p className='text-[#0B4222] font-medium'>
                                    {product.warranty || 'Lower price than others but quality higher'}
                                </p>
                                <div className='space-y-2'>
                                    {oldPrice && (
                                        <p className='text-gray-400 line-through'>Tk.{oldPrice}</p>
                                    )}
                                    <p className='text-2xl font-bold text-[#E4525C]'>Tk.{currentPrice}</p>
                                    {discountPercent > 0 && (
                                        <span className='inline-block bg-red-100 text-red-600 px-2 py-1 text-sm font-medium'>
                                            {discountPercent}% Off
                                        </span>
                                    )}
                                </div>
                                <p className='text-gray-500'>
                                    {priceType === 'negotiable' ? 'Price Negotiable' : 'Price Fixed'}
                                </p>
                                <div className='flex gap-3 pt-4'>
                                    <button
                                        onClick={handleAddToCart}
                                        className='flex-1 bg-[#0B4222] text-white py-3 px-6 font-semibold hover:bg-[#093519] transition-colors'
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={handleWishlist}
                                        className={`w-12 h-12 flex items-center justify-center border-2 transition-colors ${isWishlisted
                                                ? 'border-[#E4525C] bg-[#E4525C] text-white'
                                                : 'border-gray-300 hover:border-[#E4525C] hover:text-[#E4525C]'
                                            }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    </button>
                                </div>
                                <Link
                                    href={`/product/${product.slug || product.id}`}
                                    className='block text-center text-[#0B4222] hover:underline font-medium'
                                >
                                    View Full Details →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NewProductCard;
