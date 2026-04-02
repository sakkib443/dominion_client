"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    FiHeart, FiShoppingCart, FiMinus, FiPlus, FiCheckCircle,
    FiStar, FiX, FiZoomIn, FiCopy, FiShare2, FiDownload,
    FiThumbsUp, FiChevronUp, FiChevronDown, FiMessageSquare,
    FiEye, FiChevronRight
} from 'react-icons/fi';
import { useGetProductBySlugQuery, useGetRelatedProductsQuery } from '@/redux/api/productApi';
import { useAppDispatch } from '@/redux';
import { addToCart } from '@/redux/slices/cartSlice';
import NewProductCard from '@/components/shared/NewProductCard';

export default function ProductDetailsPage() {
    const { slug } = useParams();
    const dispatch = useAppDispatch();
    const [quantity, setQuantity] = useState(1);
    const [buyNowQty, setBuyNowQty] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [activeInfoPanel, setActiveInfoPanel] = useState<'delivery' | 'payment' | 'terms' | null>(null);
    const colorSwatchRef = useRef<HTMLDivElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);

    const { data: productData, isLoading, isError } = useGetProductBySlugQuery(slug as string, { skip: !slug });
    const product = productData?.data;

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

    const scrollColors = (direction: 'up' | 'down') => {
        if (colorSwatchRef.current) {
            const amount = direction === 'up' ? -80 : 80;
            colorSwatchRef.current.scrollBy({ top: amount, behavior: 'smooth' });
        }
    };

    const scrollDetails = (direction: 'up' | 'down') => {
        if (detailsRef.current) {
            const amount = direction === 'up' ? -150 : 150;
            detailsRef.current.scrollBy({ top: amount, behavior: 'smooth' });
        }
    };

    // Loading
    if (isLoading) {
        return (
            <div style={{ background: '#fff', minHeight: '100vh' }}>
                <div className="container" style={{ padding: '2rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 55%', aspectRatio: '1', background: '#e5e7eb', borderRadius: '12px' }} className="animate-pulse" />
                        <div style={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ height: '2.5rem', background: '#e5e7eb', borderRadius: '8px', width: '75%' }} className="animate-pulse" />
                            <div style={{ height: '1.5rem', background: '#e5e7eb', borderRadius: '8px', width: '25%' }} className="animate-pulse" />
                            <div style={{ height: '2rem', background: '#e5e7eb', borderRadius: '8px', width: '33%' }} className="animate-pulse" />
                            <div style={{ height: '6rem', background: '#e5e7eb', borderRadius: '8px' }} className="animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error
    if (isError || !product) {
        return (
            <div style={{ background: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>😕</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>Product Not Found</h2>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>This product may have been removed or is no longer available.</p>
                    <Link href="/" style={{ padding: '0.75rem 2rem', background: '#0B4222', color: '#fff', borderRadius: '9999px', fontWeight: 600, textDecoration: 'none' }}>Back to Home</Link>
                </div>
            </div>
        );
    }

    const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean);
    const discountedPrice = product.discount > 0 ? product.price - (product.price * product.discount) / 100 : product.price;

    // Build product details key-value pairs from product data
    const productDetails: { key: string; value: string }[] = [];

    if (product.sku) productDetails.push({ key: 'Model', value: product.sku });
    if (product.brand) productDetails.push({ key: 'Brand', value: product.brand.toUpperCase() });
    if (product.specifications?.length > 0) {
        product.specifications.forEach((spec: any) => {
            productDetails.push({ key: spec.key, value: spec.value });
        });
    }
    if (product.material?.length > 0) productDetails.push({ key: 'Material', value: product.material.join(', ') });
    if (product.weight > 0) productDetails.push({ key: 'Weight', value: `${product.weight}g` });
    if (product.colors?.length > 0) productDetails.push({ key: 'Color', value: product.colors.join(', ') });
    if (product.sizes?.length > 0) productDetails.push({ key: 'Size', value: product.sizes.join(', ') });
    if (product.weights?.length > 0) productDetails.push({ key: 'Weight Options', value: product.weights.join(', ') });

    // Fallback: if no details exist, add basic ones
    if (productDetails.length === 0) {
        productDetails.push({ key: 'Category', value: product.category?.name || 'General' });
        productDetails.push({ key: 'Stock', value: product.stock > 0 ? `${product.stock} available` : 'Out of Stock' });
    }

    // Available color swatches (use product colors or default palette)
    const colorSwatches = product.colors?.length > 0
        ? product.colors.map((c: string) => ({ name: c, hex: c }))
        : [
            { name: 'Red', hex: '#FF0000' },
            { name: 'Orange', hex: '#FF8C00' },
            { name: 'Yellow', hex: '#FFD700' },
            { name: 'Green', hex: '#00C853' },
            { name: 'Light Green', hex: '#76FF03' },
            { name: 'Lime', hex: '#AEEA00' },
        ];

    const getColorHex = (colorName: string) => {
        const namedColors: Record<string, string> = {
            red: '#FF0000', orange: '#FF8C00', yellow: '#FFD700', green: '#00C853',
            blue: '#2196F3', black: '#000000', white: '#FFFFFF', pink: '#FF69B4',
            purple: '#9C27B0', brown: '#795548', gray: '#9E9E9E', grey: '#9E9E9E',
            navy: '#001F3F', teal: '#009688', maroon: '#800000', olive: '#808000',
            cyan: '#00BCD4', lime: '#76FF03', coral: '#FF7F50', gold: '#FFD700',
            silver: '#C0C0C0', beige: '#F5F5DC', cream: '#FFFDD0', khaki: '#F0E68C',
        };
        return namedColors[colorName.toLowerCase()] || colorName;
    };

    return (
        <div style={{ background: '#fff', minHeight: '100vh' }}>
            {/* ── Fullscreen Image Modal ── */}
            {isFullscreen && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.95)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', padding: '1rem'
                    }}
                    onClick={() => setIsFullscreen(false)}
                >
                    <button
                        onClick={() => setIsFullscreen(false)}
                        style={{
                            position: 'absolute', top: '1rem', right: '1rem',
                            width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)',
                            border: 'none', borderRadius: '50%', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', zIndex: 10
                        }}
                    >
                        <FiX size={22} />
                    </button>
                    {allImages.length > 1 && (
                        <div style={{
                            position: 'absolute', left: '1rem', top: '50%',
                            transform: 'translateY(-50%)', display: 'flex',
                            flexDirection: 'column', gap: '0.5rem', zIndex: 10
                        }}>
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setSelectedImage(idx); }}
                                    style={{
                                        width: '56px', height: '56px', borderRadius: '8px',
                                        overflow: 'hidden', border: selectedImage === idx ? '2px solid #fff' : '2px solid rgba(255,255,255,0.2)',
                                        opacity: selectedImage === idx ? 1 : 0.6,
                                        cursor: 'pointer', background: 'transparent', padding: 0,
                                        transform: selectedImage === idx ? 'scale(1.1)' : 'scale(1)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </button>
                            ))}
                        </div>
                    )}
                    <img
                        src={allImages[selectedImage] || allImages[0]}
                        alt={product.name}
                        style={{ maxWidth: '85vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '12px' }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* ═══ PRODUCT TITLE BAR ═══ */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
                <div className="container" style={{ padding: '10px 1rem' }}>
                    {/* Product Name + Code */}
                    <h1 style={{
                        fontSize: '15px', fontWeight: 700, color: '#1a1a1a',
                        margin: 0, lineHeight: 1.4
                    }}>
                        {product.sku ? `${product.sku}: ` : ''}{product.name}
                    </h1>

                    {/* Warranty / Guarantee Text */}
                    {product.shortDescription ? (
                        <p style={{ fontSize: '11px', color: '#E4525C', fontWeight: 600, margin: '2px 0 6px' }}>
                            {product.shortDescription}
                        </p>
                    ) : (
                        <p style={{ fontSize: '11px', color: '#E4525C', fontWeight: 600, margin: '2px 0 6px' }}>
                            Warranty: Service Warranty Available
                        </p>
                    )}

                    {/* Stats Row */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '28px',
                        flexWrap: 'wrap', fontSize: '12px', color: '#555'
                    }}>
                        {/* Sold */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiShoppingCart size={12} />
                            <span style={{ fontWeight: 600 }}>Sold {product.soldCount || '0'}</span>
                        </div>

                        {/* Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiStar size={12} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                            <span style={{ fontWeight: 600 }}>{product.rating?.toFixed(1) || '0.0'}</span>
                            <span style={{ color: '#888' }}>(Ratings Review)</span>
                        </div>

                        {/* Like / Heart */}
                        <button
                            onClick={() => { setIsLiked(!isLiked); setLikeCount(prev => isLiked ? prev - 1 : prev + 1); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: isLiked ? '#ef4444' : '#555', fontSize: '12px'
                            }}
                        >
                            <FiHeart size={12} style={isLiked ? { fill: '#ef4444' } : {}} />
                            <span style={{ fontWeight: 600 }}>{likeCount || '0'}</span>
                        </button>

                        {/* Comments */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiMessageSquare size={12} />
                            <span style={{ fontWeight: 600 }}>{product.reviewCount || '0'}</span>
                        </div>

                        {/* Share */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiShare2 size={12} />
                            <span style={{ fontWeight: 600 }}>0</span>
                        </div>

                        {/* Views */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiEye size={12} />
                            <span style={{ fontWeight: 600 }}>0</span>
                        </div>

                        {/* Copy Link */}
                        <button
                            onClick={() => {
                                if (typeof window !== 'undefined') {
                                    navigator.clipboard.writeText(window.location.href);
                                    setLinkCopied(true);
                                    setTimeout(() => setLinkCopied(false), 2000);
                                }
                            }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#555', fontSize: '12px'
                            }}
                        >
                            <FiCopy size={12} />
                            <span style={{ fontWeight: 600 }}>{linkCopied ? 'Copied!' : 'Copy Link'}</span>
                        </button>

                        {/* Image Download */}
                        <a
                            href={allImages[0]}
                            download
                            style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                color: '#555', fontSize: '12px', textDecoration: 'none'
                            }}
                        >
                            <FiDownload size={12} />
                            <span style={{ fontWeight: 600 }}>Image Download</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* ═══ MAIN CONTENT AREA ═══ */}
            <div className="container" style={{ padding: '0 1rem' }}>
                <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: 0,
                }}>

                    {/* ═══ LEFT SECTION: Color Swatches + Product Image ═══ */}
                    <div style={{
                        display: 'flex', flex: '0 0 50%', maxWidth: '50%',
                        height: '480px',
                    }}>
                        {/* Color Swatches Column */}
                        <div style={{
                            width: '55px', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', padding: '8px 0', gap: '4px',
                            flexShrink: 0,
                        }}>
                            {/* Up Arrow */}
                            <button
                                onClick={() => scrollColors('up')}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    padding: '4px', color: '#333', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <FiChevronUp size={18} />
                            </button>

                            {/* Color Blocks */}
                            <div
                                ref={colorSwatchRef}
                                style={{
                                    display: 'flex', flexDirection: 'column', gap: '6px',
                                    overflow: 'hidden', maxHeight: '350px', flex: 1,
                                }}
                                className="no-scrollbar"
                            >
                                {colorSwatches.map((color: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedColor(selectedColor === color.name ? '' : color.name)}
                                        title={color.name}
                                        style={{
                                            width: '42px', height: '42px', flexShrink: 0,
                                            background: getColorHex(color.hex || color.name),
                                            border: selectedColor === color.name
                                                ? '3px solid #0B4222'
                                                : '2px solid #ddd',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            transform: selectedColor === color.name ? 'scale(1.1)' : 'scale(1)',
                                            boxShadow: selectedColor === color.name
                                                ? '0 0 0 2px #0B4222'
                                                : 'none',
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Down Arrow */}
                            <button
                                onClick={() => scrollColors('down')}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    padding: '4px', color: '#333', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <FiChevronDown size={18} />
                            </button>
                        </div>

                        {/* Main Product Image */}
                        <div
                            style={{
                                flex: 1, background: '#f5f5f5', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', position: 'relative',
                                overflow: 'hidden',
                            }}
                            onClick={() => setIsFullscreen(true)}
                        >
                            <img
                                src={allImages[selectedImage] || allImages[0]}
                                alt={product.name}
                                style={{
                                    width: '100%', height: '100%',
                                    objectFit: 'cover', transition: 'transform 0.3s ease',
                                }}
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=No+Image'; }}
                            />

                            {/* Zoom Indicator */}
                            <div style={{
                                position: 'absolute', bottom: '12px', right: '12px',
                                background: 'rgba(0,0,0,0.5)', borderRadius: '50%',
                                padding: '8px', color: '#fff', opacity: 0,
                                transition: 'opacity 0.3s ease',
                            }} className="zoom-indicator">
                                <FiZoomIn size={18} />
                            </div>

                            {/* Discount Badge */}
                            {product.discount > 0 && (
                                <div style={{
                                    position: 'absolute', top: '12px', left: '12px',
                                    background: '#ef4444', color: '#fff', fontSize: '11px',
                                    fontWeight: 700, padding: '4px 10px', borderRadius: '9999px',
                                    zIndex: 2
                                }}>
                                    -{product.discount}% OFF
                                </div>
                            )}

                            {/* Low Stock Badge */}
                            {product.stock <= 5 && product.stock > 0 && (
                                <div style={{
                                    position: 'absolute', top: '12px', right: '12px',
                                    background: '#f59e0b', color: '#fff', fontSize: '11px',
                                    fontWeight: 700, padding: '4px 10px', borderRadius: '9999px',
                                    zIndex: 2
                                }} className="animate-pulse">
                                    Only {product.stock} left!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ═══ RIGHT SECTION: Price + Product Details ═══ */}
                    <div style={{
                        flex: '0 0 50%', maxWidth: '50%',
                        borderLeft: '1px solid #e5e7eb', paddingLeft: '20px',
                        display: 'flex', flexDirection: 'column',
                        position: 'relative',
                        height: '480px',
                    }}>
                        {/* Up Scroll Arrow for details */}
                        <button
                            onClick={() => scrollDetails('up')}
                            style={{
                                position: 'absolute', top: '4px', right: '8px',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#333', zIndex: 5, display: 'flex',
                                alignItems: 'center', justifyContent: 'center', padding: '4px'
                            }}
                        >
                            <FiChevronUp size={18} />
                        </button>

                        {/* ── Info Panel Overlay ── */}
                        {activeInfoPanel && (
                            <div style={{
                                position: 'absolute', inset: 0, zIndex: 10,
                                background: '#fff', overflowY: 'auto',
                                padding: '16px 20px',
                                animation: 'fadeIn 0.2s ease-out',
                            }} className="no-scrollbar">
                                {/* Close Button */}
                                <button
                                    onClick={() => setActiveInfoPanel(null)}
                                    style={{
                                        position: 'absolute', top: '10px', right: '10px',
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: '#f3f4f6', border: 'none', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#333', zIndex: 11,
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => { (e.target as HTMLElement).style.background = '#e5e7eb'; }}
                                    onMouseLeave={(e) => { (e.target as HTMLElement).style.background = '#f3f4f6'; }}
                                >
                                    <FiX size={16} />
                                </button>

                                {/* Delivery Info */}
                                {activeInfoPanel === 'delivery' && (
                                    <div>
                                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 14px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>Delivery Information</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#444', lineHeight: 1.7 }}>
                                            <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                                <strong style={{ color: '#1a1a1a' }}>Inside Dhaka:</strong>
                                                <p style={{ margin: '4px 0 0' }}>Delivery within 1-2 business days. Delivery charge: ৳60-80</p>
                                            </div>
                                            <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                                <strong style={{ color: '#1a1a1a' }}>Outside Dhaka:</strong>
                                                <p style={{ margin: '4px 0 0' }}>Delivery within 3-5 business days. Delivery charge: ৳100-150</p>
                                            </div>
                                            <div style={{ padding: '6px 0' }}>
                                                <strong style={{ color: '#1a1a1a' }}>Packaging:</strong> All products are carefully packaged to ensure safe delivery.
                                            </div>
                                            <div style={{ padding: '6px 0' }}>
                                                <strong style={{ color: '#1a1a1a' }}>Tracking:</strong> You will receive a tracking number via SMS once your order is shipped.
                                            </div>
                                            <div style={{ padding: '6px 0', color: '#888', fontSize: '12px' }}>
                                                * Delivery times may vary during holidays and peak seasons.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Payment Info */}
                                {activeInfoPanel === 'payment' && (
                                    <div>
                                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 14px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>Payment Methods</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#444', lineHeight: 1.7 }}>
                                            <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                                <strong style={{ color: '#1a1a1a' }}>Cash on Delivery (COD)</strong>
                                                <p style={{ margin: '4px 0 0' }}>Pay when you receive your product. Available for all locations.</p>
                                            </div>
                                            <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                                <strong style={{ color: '#1a1a1a' }}>bKash / Nagad / Rocket</strong>
                                                <p style={{ margin: '4px 0 0' }}>Mobile banking payment accepted. Send money to our number and confirm via order notes.</p>
                                            </div>
                                            <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                                <strong style={{ color: '#1a1a1a' }}>Bank Transfer</strong>
                                                <p style={{ margin: '4px 0 0' }}>Direct bank transfer available. Contact us for bank details.</p>
                                            </div>
                                            <div style={{ padding: '6px 0', color: '#888', fontSize: '12px' }}>
                                                * All payments are secure and encrypted.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Terms & Conditions */}
                                {activeInfoPanel === 'terms' && (
                                    <div>
                                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 14px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>Terms & Conditions</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#444', lineHeight: 1.7 }}>
                                            <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                                <strong style={{ color: '#1a1a1a' }}>Return Policy</strong>
                                                <p style={{ margin: '4px 0 0' }}>Products can be returned within 7 days of delivery if damaged or defective. Item must be in original packaging.</p>
                                            </div>
                                            <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                                <strong style={{ color: '#1a1a1a' }}>Warranty</strong>
                                                <p style={{ margin: '4px 0 0' }}>Warranty is applicable as mentioned in the product details. Service warranty covers manufacturing defects only.</p>
                                            </div>
                                            <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                                <strong style={{ color: '#1a1a1a' }}>Refund Policy</strong>
                                                <p style={{ margin: '4px 0 0' }}>Refunds are processed within 5-7 business days after the return is approved. Refund will be made to the original payment method.</p>
                                            </div>
                                            <div style={{ padding: '6px 0' }}>
                                                <strong style={{ color: '#1a1a1a' }}>Order Cancellation:</strong> Orders can be cancelled before they are shipped. Contact our support team for assistance.
                                            </div>
                                            <div style={{ padding: '6px 0', color: '#888', fontSize: '12px' }}>
                                                * Terms are subject to change. Please check this section regularly.
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Scrollable Content */}
                        <div
                            ref={detailsRef}
                            style={{
                                flex: 1, overflowY: 'auto', padding: '12px 16px',
                                paddingRight: '24px',
                            }}
                            className="no-scrollbar"
                        >
                            {/* Price Section */}
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                                    <span style={{
                                        fontSize: '20px', fontWeight: 800, color: '#1a1a1a'
                                    }}>
                                        Price Tk.{discountedPrice.toLocaleString()}
                                    </span>
                                    {product.originalPrice && product.originalPrice > discountedPrice && (
                                        <span style={{
                                            fontSize: '16px', color: '#999',
                                            textDecoration: 'line-through', fontWeight: 500
                                        }}>
                                            Tk.{product.originalPrice.toLocaleString()}
                                        </span>
                                    )}
                                    {product.discount > 0 && (
                                        <span style={{
                                            fontSize: '14px', fontWeight: 700, color: '#dc2626'
                                        }}>
                                            {product.discount}% Off
                                        </span>
                                    )}
                                    {product.priceType === 'fixed' && (
                                        <span style={{
                                            fontSize: '11px', color: '#666',
                                            fontWeight: 500
                                        }}>
                                            (price fixed)
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Product Details Section */}
                            <div>
                                <h3 style={{
                                    fontSize: '15px', fontWeight: 700, color: '#1a1a1a',
                                    margin: '0 0 12px 0', borderBottom: '1px solid #e5e7eb',
                                    paddingBottom: '8px'
                                }}>
                                    Product Details:
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {productDetails.map((detail, idx) => (
                                        <div key={idx} style={{
                                            display: 'flex', gap: '4px',
                                            fontSize: '13px', lineHeight: 1.6,
                                        }}>
                                            <span style={{
                                                fontWeight: 700, color: '#1a1a1a',
                                                minWidth: 'fit-content', whiteSpace: 'nowrap'
                                            }}>
                                                {detail.key}:
                                            </span>
                                            <span style={{ color: '#333', fontWeight: 500 }}>
                                                {detail.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div style={{ marginTop: '16px' }}>
                                    <h3 style={{
                                        fontSize: '15px', fontWeight: 700, color: '#1a1a1a',
                                        margin: '0 0 8px 0', borderBottom: '1px solid #e5e7eb',
                                        paddingBottom: '8px'
                                    }}>
                                        Description:
                                    </h3>
                                    <p style={{
                                        fontSize: '13px', color: '#444', lineHeight: 1.7,
                                        whiteSpace: 'pre-line', margin: 0
                                    }}>
                                        {product.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Down Scroll Arrow for details */}
                        <button
                            onClick={() => scrollDetails('down')}
                            style={{
                                position: 'absolute', bottom: '4px', right: '8px',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#333', zIndex: 5, display: 'flex',
                                alignItems: 'center', justifyContent: 'center', padding: '4px'
                            }}
                        >
                            <FiChevronDown size={18} />
                        </button>
                    </div>

                    {/* ═══ ACTION BAR (ADD TO CART / BUY NOW) — under left section only ═══ */}
                    <div style={{
                        display: 'flex', alignItems: 'stretch', justifyContent: 'space-between',
                        height: '52px', flex: '0 0 50%', maxWidth: '50%',
                    }}>
                        {/* ADD TO CART Section */}
                        <div style={{
                            display: 'flex', alignItems: 'center',
                            background: '#16a34a',
                        }}>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    background: 'none', border: 'none', color: '#fff',
                                    fontWeight: 800, fontSize: '13px', cursor: 'pointer',
                                    padding: '0 16px', height: '100%', letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                    opacity: product.stock === 0 ? 0.5 : 1,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {addedToCart ? (
                                    <><FiCheckCircle size={16} /> ADDED!</>
                                ) : (
                                    'ADD TO CART'
                                )}
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: '#14532d', border: 'none', color: '#fff', width: '36px', height: '52px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700 }}>−</button>
                                <div style={{ background: '#14532d', color: '#fff', width: '40px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>{String(quantity).padStart(2, '0')}</div>
                                <button onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))} style={{ background: '#14532d', border: 'none', color: '#fff', width: '36px', height: '52px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700 }}>+</button>
                            </div>
                        </div>
                        {/* BUY NOW Section */}
                        <div style={{
                            display: 'flex', alignItems: 'center',
                            background: '#1a1a1a',
                        }}>
                            <button
                                disabled={product.stock === 0}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    background: 'none', border: 'none', color: '#fff',
                                    fontWeight: 800, fontSize: '13px', cursor: 'pointer',
                                    padding: '0 16px', height: '100%', letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                    opacity: product.stock === 0 ? 0.5 : 1,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                BUY NOW
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <button onClick={() => setBuyNowQty(Math.max(1, buyNowQty - 1))} style={{ background: '#333', border: 'none', color: '#fff', width: '36px', height: '52px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700 }}>−</button>
                                <div style={{ background: '#333', color: '#fff', width: '40px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>{String(buyNowQty).padStart(2, '0')}</div>
                                <button onClick={() => setBuyNowQty(Math.min(product.stock || 99, buyNowQty + 1))} style={{ background: '#333', border: 'none', color: '#fff', width: '36px', height: '52px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700 }}>+</button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Links — under right section */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        background: '#f5f5f5', flex: '0 0 50%', maxWidth: '50%',
                        padding: '0 20px', height: '52px',
                        borderLeft: '1px solid #e5e7eb',
                    }}>
                        <button onClick={() => setActiveInfoPanel(activeInfoPanel === 'delivery' ? null : 'delivery')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: activeInfoPanel === 'delivery' ? '#0B4222' : '#333', whiteSpace: 'nowrap', borderBottom: activeInfoPanel === 'delivery' ? '2px solid #0B4222' : '2px solid transparent', paddingBottom: '2px', transition: 'all 0.2s ease' }}>Delivery</button>
                        <button onClick={() => setActiveInfoPanel(activeInfoPanel === 'payment' ? null : 'payment')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: activeInfoPanel === 'payment' ? '#0B4222' : '#333', whiteSpace: 'nowrap', borderBottom: activeInfoPanel === 'payment' ? '2px solid #0B4222' : '2px solid transparent', paddingBottom: '2px', transition: 'all 0.2s ease' }}>Payment</button>
                        <button onClick={() => setActiveInfoPanel(activeInfoPanel === 'terms' ? null : 'terms')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: activeInfoPanel === 'terms' ? '#0B4222' : '#333', whiteSpace: 'nowrap', borderBottom: activeInfoPanel === 'terms' ? '2px solid #0B4222' : '2px solid transparent', paddingBottom: '2px', transition: 'all 0.2s ease' }}>Terms & Conditions</button>
                        <div style={{ marginLeft: '4px', color: '#333' }}><FiChevronUp size={16} style={{ transform: activeInfoPanel ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} /></div>
                    </div>
                </div>
            </div>

            {/* ═══ Related Products Section ═══ */}
            {relatedProducts.length > 0 && (
                <div style={{ background: '#fff', borderTop: '1px solid #e5e7eb', marginTop: '1rem' }}>
                    <div className="container" style={{ padding: '2rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Related Products</h2>
                                {product?.category?.name && (
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                                        More from <span style={{ color: '#0B4222', fontWeight: 600 }}>{product.category.name}</span>
                                    </p>
                                )}
                            </div>
                            {product?.category?._id && (
                                <Link
                                    href={`/?category=${product.category._id}`}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                        fontSize: '0.875rem', fontWeight: 600, color: '#0B4222',
                                        background: '#EDF2EE', padding: '0.5rem 1rem',
                                        borderRadius: '9999px', textDecoration: 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    View All <FiChevronRight size={16} />
                                </Link>
                            )}
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '1rem'
                        }}>
                            {relatedProducts.slice(0, 10).map((item: any) => (
                                <NewProductCard
                                    key={item._id}
                                    product={{
                                        id: item._id,
                                        slug: item.slug,
                                        name: item.name,
                                        image: item.thumbnail,
                                        price: item.discount > 0 ? item.price - (item.price * item.discount) / 100 : item.price,
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



            {/* Hover styles for zoom indicator */}
            <style>{`
                div:hover > .zoom-indicator {
                    opacity: 1 !important;
                }
                @media (max-width: 768px) {
                    .product-main-flex {
                        flex-direction: column !important;
                    }
                }
            `}</style>
        </div>
    );
}
