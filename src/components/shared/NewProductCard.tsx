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
                                <img src="/ICON/cart.png" alt="Cart" className="w-5 h-5 opacity-60" />
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
                    <div className='px-3 pt-0.5 pb-0.5 text-center leading-tight'>
                        {/* Product Name */}
                        <h3 className='text-gray-900 pt-2 font-semibold text-sm line-clamp-1 group-hover:text-[#0B4222] transition-colors'>
                            {product.name}
                        </h3>

                        {/* Subtitle / Tagline — scrolling orange text */}
                        <div className='overflow-hidden whitespace-nowrap pb-1'>
                            <p className='text-[#E4525C] text-[10px] font-normal inline-block animate-marquee-card'>
                                <span>{product.warranty || 'Lower price than others but quality higher'}</span>
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <span>{product.warranty || 'Lower price than others but quality higher'}</span>
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <span>{product.warranty || 'Lower price than others but quality higher'}</span>
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            </p>
                        </div>

                        {/* Price Section */}
                        <div className='flex flex-wrap items-center justify-center gap-x-1.5 text-[12px]'>
                            <span className='text-gray-900 font-bold'>Price Tk.{currentPrice}</span>
                            {oldPrice && (
                                <span className='line-through text-gray-400'>Tk.{oldPrice}</span>
                            )}
                            {discountPercent > 0 && (
                                <span className='text-gray-900 font-medium'>{discountPercent}% Off</span>
                            )}
                            <span className='text-gray-400 text-[11px]'>
                                ({priceType === 'negotiable' ? 'price negotiable' : 'price fixed'})
                            </span>
                        </div>
                    </div>

                    {/* Bottom Social Stats Bar */}
                    <div className='flex items-center justify-between px-3 py-1 border-t border-gray-100 text-gray-400 text-[11px]'>
                        {/* Heart / Like */}
                        <button
                            onClick={handleWishlist}
                            className={`flex items-center gap-1 hover:text-[#E4525C] transition-colors ${isWishlisted ? 'text-[#E4525C]' : ''}`}
                        >
                            <img src="/ICON/like.png" alt="Like" className="w-3.5 h-3.5 opacity-50" />
                            <span>{formatCount(stats.likes)}</span>
                        </button>

                        {/* Comments */}
                        <span className='flex items-center gap-1'>
                            <img src="/ICON/comments.png" alt="Comments" className="w-3.5 h-3.5 opacity-50" />
                            <span>{formatCount(stats.comments)}</span>
                        </span>

                        {/* Shares */}
                        <span className='flex items-center gap-1'>
                            <img src="/ICON/share.png" alt="Share" className="w-3.5 h-3.5 opacity-50" />
                            <span>{formatCount(stats.shares)}</span>
                        </span>

                        {/* Views */}
                        <span className='flex items-center gap-1'>
                            <img src="/ICON/views.png" alt="Views" className="w-3.5 h-3.5 opacity-50" />
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
