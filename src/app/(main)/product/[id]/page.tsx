"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiHeart, FiShoppingCart, FiMinus, FiPlus, FiCheckCircle, FiStar, FiPackage, FiTruck, FiShield } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaPinterestP, FaWhatsapp } from 'react-icons/fa';
import { useGetProductByIdQuery } from '@/redux/api/productApi';
import { useAppDispatch } from '@/redux';
import { addToCart } from '@/redux/slices/cartSlice';

export default function ProductDetailsPage() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [selectedImage, setSelectedImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    // ── Fetch from API ─────────────────────────────────────────────
    const { data: productData, isLoading, isError } = useGetProductByIdQuery(id as string, {
        skip: !id,
    });

    const product = productData?.data;

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart({
            id: typeof product._id === 'string' ? parseInt(product._id.slice(-8), 16) : Date.now(),
            name: product.name,
            price: product.price,
            mrp: product.originalPrice || product.price,
            image: product.thumbnail,
            category: product.category?.name || 'General',
        }));
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    // ── Loading ────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="bg-white min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-10 animate-pulse">
                        <div className="w-full lg:w-1/2 aspect-square bg-gray-200 rounded-xl" />
                        <div className="w-full lg:w-1/2 space-y-4">
                            <div className="h-10 bg-gray-200 rounded w-3/4" />
                            <div className="h-6 bg-gray-200 rounded w-1/4" />
                            <div className="h-8 bg-gray-200 rounded w-1/3" />
                            <div className="h-24 bg-gray-200 rounded" />
                            <div className="h-12 bg-gray-200 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Error ──────────────────────────────────────────────────────
    if (isError || !product) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
                    <p className="text-gray-500 mb-6">This product may have been removed or is no longer available.</p>
                    <Link href="/" className="px-8 py-3 bg-[#0B4222] text-white rounded-full font-semibold hover:bg-[#093519] transition-colors">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean);
    const discountedPrice = product.discount > 0
        ? product.price - (product.price * product.discount) / 100
        : product.price;

    const renderStars = (rating: number) => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <FiStar
                    key={star}
                    size={14}
                    className={star <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                />
            ))}
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen overflow-hidden">
            {/* ── Breadcrumb ─────────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                    <Link href="/" className="hover:text-[#0B4222]">🏠 Home</Link>
                    <span>/</span>
                    <Link href="/" className="hover:text-[#0B4222]">Shop</Link>
                    {product.category && (
                        <>
                            <span>/</span>
                            <Link href={`/?category=${product.category._id}`} className="hover:text-[#0B4222]">
                                {product.category.name}
                            </Link>
                        </>
                    )}
                    <span>/</span>
                    <span className="text-[#0B4222] font-medium truncate max-w-[200px] lg:max-w-none">{product.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-8 lg:h-[calc(100vh-140px)]">

                    {/* ── LEFT: Sticky Image Gallery ─────────────────────────────── */}
                    <div className="w-full lg:w-1/2 flex gap-4 lg:h-full lg:sticky lg:top-0 h-[50vh] min-h-[400px]">
                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar pb-2 pr-1 h-full">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-[70px] h-[70px] border-2 rounded-xl overflow-hidden flex-shrink-0 transition-all ${selectedImage === idx ? 'border-[#0B4222] shadow-md' : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main image */}
                        <div className="flex-1 bg-white border border-gray-100 rounded-2xl overflow-hidden relative group shadow-sm h-full w-full flex items-center justify-center p-4">
                            <img
                                src={allImages[selectedImage] || allImages[0]}
                                alt={product.name}
                                className="w-full h-full object-contain max-h-full transition-transform duration-500 hover:scale-[1.03] cursor-zoom-in rounded-xl"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=No+Image'; }}
                            />

                            {/* Discount badge */}
                            {product.discount > 0 && (
                                <div className="absolute top-6 left-6 bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md z-10">
                                    -{product.discount}% OFF
                                </div>
                            )}

                            {/* Stock badge */}
                            {product.stock <= 5 && product.stock > 0 && (
                                <div className="absolute top-6 right-6 bg-amber-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md z-10 animate-pulse">
                                    Only {product.stock} left!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT: Scrollable Product Info ──────────────────────────────── */}
                    <div className="w-full lg:w-1/2 lg:h-full lg:overflow-y-auto pr-2 custom-scrollbar bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">

                        {/* ── 1. Header Information ── */}
                        <div className="mb-6">
                            {/* Category badge */}
                            {product.category && (
                                <Link href={`/?category=${product.category._id}`} className="text-xs font-bold text-[#0B4222] bg-[#EDF2EE] px-3 py-1 rounded-md mb-4 inline-block hover:bg-[#0B4222] hover:text-white transition-colors uppercase tracking-wider">
                                    {product.category.name}
                                </Link>
                            )}

                            {/* Name */}
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>

                            {/* Rating & Stock */}
                            <div className="flex flex-wrap items-center gap-4 text-sm bg-gray-50 px-4 py-2.5 rounded-lg w-max">
                                <div className="flex items-center gap-2">
                                    {renderStars(product.rating)}
                                    <span className="text-gray-900 font-bold">{product.rating?.toFixed(1)}</span>
                                    <span className="text-gray-500 underline decoration-dotted cursor-pointer hover:text-gray-800">({product.reviewCount} Reviews)</span>
                                </div>
                                <span className="text-gray-300">|</span>
                                <span className={`font-bold flex items-center gap-1.5 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {product.stock > 0 ? <><FiCheckCircle size={14} /> In Stock ({product.stock})</> : '✗ Out of Stock'}
                                </span>
                            </div>
                        </div>

                        {/* ── 2. Price ── */}
                        <div className="mb-8">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-black text-[#0B4222]">৳{discountedPrice.toLocaleString()}</span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-xl text-gray-400 font-medium line-through">৳{product.originalPrice.toLocaleString()}</span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-2 font-medium">Price is inclusive of all taxes.</p>
                        </div>

                        {/* ── 3. Short Description & Attributes ── */}
                        <div className="mb-8">
                            {product.shortDescription && (
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.shortDescription}</p>
                            )}

                            {/* Colors */}
                            {product.colors?.length > 0 && (
                                <div className="mb-5">
                                    <span className="text-sm font-bold text-gray-900 block mb-2">Available Colors:</span>
                                    <div className="inline-flex flex-wrap gap-2">
                                        {product.colors.map((color: string, idx: number) => (
                                            <button key={idx} className="px-4 py-1.5 text-xs font-medium border-2 border-gray-200 rounded-md bg-white text-gray-700 capitalize hover:border-gray-400 transition-colors focus:ring-2 focus:ring-[#0B4222]">
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            {product.tags?.length > 0 && (
                                <div>
                                    <span className="text-sm font-bold text-gray-900 block mb-2">Tags:</span>
                                    <div className="inline-flex flex-wrap gap-1.5">
                                        {product.tags.slice(0, 6).map((tag: string, idx: number) => (
                                            <span key={idx} className="px-2.5 py-1 text-xs bg-gray-100 text-gray-600 font-medium rounded-md">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── 4. Action Buttons ── */}
                        <div className="bg-gray-50 p-5 rounded-2xl mb-8 border border-gray-100">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex items-center justify-between border border-gray-300 bg-white rounded-full px-2 py-1 flex-shrink-0 w-full sm:w-auto">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full transition-colors font-bold"
                                    >
                                        <FiMinus size={16} />
                                    </button>
                                    <span className="w-12 text-center font-bold text-gray-900 text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        disabled={quantity >= product.stock}
                                        className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-40 font-bold"
                                    >
                                        <FiPlus size={16} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className={`flex-1 h-12 rounded-full flex items-center justify-center gap-2 font-bold transition-all shadow-md w-full sm:w-auto text-sm tracking-wide ${addedToCart
                                        ? 'bg-green-500 text-white'
                                        : product.stock === 0
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-[#0B4222] text-white hover:bg-[#093519] border-2 border-[#0B4222] hover:shadow-lg'
                                        }`}
                                >
                                    {addedToCart ? (
                                        <><FiCheckCircle size={18} /> ADDED TO CART!</>
                                    ) : (
                                        <><FiShoppingCart size={18} /> ADD TO CART</>
                                    )}
                                </button>

                                <button
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0 ${isWishlisted ? 'bg-red-50 border-red-400 text-red-500' : 'bg-white border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-400'
                                        }`}
                                    title="Add to wishlist"
                                >
                                    <FiHeart size={20} className={isWishlisted ? 'fill-red-400' : ''} />
                                </button>
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            <div className="flex flex-col items-center gap-1.5 py-4 bg-[#EDF2EE]/50 border border-[#EDF2EE] rounded-xl text-center">
                                <FiTruck className="text-[#0B4222]" size={20} />
                                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">Fast Delivery</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 py-4 bg-[#EDF2EE]/50 border border-[#EDF2EE] rounded-xl text-center">
                                <FiShield className="text-[#0B4222]" size={20} />
                                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">Secure Payment</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 py-4 bg-[#EDF2EE]/50 border border-[#EDF2EE] rounded-xl text-center">
                                <FiPackage className="text-[#0B4222]" size={20} />
                                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">Easy Returns</span>
                            </div>
                        </div>

                        {/* Extracted Details / Tabs placed here directly underneath */}
                        <div className="mt-8 border-t border-gray-100 pt-8">

                            {/* Detailed specific Tab Headers */}
                            <div className="flex gap-4 sm:gap-6 border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
                                {[
                                    { key: 'description', label: 'Details' },
                                    { key: 'specifications', label: 'Specifications' },
                                    { key: 'reviews', label: `Reviews (${product.reviewCount || 0})` },
                                ].map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`pb-3 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === tab.key
                                            ? 'text-[#0B4222] border-b-2 border-[#0B4222]'
                                            : 'text-gray-400 hover:text-gray-700'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Description Tab Content */}
                            {activeTab === 'description' && (
                                <div className="space-y-6 animate-fadeIn">
                                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                                        {product.description || "No detailed description available for this product."}
                                    </p>

                                    {/* Meta info boxes inside Details tab */}
                                    <div className="grid grid-cols-2 gap-4 mt-8">
                                        {product.brand && (
                                            <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Brand</div>
                                                <div className="text-sm font-bold text-gray-800">{product.brand}</div>
                                            </div>
                                        )}
                                        {product.sku && (
                                            <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">SKU</div>
                                                <div className="text-sm font-bold text-gray-800">{product.sku}</div>
                                            </div>
                                        )}
                                        {product.material?.length > 0 && (
                                            <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg col-span-2 sm:col-span-1">
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Material</div>
                                                <div className="text-sm font-bold text-gray-800">{product.material.join(', ')}</div>
                                            </div>
                                        )}
                                        {product.weight > 0 && (
                                            <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg col-span-2 sm:col-span-1">
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Weight</div>
                                                <div className="text-sm font-bold text-gray-800">{product.weight}g</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Specifications Tab Content */}
                            {activeTab === 'specifications' && (
                                <div className="animate-fadeIn">
                                    {product.specifications?.length > 0 ? (
                                        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                            {product.specifications.map((spec: any, idx: number) => (
                                                <div key={idx} className={`flex ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                    <div className="w-1/3 sm:w-2/5 px-4 sm:px-6 py-4 text-xs sm:text-sm font-bold text-gray-700 border-r border-gray-200 bg-gray-50/50">{spec.key}</div>
                                                    <div className="w-2/3 sm:w-3/5 px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600 font-medium">{spec.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
                                            <FiPackage className="mx-auto text-gray-300 mb-2" size={32} />
                                            <p className="text-gray-500 font-medium text-sm">No technical specifications available for this product.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Reviews Tab Content */}
                            {activeTab === 'reviews' && (
                                <div className="animate-fadeIn">
                                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8 bg-[#EDF2EE]/30 border border-[#EDF2EE] rounded-2xl mb-8">
                                        <div className="text-center sm:text-left sm:w-1/3 border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-6">
                                            <div className="text-5xl font-black text-[#0B4222] mb-2">{product.rating?.toFixed(1)}</div>
                                            <div className="flex justify-center sm:justify-start mb-1">{renderStars(product.rating)}</div>
                                            <div className="text-sm font-semibold text-gray-500">Based on {product.reviewCount} Reviews</div>
                                        </div>

                                        <div className="flex-1 w-full space-y-2.5">
                                            {[5, 4, 3, 2, 1].map(star => (
                                                <div key={star} className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1 w-10 text-xs font-bold text-gray-600">
                                                        <span>{star}</span><FiStar size={10} className="fill-gray-400 text-gray-400" />
                                                    </div>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className="bg-[#0B4222] h-full rounded-full transition-all duration-1000"
                                                            style={{ width: star === Math.round(product.rating) ? '70%' : `${star * 10}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="text-center py-12 px-4 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                                        <p className="text-gray-500 font-medium text-sm mb-4">You must complete a purchase to leave a review.</p>
                                        <button disabled className="px-6 py-2.5 bg-gray-200 text-gray-500 rounded-full font-bold text-sm cursor-not-allowed">
                                            Write a Review
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Share Links inside the column */}
                        <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Share Product</span>
                            <div className="flex items-center gap-2">
                                {[
                                    { Icon: FaFacebookF, color: 'hover:bg-blue-600 hover:text-white text-gray-400 bg-gray-100' },
                                    { Icon: FaTwitter, color: 'hover:bg-sky-500 hover:text-white text-gray-400 bg-gray-100' },
                                    { Icon: FaWhatsapp, color: 'hover:bg-green-500 hover:text-white text-gray-400 bg-gray-100' },
                                    { Icon: FaPinterestP, color: 'hover:bg-red-600 hover:text-white text-gray-400 bg-gray-100' },
                                ].map(({ Icon, color }, i) => (
                                    <button key={i} className={`w-9 h-9 rounded-full ${color} flex items-center justify-center transition-all duration-300`}>
                                        <Icon size={14} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Extra padding at bottom for comfortable scrolling */}
                        <div className="h-10"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
