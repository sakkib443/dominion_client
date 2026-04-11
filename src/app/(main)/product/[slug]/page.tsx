"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    FiHeart, FiShoppingCart, FiMinus, FiPlus, FiCheckCircle,
    FiStar, FiX, FiZoomIn, FiCopy, FiShare2, FiDownload,
    FiThumbsUp, FiChevronUp, FiChevronDown, FiMessageSquare,
    FiEye, FiChevronRight, FiChevronLeft
} from 'react-icons/fi';
import { useGetProductBySlugQuery, useGetRelatedProductsQuery } from '@/redux/api/productApi';
import { useGetProductReviewsQuery, usePublicCreateReviewMutation } from '@/redux/api/reviewApi';
import { useAppDispatch } from '@/redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { useCreateInquiryMutation } from '@/redux/api/inquiryApi';
import NewProductCard from '@/components/shared/NewProductCard';
import { FiSend } from 'react-icons/fi';
import {
    FaFacebookF, FaWhatsapp, FaTelegramPlane,
    FaLinkedinIn, FaPinterestP, FaEnvelope
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function ProductDetailsPage() {
    const { slug } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [createInquiry] = useCreateInquiryMutation();
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
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [activeInfoPanel, setActiveInfoPanel] = useState<'delivery' | 'payment' | 'terms' | null>(null);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [cmtUserName, setCmtUserName] = useState('');
    const [cmtText, setCmtText] = useState('');
    const [cmtRating, setCmtRating] = useState(5);
    const [cmtHoverRating, setCmtHoverRating] = useState(0);
    const [cmtSubmitting, setCmtSubmitting] = useState(false);
    const [cmtSuccess, setCmtSuccess] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [showInquiryModal, setShowInquiryModal] = useState(false);
    const [inquiryName, setInquiryName] = useState('');
    const [inquiryContact, setInquiryContact] = useState('');
    const [inquiryMessage, setInquiryMessage] = useState('');
    const [inquirySubmitting, setInquirySubmitting] = useState(false);
    const [inquirySuccess, setInquirySuccess] = useState(false);
    const colorSwatchRef = useRef<HTMLDivElement>(null);
    const sizeSwatchRef = useRef<HTMLDivElement>(null);
    const colorSwatchRef2 = useRef<HTMLDivElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);

    const scrollList = (ref: React.RefObject<HTMLDivElement | null>, dir: 'up' | 'down') => {
        if (ref.current) {
            ref.current.scrollBy({ top: dir === 'down' ? 96 : -96, behavior: 'smooth' });
        }
    };

    const { data: productData, isLoading, isError } = useGetProductBySlugQuery(slug as string, { skip: !slug });
    const product = productData?.data;

    const { data: relatedData } = useGetRelatedProductsQuery(
        { id: product?._id, categoryId: product?.category?._id },
        { skip: !product?._id || !product?.category?._id }
    );
    const relatedProducts = relatedData?.data || [];

    const { data: reviewsData } = useGetProductReviewsQuery(product?._id, { skip: !product?._id });
    const reviews = reviewsData?.data || [];
    const [publicCreateReview] = usePublicCreateReviewMutation();

    const handleCommentSubmit = async () => {
        if (!cmtText.trim() || !product?._id) return;
        setCmtSubmitting(true);
        try {
            await publicCreateReview({
                product: product._id,
                rating: cmtRating,
                comment: cmtText.trim(),
                userName: cmtUserName.trim() || 'Anonymous'
            }).unwrap();
            setCmtText('');
            setCmtUserName('');
            setCmtRating(5);
            setCmtSuccess(true);
            setTimeout(() => setCmtSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to submit review:', err);
        } finally {
            setCmtSubmitting(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart({
            id: product._id,
            name: product.name,
            price: discountedPrice,
            mrp: product.originalPrice || product.price,
            image: product.thumbnail,
            category: product.category?.name || 'General',
            quantity: quantity,
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

    // Available color swatches (use product colors + colorHex, or default palette)
    const colorSwatches = product.colors?.length > 0
        ? product.colors.map((c: string, i: number) => ({ name: c, hex: product.colorHex?.[i] || c }))
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
                    onClick={() => { setIsFullscreen(false); setZoomLevel(1); }}
                >
                    <button
                        onClick={() => { setIsFullscreen(false); setZoomLevel(1); }}
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
                            position: 'absolute', left: '5rem', top: '50%',
                            transform: 'translateY(-50%)', display: 'flex',
                            flexDirection: 'column', gap: '0.5rem', zIndex: 10
                        }}>
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setSelectedImage(idx); setZoomLevel(1); }}
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
                    {/* Image + Arrows Container */}
                    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                        {/* Left Arrow */}
                        {selectedImage > 0 && (
                            <button
                                onClick={() => { setSelectedImage(prev => prev - 1); setZoomLevel(1); }}
                                style={{
                                    position: 'absolute', left: '-52px', top: '50%', transform: 'translateY(-50%)',
                                    background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
                                    width: '44px', height: '44px', cursor: 'pointer', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', zIndex: 10,
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                            >
                                <FiChevronLeft size={24} color="#fff" />
                            </button>
                        )}

                        <img
                            src={allImages[selectedImage] || allImages[0]}
                            alt={product.name}
                            style={{
                                maxWidth: '75vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '12px',
                                transition: 'transform 0.3s ease', transform: `scale(${zoomLevel})`,
                                cursor: zoomLevel > 1 ? 'zoom-out' : 'zoom-in',
                            }}
                            onWheel={(e) => {
                                e.stopPropagation();
                                setZoomLevel(prev => {
                                    const next = prev + (e.deltaY < 0 ? 0.2 : -0.2);
                                    return Math.max(1, Math.min(3, next));
                                });
                            }}
                        />

                        {/* Right Arrow */}
                        {selectedImage < allImages.length - 1 && (
                            <button
                                onClick={() => { setSelectedImage(prev => prev + 1); setZoomLevel(1); }}
                                style={{
                                    position: 'absolute', right: '-52px', top: '50%', transform: 'translateY(-50%)',
                                    background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
                                    width: '44px', height: '44px', cursor: 'pointer', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', zIndex: 10,
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                            >
                                <FiChevronRight size={24} color="#fff" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* ═══ PRODUCT TITLE BAR ═══ */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
                <div className="w-[95%] mx-auto" style={{ padding: '10px 0 10px 0' }}>
                    {/* Product Name + Code */}
                    <h1 style={{
                        fontSize: '20px', fontWeight: 700, color: '#1a1a1a',
                        margin: 0, lineHeight: 1.4
                    }}>
                        {product.sku ? `${product.sku}: ` : ''}{product.name}
                    </h1>

                    {/* Warranty / Guarantee Text */}
                    {product.shortDescription ? (
                        <p style={{ fontSize: '11px', color: '#E4525C', fontWeight: 400, margin: '4px 0 4px' }}>
                            {product.shortDescription}
                        </p>
                    ) : (
                        <p style={{ fontSize: '11px', color: '#E4525C', fontWeight: 400, margin: '4px 0 4px' }}>
                            Warranty: Service Warranty Available
                        </p>
                    )}

                    {/* Stats Row */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '40px',
                        flexWrap: 'wrap', fontSize: '14px', color: '#555',
                        marginTop: '14px'
                    }}>
                        {/* Sold */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 400 }}>Sold {product.soldCount || '01'}</span>
                        </div>

                        {/* Rating */}
                        <button
                            onClick={() => setShowRatingModal(true)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#555', fontSize: '14px'
                            }}
                        >
                            <FiStar size={15} style={{ color: '#374151', fill: '#374151' }} />
                            <span style={{ fontWeight: 400 }}>{product.rating?.toFixed(1) || '0.0'}</span>
                            <span style={{ color: '#888' }}>({product.reviewCount || 0} Ratings)</span>
                        </button>

                        {/* Like / Heart */}
                        <button
                            onClick={() => { setIsLiked(!isLiked); setLikeCount(prev => isLiked ? prev - 1 : prev + 1); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: isLiked ? '#ef4444' : '#555', fontSize: '14px'
                            }}
                        >
                            <img src="/ICON/like.png" alt="Like" style={{ width: '16px', height: '16px', opacity: isLiked ? 1 : 0.6 }} />
                            <span style={{ fontWeight: 400 }}>{(product.likeCount || 0) + likeCount}</span>
                        </button>

                        {/* Comments */}
                        <div onClick={() => setShowCommentsModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <img src="/ICON/comments.png" alt="Comments" style={{ width: '16px', height: '16px', opacity: 0.6 }} />
                            <span style={{ fontWeight: 400 }}>{product.commentCount || product.reviewCount || 0}</span>
                        </div>

                        {/* Share */}
                        <div onClick={() => setShowSharePopup(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <img src="/ICON/share.png" alt="Share" style={{ width: '16px', height: '16px', opacity: 0.6 }} />
                            <span style={{ fontWeight: 400 }}>{product.shareCount || 0}</span>
                        </div>

                        {/* Views */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <img src="/ICON/views.png" alt="Views" style={{ width: '16px', height: '16px', opacity: 0.6 }} />
                            <span style={{ fontWeight: 400 }}>{product.viewCount || 0}</span>
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
                                display: 'flex', alignItems: 'center', gap: '6px',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#555', fontSize: '14px'
                            }}
                        >
                            <FiCopy size={15} />
                            <span style={{ fontWeight: 400 }}>{linkCopied ? 'Copied!' : 'Copy Link'}</span>
                        </button>

                        {/* Image Download */}
                        <button
                            onClick={() => setShowDownloadModal(true)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                color: '#555', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer'
                            }}
                        >
                            <FiDownload size={15} />
                            <span style={{ fontWeight: 400 }}>Image Download</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══ MAIN CONTENT AREA ═══ */}
            <div className="w-[95%] mx-auto" style={{ paddingTop: '12px' }}>
                <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: 0,
                }}>

                    {/* ═══ LEFT SECTION: Color Swatches + Product Image ═══ */}
                    <div style={{
                        display: 'flex', flex: '0 0 50%', maxWidth: '50%',
                        height: '480px',
                        paddingRight: '20px',
                    }}>
                        <div style={{
                            width: '55px', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', padding: '8px 0', marginLeft: '8px',
                            flexShrink: 0, gap: '4px',
                        }}>
                            {/* Label */}
                            <span style={{ fontSize: '11px', fontWeight: 400, color: '#555', textTransform: 'capitalize', letterSpacing: '0.5px' }}>Image</span>

                            {/* Image Thumbnails */}
                            <div
                                ref={colorSwatchRef}
                                style={{
                                    display: 'flex', flexDirection: 'column', gap: '6px',
                                    overflow: 'hidden', maxHeight: '350px', flex: 1,
                                }}
                                className="no-scrollbar"
                            >
                                {allImages.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        style={{
                                            width: '42px', height: '42px', flexShrink: 0,
                                            border: selectedImage === idx
                                                ? '2px solid #0B4222'
                                                : '2px solid #ddd',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            overflow: 'hidden',
                                            padding: 0, background: '#f5f5f5',
                                        }}
                                    >
                                        <img src={img} alt={`Product ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </button>
                                ))}
                            </div>

                            {/* Up & Down Arrows */}
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={() => scrollList(colorSwatchRef, 'up')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiChevronUp size={18} />
                                </button>
                                <button onClick={() => scrollList(colorSwatchRef, 'down')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiChevronDown size={18} />
                                </button>
                            </div>
                        </div>

                        <div
                            style={{
                                height: '100%', aspectRatio: '1 / 1',
                                background: '#f5f5f5', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', position: 'relative',
                                overflow: 'hidden', margin: '0 auto',
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

                            {/* Left Arrow */}
                            {selectedImage > 0 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev - 1); setZoomLevel(1); }}
                                    style={{
                                        position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                                        background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
                                        width: '32px', height: '32px', cursor: 'pointer', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', zIndex: 3,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'; }}
                                >
                                    <FiChevronLeft size={18} color="#333" />
                                </button>
                            )}

                            {/* Right Arrow */}
                            {selectedImage < allImages.length - 1 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev + 1); setZoomLevel(1); }}
                                    style={{
                                        position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                                        background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
                                        width: '32px', height: '32px', cursor: 'pointer', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', zIndex: 3,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'; }}
                                >
                                    <FiChevronRight size={18} color="#333" />
                                </button>
                            )}

                            {/* Zoom Indicator */}
                            <div style={{
                                position: 'absolute', bottom: '12px', right: '12px',
                                background: '#0B4222', borderRadius: '50%',
                                padding: '8px', color: '#fff', opacity: 0,
                                transition: 'opacity 0.3s ease',
                            }} className="zoom-indicator">
                                <FiZoomIn size={18} />
                            </div>

                            {/* Discount Badge */}
                            {product.discount > 0 && (
                                <div className="discount-badge" style={{
                                    position: 'absolute', top: '12px', left: '12px',
                                    background: '#0B4222', color: '#fff', fontSize: '11px',
                                    fontWeight: 700, padding: '4px 10px', borderRadius: '9999px',
                                    zIndex: 2, opacity: 0, transition: 'opacity 0.3s ease'
                                }}>
                                    -{product.discount}% Off
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

                        {/* Size Swatches Column (RIGHT of image) */}
                        <div style={{
                            width: '55px', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', padding: '8px 0',
                            flexShrink: 0, gap: '4px',
                        }}>
                            <span style={{ fontSize: '11px', fontWeight: 400, color: '#555', textTransform: 'capitalize', letterSpacing: '0.5px' }}>Size</span>
                            <div ref={sizeSwatchRef} style={{
                                display: 'flex', flexDirection: 'column', gap: '6px',
                                overflow: 'hidden', maxHeight: '350px', flex: 1,
                            }} className="no-scrollbar">
                                {(product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL', 'XXL']).map((size: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                                        style={{
                                            width: '42px', height: '42px', flexShrink: 0,
                                            background: selectedSize === size ? '#0B4222' : '#fff',
                                            color: selectedSize === size ? '#fff' : '#333',
                                            border: selectedSize === size ? '2px solid #0B4222' : '2px solid #ddd',
                                            borderRadius: '4px', cursor: 'pointer',
                                            fontWeight: 700, fontSize: '12px',
                                            transition: 'all 0.2s ease',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={() => scrollList(sizeSwatchRef, 'up')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiChevronUp size={18} /></button>
                                <button onClick={() => scrollList(sizeSwatchRef, 'down')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiChevronDown size={18} /></button>
                            </div>
                        </div>

                        {/* Color Label Column (RIGHT of image) */}
                        <div style={{
                            width: '55px', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', padding: '8px 0',
                            flexShrink: 0, gap: '4px',
                        }}>
                            <span style={{ fontSize: '10px', fontWeight: 700, color: '#555', textTransform: 'capitalize', letterSpacing: '0.5px' }}>Color</span>
                            <div ref={colorSwatchRef2} style={{
                                display: 'flex', flexDirection: 'column', gap: '6px',
                                overflow: 'hidden', maxHeight: '350px', flex: 1,
                            }} className="no-scrollbar">
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
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={() => scrollList(colorSwatchRef2, 'up')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiChevronUp size={18} /></button>
                                <button onClick={() => scrollList(colorSwatchRef2, 'down')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiChevronDown size={18} /></button>
                            </div>
                        </div>
                    </div>

                    {/* ═══ RIGHT SECTION: Price + Product Details ═══ */}
                    <div style={{
                        flex: '0 0 50%', maxWidth: '50%',
                        paddingLeft: '20px',
                        display: 'flex', flexDirection: 'column',
                        position: 'relative',
                        height: '480px',
                        borderLeft: '1px solid #e5e7eb',
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
                                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 14px 0' }}>Delivery Information</h3>
                                        {product.deliveryInfo ? (
                                            <div style={{ fontSize: '13px', color: '#444', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: product.deliveryInfo }} />
                                        ) : (
                                            <p style={{ fontSize: '13px', color: '#888' }}>No delivery information available.</p>
                                        )}
                                    </div>
                                )}

                                {/* Payment Info */}
                                {activeInfoPanel === 'payment' && (
                                    <div>
                                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 14px 0' }}>Payment Methods</h3>
                                        {product.paymentInfo ? (
                                            <div style={{ fontSize: '13px', color: '#444', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: product.paymentInfo }} />
                                        ) : (
                                            <p style={{ fontSize: '13px', color: '#888' }}>No payment information available.</p>
                                        )}
                                    </div>
                                )}

                                {/* Terms & Conditions */}
                                {activeInfoPanel === 'terms' && (
                                    <div>
                                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 14px 0' }}>Terms & Conditions</h3>
                                        {product.termsInfo ? (
                                            <div style={{ fontSize: '13px', color: '#444', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: product.termsInfo }} />
                                        ) : (
                                            <p style={{ fontSize: '13px', color: '#888' }}>No terms & conditions available.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Scrollable Content */}
                        <div
                            ref={detailsRef}
                            style={{
                                flex: 1, overflowY: 'auto', padding: '2px 16px',
                                paddingRight: '24px',
                            }}
                            className="no-scrollbar"
                        >
                            {/* Price Section */}
                            <div style={{ marginBottom: '10px' }}>
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
                                            fontSize: '20px', fontWeight: 700, color: '#1a1a1a'
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
                            <div style={{ marginTop: '4px' }}>
                                <h3 style={{
                                    fontSize: '15px', fontWeight: 700, color: '#1a1a1a',
                                    margin: '0 0 6px 0', borderBottom: '1px solid #e5e7eb',
                                    paddingBottom: '6px'
                                }}>
                                    Product Details:
                                </h3>

                                {product.description && (
                                    <div
                                        style={{ fontSize: '13px', color: '#444', lineHeight: 1.7 }}
                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                    />
                                )}
                            </div>
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

                    {/* ═══ ACTION BAR (ADD TO CART / BUY NOW / SEND INQUIRY) ═══ */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '100px', justifyContent: 'space-between',
                        height: '38px', flex: '0 0 50%', maxWidth: '50%',
                        marginTop: '10px', paddingRight: '20px',
                    }}>
                        {/* ADD TO CART with quantity */}
                        <div
                            style={{
                                display: 'flex', alignItems: 'center',
                                border: '1.5px solid #0B4222', borderRadius: '8px',
                                height: '100%', overflow: 'hidden', flex: 1,
                                opacity: product.stock === 0 ? 0.5 : 1,
                                transition: 'background 0.2s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#0B4222'; e.currentTarget.querySelectorAll<HTMLElement>('button, span').forEach(el => { el.style.color = '#fff'; }); }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelectorAll<HTMLElement>('button, span').forEach(el => { el.style.color = '#0B4222'; }); }}
                        >
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                    background: 'transparent', border: 'none', color: '#0B4222',
                                    fontWeight: 700, fontSize: '11px', cursor: 'pointer',
                                    padding: '0 10px', height: '100%', letterSpacing: '0.4px',
                                    textTransform: 'uppercase', whiteSpace: 'nowrap', flex: 1,
                                }}
                            >
                                {addedToCart ? <><FiCheckCircle size={12} /> ADDED!</> : <><FiShoppingCart size={12} /> ADD TO CART</>}
                            </button>
                            <span style={{ color: '#0B4222', fontSize: '13px', paddingRight: '2px' }}>(</span>
                            <button onClick={(e) => { e.preventDefault(); setQuantity(q => Math.max(1, q - 1)); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0B4222', fontSize: '15px', fontWeight: 700, padding: '0 3px', lineHeight: 1 }}>-</button>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#0B4222', minWidth: '20px', textAlign: 'center' }}>{String(quantity).padStart(2, '0')}</span>
                            <button onClick={(e) => { e.preventDefault(); setQuantity(q => q + 1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0B4222', fontSize: '15px', fontWeight: 700, padding: '0 3px', lineHeight: 1 }}>+</button>
                            <span style={{ color: '#0B4222', fontSize: '13px', paddingLeft: '2px', paddingRight: '8px' }}>)</span>
                        </div>

                        {/* BUY NOW with quantity */}
                        <div
                            style={{
                                display: 'flex', alignItems: 'center',
                                border: '1.5px solid #0B4222', borderRadius: '8px',
                                height: '100%', overflow: 'hidden', flex: 1,
                                opacity: product.stock === 0 ? 0.5 : 1,
                                transition: 'background 0.2s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#0B4222'; e.currentTarget.querySelectorAll<HTMLElement>('button, span').forEach(el => { el.style.color = '#fff'; }); }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelectorAll<HTMLElement>('button, span').forEach(el => { el.style.color = '#0B4222'; }); }}
                        >
                            <button
                                onClick={() => {
                                    dispatch(addToCart({
                                        id: product._id,
                                        name: product.name,
                                        price: discountedPrice,
                                        mrp: product.originalPrice || product.price,
                                        image: product.thumbnail,
                                        category: product.category?.name || 'General',
                                        quantity: buyNowQty,
                                    }));
                                    router.push('/cart');
                                }}
                                disabled={product.stock === 0}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'transparent', border: 'none', color: '#0B4222',
                                    fontWeight: 700, fontSize: '11px', cursor: 'pointer',
                                    padding: '0 10px', height: '100%', letterSpacing: '0.4px',
                                    textTransform: 'uppercase', whiteSpace: 'nowrap', flex: 1,
                                }}
                            >
                                BUY NOW
                            </button>
                            <span style={{ color: '#0B4222', fontSize: '13px', paddingRight: '2px' }}>(</span>
                            <button onClick={(e) => { e.preventDefault(); setBuyNowQty(q => Math.max(1, q - 1)); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0B4222', fontSize: '15px', fontWeight: 700, padding: '0 3px', lineHeight: 1 }}>-</button>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#0B4222', minWidth: '20px', textAlign: 'center' }}>{String(buyNowQty).padStart(2, '0')}</span>
                            <button onClick={(e) => { e.preventDefault(); setBuyNowQty(q => q + 1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0B4222', fontSize: '15px', fontWeight: 700, padding: '0 3px', lineHeight: 1 }}>+</button>
                            <span style={{ color: '#0B4222', fontSize: '13px', paddingLeft: '2px', paddingRight: '8px' }}>)</span>
                        </div>

                        {/* SEND INQUIRY */}
                        <button
                            onClick={() => setShowInquiryModal(true)}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'transparent', border: '1.5px solid #0B4222', color: '#0B4222',
                                fontWeight: 700, fontSize: '11px', cursor: 'pointer',
                                padding: '0 14px', height: '100%', letterSpacing: '0.4px',
                                textTransform: 'uppercase', borderRadius: '8px',
                                whiteSpace: 'nowrap', transition: 'all 0.2s ease', flex: 1,
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#0B4222'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0B4222'; }}
                        >
                            SEND INQUIRY
                        </button>
                    </div>

                    {/* Delivery / Payment / Terms — same row as action bar */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '32px',
                        flex: '0 0 calc(50% - 20px)', maxWidth: 'calc(50% - 20px)',
                        padding: '4px 24px 0 24px', height: '38px',
                        marginTop: '10px', marginLeft: '20px',
                    }}>
                        <button onClick={() => setActiveInfoPanel(activeInfoPanel === 'delivery' ? null : 'delivery')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: activeInfoPanel === 'delivery' ? '#0B4222' : '#333', whiteSpace: 'nowrap', borderBottom: activeInfoPanel === 'delivery' ? '2px solid #0B4222' : '2px solid transparent', paddingBottom: '2px', transition: 'all 0.2s ease' }}>Delivery</button>
                        <button onClick={() => setActiveInfoPanel(activeInfoPanel === 'payment' ? null : 'payment')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: activeInfoPanel === 'payment' ? '#0B4222' : '#333', whiteSpace: 'nowrap', borderBottom: activeInfoPanel === 'payment' ? '2px solid #0B4222' : '2px solid transparent', paddingBottom: '2px', transition: 'all 0.2s ease' }}>Payment</button>
                        <button onClick={() => setActiveInfoPanel(activeInfoPanel === 'terms' ? null : 'terms')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: activeInfoPanel === 'terms' ? '#0B4222' : '#333', whiteSpace: 'nowrap', borderBottom: activeInfoPanel === 'terms' ? '2px solid #0B4222' : '2px solid transparent', paddingBottom: '2px', transition: 'all 0.2s ease' }}>Terms & Conditions</button>
                        <div style={{ marginLeft: '4px', color: '#333' }}><FiChevronUp size={16} style={{ transform: activeInfoPanel ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} /></div>
                    </div>

                </div>
            </div>



            {/* ═══ Related Products Section ═══ */}
            {relatedProducts.length > 0 && (
                <div style={{ background: '#fff', borderTop: '1px solid #e5e7eb', marginTop: '1rem' }}>
                    <div className="w-[95%] mx-auto" style={{ padding: '2rem 0' }}>
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
                        <div className="grid grid-cols-5 gap-2 overflow-hidden">
                            {relatedProducts.slice(0, 5).map((item: any) => (
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


            {/* ═══ Rating Popup Modal ═══ */}
            {showRatingModal && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.5)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', padding: '1rem'
                    }}
                    onClick={() => setShowRatingModal(false)}
                >
                    <div
                        style={{
                            background: '#fff', borderRadius: '12px', maxWidth: '500px',
                            width: '100%', maxHeight: '80vh', overflowY: 'auto',
                            padding: '24px', position: 'relative',
                            animation: 'fadeIn 0.2s ease-out',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowRatingModal(false)}
                            style={{
                                position: 'absolute', top: '12px', right: '12px',
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: '#f3f4f6', border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <FiX size={16} />
                        </button>

                        {/* Header */}
                        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#1a1a1a' }}>
                            Ratings & Reviews
                        </h3>

                        {/* Overall Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '36px', fontWeight: 800, color: '#1a1a1a' }}>
                                    {product.rating?.toFixed(1) || '0.0'}
                                </div>
                                <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginTop: '4px' }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <FiStar key={star} size={14} style={{
                                            color: '#f59e0b',
                                            fill: star <= Math.round(product.rating || 0) ? '#f59e0b' : 'none'
                                        }} />
                                    ))}
                                </div>
                                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                                    {product.reviewCount || 0} ratings
                                </div>
                            </div>

                            {/* Star Breakdown */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {[5, 4, 3, 2, 1].map(star => {
                                    const count = product.ratingBreakdown?.[star] || 0;
                                    const total = product.reviewCount || 1;
                                    const percentage = Math.round((count / total) * 100);
                                    return (
                                        <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                                            <span style={{ width: '12px', fontWeight: 600, color: '#555' }}>{star}</span>
                                            <FiStar size={10} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                                            <div style={{ flex: 1, height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: `${percentage}%`, height: '100%', background: '#f59e0b', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                                            </div>
                                            <span style={{ width: '30px', textAlign: 'right', color: '#888', fontSize: '11px' }}>{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {(product.reviews && product.reviews.length > 0) ? (
                                product.reviews.map((review: any, idx: number) => (
                                    <div key={idx} style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <span style={{ fontWeight: 600, fontSize: '13px', color: '#1a1a1a' }}>
                                                {review.userName || review.user?.name || 'Anonymous'}
                                            </span>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <FiStar key={star} size={10} style={{
                                                        color: '#f59e0b',
                                                        fill: star <= (review.rating || 0) ? '#f59e0b' : 'none'
                                                    }} />
                                                ))}
                                            </div>
                                        </div>
                                        {review.comment && (
                                            <p style={{ fontSize: '12px', color: '#555', margin: 0, lineHeight: 1.6 }}>
                                                {review.comment}
                                            </p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '13px' }}>
                                    No reviews yet. Be the first to review this product!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Hover styles for zoom indicator */}
            <style>{`
                div:hover > .zoom-indicator {
                    opacity: 1 !important;
                }
                div:hover > .discount-badge {
                    opacity: 1 !important;
                }
                @media (max-width: 768px) {
                    .product-main-flex {
                        flex-direction: column !important;
                    }
                }
            `}</style>

            {/* ── Share Popup Modal ── */}
            {showSharePopup && (() => {
                const productUrl = typeof window !== 'undefined' ? window.location.href : '';
                const shareText = `${product.name} - Tk.${product.price}`;
                const shareLinks = [
                    { name: 'Facebook', icon: FaFacebookF, color: '#1877F2', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(shareText)}` },
                    { name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366', url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + productUrl)}` },
                    { name: 'Messenger', icon: FaFacebookF, color: '#0078FF', url: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(productUrl)}&app_id=966242223397117&redirect_uri=${encodeURIComponent(productUrl)}` },
                    { name: 'X', icon: FaXTwitter, color: '#000000', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}` },
                    { name: 'Telegram', icon: FaTelegramPlane, color: '#0088cc', url: `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}` },
                    { name: 'LinkedIn', icon: FaLinkedinIn, color: '#0A66C2', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}` },
                    { name: 'Pinterest', icon: FaPinterestP, color: '#E60023', url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(productUrl)}&media=${encodeURIComponent(allImages[0])}&description=${encodeURIComponent(shareText)}` },
                    { name: 'Email', icon: FaEnvelope, color: '#555555', url: `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(shareText + '\n\n' + productUrl)}` },
                ];
                return (
                    <div
                        className='fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4'
                        onClick={() => setShowSharePopup(false)}
                    >
                        <div
                            className='bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl'
                            onClick={(e) => e.stopPropagation()}
                            style={{ animation: 'fadeIn 0.2s ease-out' }}
                        >
                            <div className='flex items-center justify-between px-5 py-3.5 border-b border-gray-100'>
                                <h3 className='text-base font-bold text-gray-900'>Share Product</h3>
                                <button onClick={() => setShowSharePopup(false)} className='text-gray-400 hover:text-gray-600 transition-colors'>
                                    <FiX size={20} />
                                </button>
                            </div>
                            <div className='px-5 py-4'>
                                <div className='grid grid-cols-4 gap-3 mb-4'>
                                    {shareLinks.map((link) => (
                                        <a
                                            key={link.name}
                                            href={link.url}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 transition-colors'
                                        >
                                            <div className='w-10 h-10 rounded-full flex items-center justify-center text-white' style={{ background: link.color }}>
                                                <link.icon size={18} />
                                            </div>
                                            <span className='text-[10px] text-gray-500 font-medium'>{link.name}</span>
                                        </a>
                                    ))}
                                </div>
                                <div className='flex items-center gap-2 bg-gray-50 rounded-lg p-2.5'>
                                    <input type='text' value={productUrl} readOnly className='flex-1 bg-transparent text-xs text-gray-600 outline-none truncate' />
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(productUrl); setShareLinkCopied(true); setTimeout(() => setShareLinkCopied(false), 2000); }}
                                        className='shrink-0 px-3 py-1.5 bg-[#0B4222] text-white text-xs font-semibold rounded-md hover:bg-[#093519] transition-colors flex items-center gap-1'
                                    >
                                        {shareLinkCopied ? <><FiCheckCircle size={12} /> Copied!</> : <><FiCopy size={12} /> Copy</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
            {/* ── Comments Modal (same as product card) ── */}
            {showCommentsModal && product && (
                <div
                    className='fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4'
                    onClick={() => setShowCommentsModal(false)}
                >
                    <div
                        className='bg-white rounded-lg w-full max-w-[620px] max-h-[88vh] flex flex-col overflow-hidden shadow-2xl'
                        onClick={(e) => e.stopPropagation()}
                        style={{ animation: 'fadeIn 0.2s ease-out' }}
                    >
                        {/* Header */}
                        <div className='flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gray-50/80'>
                            <span className='font-semibold text-gray-800' style={{ fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>{product.name}</span>
                            <button onClick={() => setShowCommentsModal(false)} className='w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer'>
                                <FiX size={14} />
                            </button>
                        </div>

                        {/* Product Image */}
                        <div className='w-full flex justify-center bg-gray-50 border-b border-gray-100'>
                            <img
                                src={allImages[0]}
                                alt={product.name}
                                style={{ height: '280px', width: 'auto', objectFit: 'contain' }}
                            />
                        </div>

                        {/* Comments List */}
                        <div className='flex-1 overflow-y-auto px-4 py-2 space-y-1.5' style={{ maxHeight: '220px' }}>
                            {reviews.length > 0 ? reviews.map((r: any, idx: number) => (
                                <div key={idx} className='flex gap-2 items-start'>
                                    <div className='w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-bold text-white mt-0.5 shrink-0'>
                                        {(r.userName || 'A')[0].toUpperCase()}
                                    </div>
                                    <div className='bg-gray-100 rounded-xl px-3 py-1.5 max-w-[85%]'>
                                        <span className='font-semibold text-gray-800 block' style={{ fontSize: '11px', fontFamily: 'Roboto, sans-serif' }}>{r.userName || 'Anonymous'}</span>
                                        <p className='text-gray-600 m-0 leading-snug' style={{ fontSize: '11px', fontFamily: 'Roboto, sans-serif' }}>{r.comment}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className='text-center py-6 text-gray-400' style={{ fontSize: '12px' }}>No comments yet</div>
                            )}
                        </div>

                        {/* Rating Stars */}
                        <div className='flex items-center justify-center gap-1 py-1.5 border-t border-gray-100'>
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setCmtRating(star)}
                                    onMouseEnter={() => setCmtHoverRating(star)}
                                    onMouseLeave={() => setCmtHoverRating(0)}
                                    className='cursor-pointer bg-transparent border-none p-0.5'
                                >
                                    <FiStar size={16} style={{
                                        color: '#f59e0b',
                                        fill: star <= (cmtHoverRating || cmtRating) ? '#f59e0b' : 'none',
                                        transition: 'all 0.1s'
                                    }} />
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className='px-3 py-2 border-t border-gray-200 bg-white'>
                            <div className='flex flex-col gap-0 border border-gray-200 rounded-lg overflow-hidden'>
                                <input
                                    type='text'
                                    placeholder='Name'
                                    value={cmtUserName}
                                    onChange={(e) => setCmtUserName(e.target.value)}
                                    className='w-full px-3 py-1.5 text-gray-700 outline-none border-b border-gray-100'
                                    style={{ fontSize: '12px', fontWeight: 400, fontFamily: 'Roboto, sans-serif' }}
                                />
                                <div className='flex items-center'>
                                    <input
                                        type='text'
                                        placeholder='Write a comment...'
                                        value={cmtText}
                                        onChange={(e) => setCmtText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                                        className='flex-1 px-3 py-1.5 text-gray-700 outline-none'
                                        style={{ fontSize: '12px', fontWeight: 400, fontFamily: 'Roboto, sans-serif' }}
                                    />
                                    <button
                                        onClick={handleCommentSubmit}
                                        disabled={cmtSubmitting || !cmtText.trim()}
                                        className='px-3 py-1.5 text-[#0B4222] hover:text-[#093519] transition-colors disabled:opacity-30 cursor-pointer bg-transparent border-none'
                                    >
                                        {cmtSubmitting ? '...' : <FiSend size={16} />}
                                    </button>
                                </div>
                            </div>
                            {cmtSuccess && <p className='text-green-600 text-[10px] mt-1 text-center'>Comment posted!</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ Download Modal ═══ */}
            {showDownloadModal && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.7)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', padding: '2rem',
                    }}
                    onClick={() => setShowDownloadModal(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: '#fff', borderRadius: '12px', padding: '24px',
                            maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                                <FiDownload size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                Download Images
                            </h3>
                            <button onClick={() => setShowDownloadModal(false)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FiX size={16} />
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                            {allImages.map((img: string, idx: number) => (
                                <div
                                    key={idx}
                                    onClick={async () => {
                                        try {
                                            const res = await fetch(img);
                                            const blob = await res.blob();
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `${product.name || 'product'}-image-${idx + 1}.jpg`;
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                            URL.revokeObjectURL(url);
                                        } catch {
                                            window.open(img, '_blank');
                                        }
                                    }}
                                    style={{
                                        aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden',
                                        cursor: 'pointer', border: '2px solid #e5e7eb', position: 'relative',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0B4222'; e.currentTarget.style.transform = 'scale(1.03)'; (e.currentTarget.querySelector('.dl-overlay') as HTMLElement).style.opacity = '1'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'scale(1)'; (e.currentTarget.querySelector('.dl-overlay') as HTMLElement).style.opacity = '0'; }}
                                >
                                    <img src={img} alt={`Image ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div className="dl-overlay" style={{
                                        position: 'absolute', inset: 0, background: 'rgba(11,66,34,0.5)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        opacity: 0, transition: 'opacity 0.2s ease',
                                    }}>
                                        <FiDownload size={24} color="#fff" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ Send Inquiry Modal ═══ */}
            {showInquiryModal && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.7)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', padding: '2rem',
                    }}
                    onClick={() => { setShowInquiryModal(false); setInquirySuccess(false); }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: '#fff', borderRadius: '12px', padding: '24px',
                            maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                                <FiMessageSquare size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                Send Inquiry
                            </h3>
                            <button onClick={() => { setShowInquiryModal(false); setInquirySuccess(false); }} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FiX size={16} />
                            </button>
                        </div>

                        {/* Product Preview */}
                        <div style={{ display: 'flex', gap: '12px', padding: '12px', background: '#f9fafb', borderRadius: '8px', marginBottom: '16px' }}>
                            <img src={product.thumbnail} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                            <div>
                                <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', margin: '0 0 4px 0', lineHeight: 1.3 }}>{product.name}</p>
                                <p style={{ fontSize: '14px', fontWeight: 700, color: '#0B4222', margin: 0 }}>Tk.{discountedPrice.toLocaleString()}</p>
                            </div>
                        </div>

                        {inquirySuccess ? (
                            <div style={{ textAlign: 'center', padding: '30px 0' }}>
                                <FiCheckCircle size={48} color="#0B4222" />
                                <p style={{ fontSize: '16px', fontWeight: 700, color: '#0B4222', marginTop: '12px' }}>Inquiry Sent!</p>
                                <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>We'll get back to you soon.</p>
                            </div>
                        ) : (
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                if (!inquiryName.trim() || !inquiryContact.trim() || !inquiryMessage.trim()) return;
                                setInquirySubmitting(true);
                                try {
                                    await createInquiry({
                                        product: product._id,
                                        name: inquiryName.trim(),
                                        phone: inquiryContact.trim(),
                                        message: inquiryMessage.trim(),
                                    }).unwrap();
                                    setInquirySuccess(true);
                                    setInquiryName('');
                                    setInquiryContact('');
                                    setInquiryMessage('');
                                } catch (err) {
                                    console.error('Inquiry error:', err);
                                } finally {
                                    setInquirySubmitting(false);
                                }
                            }}>
                                {/* Name */}
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Your Name *</label>
                                    <input
                                        value={inquiryName}
                                        onChange={(e) => setInquiryName(e.target.value)}
                                        placeholder="Enter your name"
                                        required
                                        style={{
                                            width: '100%', padding: '10px 12px', borderRadius: '8px',
                                            border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none',
                                            transition: 'border 0.2s ease', boxSizing: 'border-box',
                                        }}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#0B4222'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                                    />
                                </div>

                                {/* Phone or Email */}
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Phone or Email *</label>
                                    <input
                                        value={inquiryContact}
                                        onChange={(e) => setInquiryContact(e.target.value)}
                                        placeholder="01XXXXXXXXX or email@example.com"
                                        required
                                        style={{
                                            width: '100%', padding: '10px 12px', borderRadius: '8px',
                                            border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none',
                                            transition: 'border 0.2s ease', boxSizing: 'border-box',
                                        }}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#0B4222'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                                    />
                                </div>

                                {/* Message */}
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Your Query *</label>
                                    <textarea
                                        value={inquiryMessage}
                                        onChange={(e) => setInquiryMessage(e.target.value)}
                                        placeholder="Write your question or inquiry..."
                                        required
                                        rows={4}
                                        style={{
                                            width: '100%', padding: '10px 12px', borderRadius: '8px',
                                            border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none',
                                            transition: 'border 0.2s ease', resize: 'vertical',
                                            fontFamily: 'inherit', boxSizing: 'border-box',
                                        }}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#0B4222'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={inquirySubmitting}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '9999px',
                                        background: '#0B4222', color: '#fff', border: 'none',
                                        fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                                        opacity: inquirySubmitting ? 0.7 : 1,
                                        transition: 'all 0.2s ease', textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    {inquirySubmitting ? 'Submitting...' : 'Submit Inquiry'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
