"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiHeart, FiShoppingCart, FiMinus, FiPlus, FiCheckCircle, FiStar, FiPackage, FiTruck, FiShield } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaPinterestP, FaWhatsapp } from 'react-icons/fa';
import { useGetProductByIdQuery } from '@/redux/api/productApi';
import { useAppDispatch } from '@/redux';
import { addToCart } from '@/redux/slices/cartSlice';
import NewProductCard from '@/components/shared/NewProductCard';

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
        <div className="bg-white min-h-screen">
            {/* ── Breadcrumb ─────────────────────────────────────────── */}
            <div className="container mx-auto px-4 py-4 text-sm text-gray-500 flex items-center gap-2">
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
                <span className="text-[#0B4222] font-medium truncate max-w-[200px]">{product.name}</span>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* ── LEFT: Image Gallery ─────────────────────────────── */}
                    <div className="w-full lg:w-1/2 flex gap-4">
                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex flex-col gap-3">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-20 h-20 border-2 rounded-lg overflow-hidden flex-shrink-0 transition-all ${selectedImage === idx ? 'border-[#0B4222]' : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main image */}
                        <div className="flex-1 border border-gray-100 rounded-xl overflow-hidden bg-gray-50 relative group">
                            <img
                                src={allImages[selectedImage] || allImages[0]}
                                alt={product.name}
                                className="w-full h-full object-cover min-h-[400px] max-h-[550px] group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=No+Image'; }}
                            />

                            {/* Discount badge */}
                            {product.discount > 0 && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                    -{product.discount}% OFF
                                </div>
                            )}

                            {/* Stock badge */}
                            {product.stock <= 5 && product.stock > 0 && (
                                <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                    Only {product.stock} left!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT: Product Info ──────────────────────────────── */}
                    <div className="w-full lg:w-1/2">
                        {/* Category badge */}
                        {product.category && (
                            <Link href={`/?category=${product.category._id}`} className="text-xs font-semibold text-[#0B4222] bg-[#EDF2EE] px-3 py-1 rounded-full mb-3 inline-block hover:bg-[#0B4222] hover:text-white transition-colors">
                                {product.category.name}
                            </Link>
                        )}

                        {/* Name */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-snug">{product.name}</h1>

                        {/* Rating & reviews */}
                        <div className="flex items-center gap-4 mb-5 text-sm">
                            <div className="flex items-center gap-2">
                                {renderStars(product.rating)}
                                <span className="text-gray-700 font-semibold">{product.rating?.toFixed(1)}</span>
                                <span className="text-gray-400">({product.reviewCount} রিভিউ)</span>
                            </div>
                            <span className="text-gray-200">|</span>
                            <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {product.stock > 0 ? `✓ In Stock (${product.stock})` : '✗ Out of Stock'}
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
                            <span className="text-3xl font-bold text-[#0B4222]">৳{discountedPrice.toLocaleString()}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-lg text-gray-400 line-through">৳{product.originalPrice.toLocaleString()}</span>
                            )}
                            {product.discount > 0 && (
                                <span className="bg-red-100 text-red-600 text-sm font-bold px-2.5 py-1 rounded-full">
                                    -{product.discount}%
                                </span>
                            )}
                        </div>

                        {/* Short description */}
                        {product.shortDescription && (
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.shortDescription}</p>
                        )}

                        {/* Colors */}
                        {product.colors?.length > 0 && (
                            <div className="mb-4">
                                <span className="text-sm font-semibold text-gray-700 mr-2">Colors:</span>
                                <div className="inline-flex flex-wrap gap-2">
                                    {product.colors.map((color: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1 text-xs border border-gray-200 rounded-full bg-white text-gray-600 capitalize">{color}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {product.tags?.length > 0 && (
                            <div className="mb-5">
                                <span className="text-sm font-semibold text-gray-700 mr-2">Tags:</span>
                                <div className="inline-flex flex-wrap gap-1.5">
                                    {product.tags.slice(0, 6).map((tag: string, idx: number) => (
                                        <span key={idx} className="px-2.5 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity + Cart */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="flex items-center border-2 border-gray-200 rounded-full px-2 py-1">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <FiMinus size={16} />
                                </button>
                                <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    disabled={quantity >= product.stock}
                                    className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-40"
                                >
                                    <FiPlus size={16} />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`flex-1 h-12 rounded-full flex items-center justify-center gap-2 font-semibold transition-all shadow-md ${addedToCart
                                    ? 'bg-green-500 text-white'
                                    : product.stock === 0
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#0B4222] text-white hover:bg-[#009606]'
                                    }`}
                            >
                                {addedToCart ? (
                                    <><FiCheckCircle size={18} /> Added to Cart!</>
                                ) : (
                                    <><FiShoppingCart size={18} /> Add to Cart</>
                                )}
                            </button>

                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${isWishlisted ? 'bg-red-50 border-red-400 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-400 hover:text-red-400'
                                    }`}
                            >
                                <FiHeart size={20} className={isWishlisted ? 'fill-red-400' : ''} />
                            </button>
                        </div>

                        {/* Meta info */}
                        <div className="border-t border-gray-100 pt-5 space-y-2 text-sm">
                            {product.brand && (
                                <div className="flex gap-2">
                                    <span className="text-gray-500">Brand:</span>
                                    <span className="font-semibold text-gray-800">{product.brand}</span>
                                </div>
                            )}
                            {product.sku && (
                                <div className="flex gap-2">
                                    <span className="text-gray-500">SKU:</span>
                                    <span className="font-semibold text-gray-800">{product.sku}</span>
                                </div>
                            )}
                            {product.gender && (
                                <div className="flex gap-2">
                                    <span className="text-gray-500">Gender:</span>
                                    <span className="font-semibold text-gray-800 capitalize">{product.gender}</span>
                                </div>
                            )}
                        </div>

                        {/* Trust badges */}
                        <div className="mt-6 grid grid-cols-3 gap-3">
                            <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl text-center">
                                <FiTruck className="text-[#0B4222]" size={22} />
                                <span className="text-[11px] font-semibold text-gray-600">Fast Delivery</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl text-center">
                                <FiShield className="text-[#0B4222]" size={22} />
                                <span className="text-[11px] font-semibold text-gray-600">Secure Payment</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl text-center">
                                <FiPackage className="text-[#0B4222]" size={22} />
                                <span className="text-[11px] font-semibold text-gray-600">Return Policy</span>
                            </div>
                        </div>

                        {/* Share */}
                        <div className="mt-5 flex items-center gap-3">
                            <span className="text-sm text-gray-500 font-medium">Share:</span>
                            {[
                                { Icon: FaFacebookF, color: 'bg-blue-600' },
                                { Icon: FaTwitter, color: 'bg-sky-500' },
                                { Icon: FaWhatsapp, color: 'bg-green-500' },
                                { Icon: FaPinterestP, color: 'bg-red-600' },
                            ].map(({ Icon, color }, i) => (
                                <button key={i} className={`w-8 h-8 rounded-full ${color} text-white flex items-center justify-center hover:opacity-80 transition-opacity`}>
                                    <Icon size={13} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── TABS ────────────────────────────────────────────────── */}
                <div className="mt-16 border-t border-gray-100 pt-8">
                    <div className="flex gap-6 border-b border-gray-100 mb-8">
                        {[
                            { key: 'description', label: 'Description' },
                            { key: 'specifications', label: 'Specifications' },
                            { key: 'reviews', label: `Reviews (${product.reviewCount || 0})` },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === tab.key
                                    ? 'text-[#0B4222] border-b-2 border-[#0B4222]'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Description Tab */}
                    {activeTab === 'description' && (
                        <div className="max-w-3xl">
                            <p className="text-gray-600 leading-8 mb-6 text-sm">{product.description}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                                {product.material?.length > 0 && (
                                    <div className="p-4 bg-[#EDF2EE] rounded-xl">
                                        <div className="text-xs font-bold text-gray-500 uppercase mb-1">Material</div>
                                        <div className="text-sm font-semibold text-gray-800">{product.material.join(', ')}</div>
                                    </div>
                                )}
                                {product.pattern && (
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="text-xs font-bold text-gray-500 uppercase mb-1">Pattern</div>
                                        <div className="text-sm font-semibold text-gray-800 capitalize">{product.pattern}</div>
                                    </div>
                                )}
                                {product.weight > 0 && (
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="text-xs font-bold text-gray-500 uppercase mb-1">Weight</div>
                                        <div className="text-sm font-semibold text-gray-800">{product.weight}g</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Specifications Tab */}
                    {activeTab === 'specifications' && (
                        <div className="max-w-2xl">
                            {product.specifications?.length > 0 ? (
                                <div className="border border-gray-100 rounded-xl overflow-hidden">
                                    {product.specifications.map((spec: any, idx: number) => (
                                        <div key={idx} className={`flex ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                            <div className="w-1/3 px-6 py-4 text-sm font-semibold text-gray-700 border-r border-gray-100">{spec.key}</div>
                                            <div className="w-2/3 px-6 py-4 text-sm text-gray-600">{spec.value}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">No specifications available.</p>
                            )}
                        </div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl mb-6">
                                <div className="text-center">
                                    <div className="text-5xl font-black text-[#0B4222]">{product.rating?.toFixed(1)}</div>
                                    <div className="mt-1">{renderStars(product.rating)}</div>
                                    <div className="text-xs text-gray-400 mt-1">{product.reviewCount} Reviews</div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    {[5, 4, 3, 2, 1].map(star => (
                                        <div key={star} className="flex items-center gap-3">
                                            <span className="text-xs text-gray-500 w-3">{star}</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-amber-400 h-full rounded-full"
                                                    style={{ width: star === Math.round(product.rating) ? '70%' : `${star * 10}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm text-center py-6">No reviews yet. Be the first to review this product!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
