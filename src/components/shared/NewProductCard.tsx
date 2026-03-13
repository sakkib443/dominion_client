"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppDispatch } from '@/redux';
import { addToCart } from '@/redux/slices/cartSlice';

interface Product {
    id: number | string;
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
}

interface NewProductCardProps {
    product: Product;
}

const NewProductCard: React.FC<NewProductCardProps> = ({ product }) => {
    const dispatch = useAppDispatch();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showQuickView, setShowQuickView] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(addToCart({
            id: typeof product.id === 'string' ? parseInt(product.id) || Date.now() : product.id,
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

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowQuickView(true);
    };

    const currentPrice = product.price;
    const oldPrice = product.mrp || product.originalPrice;
    const discountPercent = oldPrice ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : 0;
    const priceType = product.priceType || 'negotiable';

    return (
        <>
            <Link href={`/product/${product.slug || product.id}`}>
                <div className='bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-lg transition-all duration-300 group'>
                    {/* Product Image */}
                    <div className='aspect-square bg-gray-100 overflow-hidden relative'>
                        <img
                            src={product.image || 'https://via.placeholder.com/300x300/E8957A/E8957A'}
                            alt={product.name}
                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300/E8957A/E8957A';
                            }}
                        />

                        {/* Hover Action Icons - Slide from right */}
                        <div className='absolute top-3 right-0 flex flex-col gap-2 translate-x-full group-hover:translate-x-[-12px] transition-transform duration-300'>
                            {/* Quick View Icon */}
                            <button
                                onClick={handleQuickView}
                                className='w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#0B4222] hover:text-white transition-colors duration-200'
                                title='Quick View'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>

                            {/* Wishlist/Love Icon */}
                            <button
                                onClick={handleWishlist}
                                className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 ${isWishlisted
                                        ? 'bg-[#E4525C] text-white'
                                        : 'bg-white hover:bg-[#E4525C] hover:text-white'
                                    }`}
                                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                            </button>

                            {/* Add to Cart Icon */}
                            <button
                                onClick={handleAddToCart}
                                className='w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#0B4222] hover:text-white transition-colors duration-200'
                                title='Add to Cart'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.09-.817 2.22-1.924l.975-8.317A1.125 1.125 0 0018.053 3H6.066l-.38-1.429A1.125 1.125 0 004.636 .75H2.25M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className='p-4 space-y-2 text-center'>
                        {/* Product Name */}
                        <h3 className='text-gray-900 font-semibold text-base line-clamp-1 group-hover:text-[#0B4222] transition-colors'>
                            {product.name}
                        </h3>

                        {/* Warranty Info */}
                        <p className='text-[#E4525C] text-sm font-medium'>
                            {product.warranty || 'Guarantee/Warranty/others'}
                        </p>

                        {/* Price Section */}
                        <div className='flex flex-wrap items-center justify-center gap-x-2 text-sm'>
                            <span className='text-gray-600'>Price:</span>
                            {oldPrice && (
                                <span className='line-through text-gray-400'>Tk.{oldPrice}</span>
                            )}
                            <span className='font-bold text-gray-900'>Tk.{currentPrice}</span>
                            {discountPercent > 0 && (
                                <span className='text-red-500 font-medium'>{discountPercent}% off</span>
                            )}
                            <span className='text-gray-500'>
                                ({priceType === 'negotiable' ? 'Price Negotiable' : 'Price Fixed'})
                            </span>
                        </div>
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
                        className='bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto animate-fadeIn'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className='flex justify-between items-center p-4 border-b'>
                            <h2 className='font-bold text-lg'>Quick View</h2>
                            <button
                                onClick={() => setShowQuickView(false)}
                                className='w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className='p-4 grid md:grid-cols-2 gap-6'>
                            {/* Product Image */}
                            <div className='aspect-square bg-gray-100 rounded-lg overflow-hidden'>
                                <img
                                    src={product.image || 'https://via.placeholder.com/300x300/E8957A/E8957A'}
                                    alt={product.name}
                                    className='w-full h-full object-cover'
                                />
                            </div>

                            {/* Product Details */}
                            <div className='space-y-4'>
                                <h3 className='text-xl font-bold text-gray-900'>{product.name}</h3>

                                <p className='text-[#E4525C] font-medium'>
                                    {product.warranty || 'Guarantee/Warranty/others'}
                                </p>

                                <div className='space-y-2'>
                                    {oldPrice && (
                                        <p className='text-gray-400 line-through'>Tk.{oldPrice}</p>
                                    )}
                                    <p className='text-2xl font-bold text-[#0B4222]'>Tk.{currentPrice}</p>
                                    {discountPercent > 0 && (
                                        <span className='inline-block bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium'>
                                            {discountPercent}% off
                                        </span>
                                    )}
                                </div>

                                <p className='text-gray-500'>
                                    {priceType === 'negotiable' ? 'Price Negotiable' : 'Price Fixed'}
                                </p>

                                {/* Action Buttons */}
                                <div className='flex gap-3 pt-4'>
                                    <button
                                        onClick={handleAddToCart}
                                        className='flex-1 bg-[#0B4222] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#093519] transition-colors'
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={handleWishlist}
                                        className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 transition-colors ${isWishlisted
                                                ? 'border-[#E4525C] bg-[#E4525C] text-white'
                                                : 'border-gray-300 hover:border-[#E4525C] hover:text-[#E4525C]'
                                            }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* View Full Details Link */}
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
