"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiHeart, FiShoppingCart, FiMinus, FiPlus, FiCheckCircle, FiStar, FiPackage, FiTruck, FiShield, FiX, FiZoomIn, FiCopy, FiShare2, FiDownload, FiThumbsUp, FiChevronRight } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaPinterestP, FaWhatsapp, FaTiktok, FaInstagram } from 'react-icons/fa';
import { useGetProductBySlugQuery, useGetRelatedProductsQuery } from '@/redux/api/productApi';
import { useAppDispatch } from '@/redux';
import { addToCart } from '@/redux/slices/cartSlice';
import NewProductCard from '@/components/shared/NewProductCard';

export default function ProductDetailsPage() {
    const { slug } = useParams();
    const dispatch = useAppDispatch();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedImage, setSelectedImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedWeight, setSelectedWeight] = useState<string>('');

    const { data: productData, isLoading, isError } = useGetProductBySlugQuery(slug as string, { skip: !slug });
    const product = productData?.data;

    // Fetch related products from the same category
    const { data: relatedData } = useGetRelatedProductsQuery(
        { id: product?._id, categoryId: product?.category?._id },
        { skip: !product?._id || !product?.category?._id }
    );
    const relatedProducts = relatedData?.data || [];

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart({
            id: product._id,
            name: product.name,
            price: product.price,
            mrp: product.originalPrice || product.price,
            image: product.thumbnail,
            category: product.category?.name || 'General',
        }));
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    // Loading
    if (isLoading) {
        return (
            <div className="bg-white min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-6 animate-pulse">
                        <div className="w-full lg:w-[55%] aspect-square bg-gray-200 rounded-xl" />
                        <div className="w-full lg:w-[45%] space-y-4">
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

    // Error
    if (isError || !product) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
                    <p className="text-gray-500 mb-6">This product may have been removed or is no longer available.</p>
                    <Link href="/" className="px-8 py-3 bg-[#0B4222] text-white rounded-full font-semibold hover:bg-[#093519] transition-colors">Back to Home</Link>
                </div>
            </div>
        );
    }

    const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean);
    const discountedPrice = product.discount > 0 ? product.price - (product.price * product.discount) / 100 : product.price;

    const renderStars = (rating: number) => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <FiStar key={star} size={14} className={star <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
            ))}
        </div>
    );

    const tabs = [
        { key: 'overview', label: 'Product Info' },
        { key: 'description', label: 'Details' },
        { key: 'specifications', label: 'Specifications' },
        { key: 'reviews', label: `Reviews (${product.reviewCount || 0})` },
    ];

    return (
        <div className="bg-gray-50 min-h-screen overflow-hidden">
            {/* ── Fullscreen Image Modal ── */}
            {isFullscreen && (
                <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4" onClick={() => setIsFullscreen(false)}>
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
                    >
                        <FiX size={22} />
                    </button>

                    {/* Thumbnails on the side in fullscreen */}
                    {allImages.length > 1 && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setSelectedImage(idx); }}
                                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-white shadow-lg scale-110' : 'border-white/20 opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    <img
                        src={allImages[selectedImage] || allImages[0]}
                        alt={product.name}
                        className="max-w-[85vw] max-h-[90vh] object-contain rounded-xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* ── Breadcrumb ── */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                    <Link href="/" className="hover:text-[#0B4222]">🏠 Home</Link>
                    <span>/</span>
                    <Link href="/" className="hover:text-[#0B4222]">Shop</Link>
                    {product.category && (
                        <>
                            <span>/</span>
                            <Link href={`/?category=${product.category._id}`} className="hover:text-[#0B4222]">{product.category.name}</Link>
                        </>
                    )}
                    <span>/</span>
                    <span className="text-[#0B4222] font-medium truncate max-w-[200px] lg:max-w-none">{product.name}</span>
                </div>
            </div>

            {/* ── Product Name + Stats Bar ── */}
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-4 py-3">
                    {/* Product Name */}
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-1">{product.name}</h1>
                    {product.brand && (
                        <p className="text-xs text-[#E4525C] font-semibold mb-3">Guarantee/Warranty/Others</p>
                    )}

                    {/* Stats + Social Row */}
                    <div className="flex items-center justify-between flex-wrap gap-y-2">
                        {/* Left: Stats */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                                <FiShoppingCart size={12} className="text-[#0B4222]" />
                                <span className="font-semibold text-gray-700">{product.soldCount || 0}</span>
                                <span>Sold</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                                <FiStar size={12} className="text-amber-400 fill-amber-400" />
                                <span className="font-semibold text-gray-700">{product.rating?.toFixed(1) || '0.0'}</span>
                                <span>Ratings</span>
                            </div>
                            <button
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${isLiked ? 'bg-red-50 text-red-500' : 'bg-gray-50 hover:bg-[#0B4222]/10 text-gray-500'}`}
                                onClick={() => {
                                    setIsLiked(!isLiked);
                                    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
                                }}
                            >
                                <FiThumbsUp size={12} className={isLiked ? 'text-red-500 fill-red-500' : 'text-[#0B4222]'} />
                                <span className="font-semibold">{likeCount} Like</span>
                            </button>
                            <button
                                className="flex items-center gap-1.5 bg-gray-50 hover:bg-[#0B4222]/10 px-3 py-1.5 rounded-full transition-colors"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    setLinkCopied(true);
                                    setTimeout(() => setLinkCopied(false), 2000);
                                }}
                            >
                                <FiCopy size={12} className="text-[#0B4222]" />
                                <span className="font-semibold">{linkCopied ? 'Copied!' : 'Copy Link'}</span>
                            </button>
                        </div>

                        {/* Right: Social Share Icons */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-normal text-gray-500 mr-1">Share :</span>
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-blue-600 text-gray-500 hover:text-white flex items-center justify-center transition-all duration-300" title="Facebook">
                                <FaFacebookF size={14} />
                            </a>
                            <a href={`https://api.whatsapp.com/send?text=${typeof window !== 'undefined' ? encodeURIComponent(product.name + ' - ' + window.location.href) : ''}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-green-500 text-gray-500 hover:text-white flex items-center justify-center transition-all duration-300" title="WhatsApp">
                                <FaWhatsapp size={15} />
                            </a>
                            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-900 text-gray-500 hover:text-white flex items-center justify-center transition-all duration-300" title="TikTok">
                                <FaTiktok size={14} />
                            </a>
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 text-gray-500 hover:text-white flex items-center justify-center transition-all duration-300" title="Instagram">
                                <FaInstagram size={15} />
                            </a>
                            <a href={`https://twitter.com/intent/tweet?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}&text=${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-900 text-gray-500 hover:text-white flex items-center justify-center transition-all duration-300" title="X">
                                <FaTwitter size={14} />
                            </a>
                            <a href={allImages[0]} download className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#0B4222] text-gray-500 hover:text-white flex items-center justify-center transition-all duration-300" title="Download Image">
                                <FiDownload size={15} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-3">
                <div className="flex flex-col lg:flex-row gap-5 lg:h-[480px]">

                    {/* ═══ LEFT: Image Gallery (Square, Optimized) ═══ */}
                    <div className="w-full lg:w-[50%] flex gap-3 h-[350px] lg:h-full">
                        {/* Thumbnails column */}
                        {allImages.length > 1 && (
                            <div className="flex flex-col gap-2.5 overflow-y-auto no-scrollbar h-full flex-shrink-0">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-[65px] h-[65px] border-2 rounded-lg overflow-hidden flex-shrink-0 transition-all ${selectedImage === idx ? 'border-[#0B4222] shadow-md ring-1 ring-[#0B4222]/30' : 'border-gray-200 hover:border-gray-400'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main image — square, auto-resize, clickable for fullscreen */}
                        <div
                            className="flex-1 bg-white rounded-2xl overflow-hidden relative group shadow-sm h-full cursor-pointer"
                            onClick={() => setIsFullscreen(true)}
                        >
                            <img
                                src={allImages[selectedImage] || allImages[0]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=No+Image'; }}
                            />

                            {/* Zoom indicator */}
                            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <FiZoomIn size={18} />
                            </div>

                            {/* Discount badge */}
                            {product.discount > 0 && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10">
                                    -{product.discount}% OFF
                                </div>
                            )}

                            {/* Low stock badge */}
                            {product.stock <= 5 && product.stock > 0 && (
                                <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10 animate-pulse">
                                    Only {product.stock} left!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ═══ RIGHT: Product Info + Fixed Tabs at Bottom ═══ */}
                    <div className="w-full lg:w-[50%] lg:h-full h-[420px] flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                        {/* ── Scrollable Content Area (above tabs) ── */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5">

                            {/* === Overview Tab Content === */}
                            {activeTab === 'overview' && (
                                <div className="animate-fadeIn">
                                    {/* Category */}
                                    {product.category && (
                                        <Link href={`/?category=${product.category._id}`} className="text-[10px] font-bold text-[#0B4222] bg-[#EDF2EE] px-2.5 py-1 rounded mb-3 inline-block hover:bg-[#0B4222] hover:text-white transition-colors uppercase tracking-wider">
                                            {product.category.name}
                                        </Link>
                                    )}

                                    {/* Rating & Stock */}
                                    <div className="flex flex-wrap items-center gap-3 text-xs bg-gray-50 px-3 py-2 rounded-lg w-max mb-5">
                                        <div className="flex items-center gap-1.5">
                                            {renderStars(product.rating)}
                                            <span className="text-gray-900 font-bold">{product.rating?.toFixed(1)}</span>
                                            <span className="text-gray-500 underline decoration-dotted cursor-pointer hover:text-gray-800" onClick={() => setActiveTab('reviews')}>({product.reviewCount} Reviews)</span>
                                        </div>
                                        <span className="text-gray-300">|</span>
                                        <span className={`font-bold flex items-center gap-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {product.stock > 0 ? <><FiCheckCircle size={12} /> In Stock ({product.stock})</> : '✗ Out of Stock'}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-5">
                                        <div className="flex items-baseline gap-2.5">
                                            <span className="text-3xl font-black text-[#0B4222]">৳{discountedPrice.toLocaleString()}</span>
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <span className="text-lg text-gray-400 font-medium line-through">৳{product.originalPrice.toLocaleString()}</span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-gray-500 mt-1 font-medium">Price is inclusive of all taxes.</p>
                                    </div>

                                    {/* Short description */}
                                    {product.shortDescription && (
                                        <p className="text-gray-600 text-sm leading-relaxed mb-5">{product.shortDescription}</p>
                                    )}

                                    {/* ── Product Variations ── */}
                                    <div className="mb-5 space-y-4">

                                        {/* Color Selector */}
                                        {product.colors?.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-2.5">
                                                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Color</span>
                                                    {selectedColor && (
                                                        <span className="text-xs text-[#0B4222] font-medium capitalize">— {selectedColor}</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.colors.map((color: string, idx: number) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                                                            className={`group relative px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-all duration-200 ${
                                                                selectedColor === color
                                                                    ? 'bg-[#0B4222] text-white border-2 border-[#0B4222] shadow-md'
                                                                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#0B4222]/50 hover:shadow-sm'
                                                            }`}
                                                        >
                                                            <span className="flex items-center gap-1.5">
                                                                <span className={`w-3 h-3 rounded-full border ${
                                                                    selectedColor === color ? 'border-white/50' : 'border-gray-300'
                                                                }`} style={{ backgroundColor: color.toLowerCase() === 'white' ? '#f5f5f5' : color.toLowerCase() }} />
                                                                {color}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Size Selector */}
                                        {product.sizes?.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-2.5">
                                                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Size</span>
                                                    {selectedSize && (
                                                        <span className="text-xs text-[#0B4222] font-medium">— {selectedSize}</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.sizes.map((size: string, idx: number) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                                                            className={`min-w-[44px] h-10 px-3 text-xs font-bold rounded-lg uppercase transition-all duration-200 ${
                                                                selectedSize === size
                                                                    ? 'bg-[#0B4222] text-white border-2 border-[#0B4222] shadow-md'
                                                                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#0B4222]/50 hover:shadow-sm'
                                                            }`}
                                                        >
                                                            {size}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Weight Selector */}
                                        {product.weights?.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-2.5">
                                                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Weight</span>
                                                    {selectedWeight && (
                                                        <span className="text-xs text-[#0B4222] font-medium">— {selectedWeight}</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.weights.map((weight: string, idx: number) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setSelectedWeight(selectedWeight === weight ? '' : weight)}
                                                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                                                                selectedWeight === weight
                                                                    ? 'bg-[#0B4222] text-white border-2 border-[#0B4222] shadow-md'
                                                                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#0B4222]/50 hover:shadow-sm'
                                                            }`}
                                                        >
                                                            {weight}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="bg-gray-50 p-4 rounded-xl mb-5 border border-gray-100">
                                        <div className="flex flex-col sm:flex-row items-center gap-3">
                                            <div className="flex items-center justify-between border border-gray-300 bg-white rounded-full px-1.5 py-0.5 flex-shrink-0 w-full sm:w-auto">
                                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full transition-colors font-bold">
                                                    <FiMinus size={14} />
                                                </button>
                                                <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                                                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock} className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-40 font-bold">
                                                    <FiPlus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={handleAddToCart}
                                                disabled={product.stock === 0}
                                                className={`flex-1 h-11 rounded-full flex items-center justify-center gap-2 font-bold transition-all shadow-md w-full sm:w-auto text-sm tracking-wide ${addedToCart ? 'bg-green-500 text-white' : product.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#0B4222] text-white hover:bg-[#093519] border-2 border-[#0B4222] hover:shadow-lg'}`}
                                            >
                                                {addedToCart ? <><FiCheckCircle size={16} /> ADDED!</> : <><FiShoppingCart size={16} /> ADD TO CART</>}
                                            </button>
                                            <button onClick={() => setIsWishlisted(!isWishlisted)} className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0 ${isWishlisted ? 'bg-red-50 border-red-400 text-red-500' : 'bg-white border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-400'}`} title="Wishlist">
                                                <FiHeart size={18} className={isWishlisted ? 'fill-red-400' : ''} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Trust badges */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="flex flex-col items-center gap-1 py-3 bg-[#EDF2EE]/50 border border-[#EDF2EE] rounded-lg text-center">
                                            <FiTruck className="text-[#0B4222]" size={16} />
                                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tight">Fast Delivery</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 py-3 bg-[#EDF2EE]/50 border border-[#EDF2EE] rounded-lg text-center">
                                            <FiShield className="text-[#0B4222]" size={16} />
                                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tight">Secure Pay</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 py-3 bg-[#EDF2EE]/50 border border-[#EDF2EE] rounded-lg text-center">
                                            <FiPackage className="text-[#0B4222]" size={16} />
                                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tight">Easy Returns</span>
                                        </div>
                                    </div>


                                </div>
                            )}

                            {/* === Details Tab Content === */}
                            {activeTab === 'description' && (
                                <div className="space-y-5 animate-fadeIn">
                                    <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
                                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                                        {product.description || "No detailed description available for this product."}
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {product.brand && (
                                            <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Brand</div>
                                                <div className="text-sm font-bold text-gray-800">{product.brand}</div>
                                            </div>
                                        )}
                                        {product.sku && (
                                            <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">SKU</div>
                                                <div className="text-sm font-bold text-gray-800">{product.sku}</div>
                                            </div>
                                        )}
                                        {product.material?.length > 0 && (
                                            <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg col-span-2 sm:col-span-1">
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Material</div>
                                                <div className="text-sm font-bold text-gray-800">{product.material.join(', ')}</div>
                                            </div>
                                        )}
                                        {product.weight > 0 && (
                                            <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg col-span-2 sm:col-span-1">
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Weight</div>
                                                <div className="text-sm font-bold text-gray-800">{product.weight}g</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* === Specifications Tab Content === */}
                            {activeTab === 'specifications' && (
                                <div className="animate-fadeIn">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications</h2>
                                    {product.specifications?.length > 0 ? (
                                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                                            {product.specifications.map((spec: any, idx: number) => (
                                                <div key={idx} className={`flex ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                    <div className="w-2/5 px-4 py-3 text-xs font-bold text-gray-700 border-r border-gray-200 bg-gray-50/50">{spec.key}</div>
                                                    <div className="w-3/5 px-4 py-3 text-xs text-gray-600 font-medium">{spec.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
                                            <FiPackage className="mx-auto text-gray-300 mb-2" size={28} />
                                            <p className="text-gray-500 font-medium text-sm">No specifications available.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* === Reviews Tab Content === */}
                            {activeTab === 'reviews' && (
                                <div className="animate-fadeIn">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
                                    <div className="flex flex-col sm:flex-row items-center gap-5 p-5 bg-[#EDF2EE]/30 border border-[#EDF2EE] rounded-xl mb-6">
                                        <div className="text-center sm:text-left sm:w-1/3 border-b sm:border-b-0 sm:border-r border-gray-200 pb-3 sm:pb-0 sm:pr-5">
                                            <div className="text-4xl font-black text-[#0B4222] mb-1">{product.rating?.toFixed(1)}</div>
                                            <div className="flex justify-center sm:justify-start mb-1">{renderStars(product.rating)}</div>
                                            <div className="text-xs font-semibold text-gray-500">{product.reviewCount} Reviews</div>
                                        </div>
                                        <div className="flex-1 w-full space-y-2">
                                            {[5, 4, 3, 2, 1].map(star => (
                                                <div key={star} className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1 w-8 text-[11px] font-bold text-gray-600">
                                                        <span>{star}</span><FiStar size={9} className="fill-gray-400 text-gray-400" />
                                                    </div>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                        <div className="bg-[#0B4222] h-full rounded-full transition-all duration-1000" style={{ width: star === Math.round(product.rating) ? '70%' : `${star * 10}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-center py-10 px-4 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                                        <p className="text-gray-500 font-medium text-sm mb-3">You must complete a purchase to leave a review.</p>
                                        <button disabled className="px-5 py-2 bg-gray-200 text-gray-500 rounded-full font-bold text-sm cursor-not-allowed">Write a Review</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ═══ TABS below the product sections ═══ */}
                <div className="flex justify-end mt-3">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2 text-xs font-bold rounded-full transition-all whitespace-nowrap border ${activeTab === tab.key
                                    ? 'bg-[#0B4222] text-white border-[#0B4222] shadow-sm'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#0B4222] hover:text-[#0B4222] hover:bg-[#EDF2EE]/30'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ Related Products Section ═══ */}
            {relatedProducts.length > 0 && (
                <div className="bg-white border-t border-gray-100 mt-4">
                    <div className="container mx-auto px-4 py-8">
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                    Related Products
                                </h2>
                                {product?.category?.name && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        More from <span className="text-[#0B4222] font-semibold">{product.category.name}</span>
                                    </p>
                                )}
                            </div>
                            {product?.category?._id && (
                                <Link
                                    href={`/?category=${product.category._id}`}
                                    className="flex items-center gap-1 text-sm font-semibold text-[#0B4222] hover:text-[#093519] bg-[#EDF2EE] hover:bg-[#d9e8db] px-4 py-2 rounded-full transition-all duration-200"
                                >
                                    View All
                                    <FiChevronRight size={16} />
                                </Link>
                            )}
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                            {relatedProducts.slice(0, 10).map((item: any) => (
                                <NewProductCard
                                    key={item._id}
                                    product={{
                                        id: item._id,
                                        slug: item.slug,
                                        name: item.name,
                                        image: item.thumbnail,
                                        price: item.discount > 0
                                            ? item.price - (item.price * item.discount) / 100
                                            : item.price,
                                        originalPrice: item.originalPrice,
                                        mrp: item.originalPrice || item.price,
                                        discount: item.discount,
                                        rating: item.rating,
                                        reviews: item.reviewCount,
                                        categoryName: item.category?.name || product?.category?.name,
                                        priceType: item.priceType,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
