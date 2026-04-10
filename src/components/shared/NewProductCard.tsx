"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAppDispatch } from '@/redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { useGetProductReviewsQuery, usePublicCreateReviewMutation } from '@/redux/api/reviewApi';
import { FiStar, FiX, FiCopy, FiCheck, FiSend } from 'react-icons/fi';
import {
    FaFacebookF, FaWhatsapp, FaTelegramPlane,
    FaLinkedinIn, FaPinterestP, FaRedditAlien, FaEnvelope
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

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
    const [localLikes, setLocalLikes] = useState(0);
    const [likeAnim, setLikeAnim] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const productId = String(product._id || product.id);
    const productUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/product/${product.slug || product.id}`
        : `/product/${product.slug || product.id}`;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({
            id: productId,
            name: product.name,
            price: product.price,
            mrp: product.mrp || product.originalPrice || product.price,
            image: product.image,
            category: product.categoryName || 'General'
        }));
    };

    // Like: every click = +1, with a little pop animation
    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLocalLikes(prev => prev + 1);
        setLikeAnim(true);
        setTimeout(() => setLikeAnim(false), 300);
    };

    const handleCommentsClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowComments(true);
    };

    const handleShareClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowShare(true);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(productUrl);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const shareText = `${product.name} - Tk.${product.price}`;
    const shareLinks = [
        { name: 'Facebook', icon: FaFacebookF, color: '#1877F2', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(shareText)}` },
        { name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366', url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + productUrl)}` },
        { name: 'Messenger', icon: FaFacebookF, color: '#0078FF', url: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(productUrl)}&app_id=966242223397117&redirect_uri=${encodeURIComponent(productUrl)}` },
        { name: 'X', icon: FaXTwitter, color: '#000000', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}` },
        { name: 'Telegram', icon: FaTelegramPlane, color: '#0088cc', url: `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}` },
        { name: 'LinkedIn', icon: FaLinkedinIn, color: '#0A66C2', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}` },
        { name: 'Pinterest', icon: FaPinterestP, color: '#E60023', url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(productUrl)}&media=${encodeURIComponent(product.image)}&description=${encodeURIComponent(shareText)}` },
        { name: 'Email', icon: FaEnvelope, color: '#555555', url: `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(shareText + '\n\n' + productUrl)}` },
    ];

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
            views: (hash * 23) % 8000 + 1000,
        };
    }, [product._id, product.id]);

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
                                className='relative text-gray-600 hover:text-[#0B4222] transition-all p-2 cart-icon-animate rounded-full bg-[#0B4222]/50 hover:bg-[#0B4222]/60'
                                title='Add to Cart'
                            >
                                <img src="/ICON/cart.png" alt="Cart" className="w-5 h-5 opacity-70" />
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
                            <p className='text-[#E4525C] text-[11px] font-normal inline-block animate-marquee-card'>
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
                        {/* Heart / Like — unlimited clicks */}
                        <button
                            onClick={handleLike}
                            className='flex items-center gap-1 transition-colors hover:text-[#E4525C] stat-item'
                        >
                            <img
                                src="/ICON/like.png"
                                alt="Like"
                                className="w-3.5 h-3.5 opacity-50 transition-all stat-icon"
                                style={{ transform: likeAnim ? 'scale(1.5)' : 'scale(1)' }}
                            />
                            <span style={{ color: localLikes > 0 ? '#E4525C' : undefined, fontWeight: localLikes > 0 ? 600 : undefined }}>
                                {formatCount(stats.likes + localLikes)}
                            </span>
                        </button>

                        {/* Comments */}
                        <button
                            onClick={handleCommentsClick}
                            className='flex items-center gap-1 transition-colors hover:text-[#E4525C] stat-item'
                        >
                            <img src="/ICON/comments.png" alt="Comments" className="w-3.5 h-3.5 opacity-50 transition-all stat-icon" />
                            <span>{formatCount(stats.comments)}</span>
                        </button>

                        {/* Shares */}
                        <button
                            onClick={handleShareClick}
                            className='flex items-center gap-1 transition-colors hover:text-[#E4525C] stat-item'
                        >
                            <img src="/ICON/share.png" alt="Share" className="w-3.5 h-3.5 opacity-50 transition-all stat-icon" />
                            <span>{formatCount(stats.shares)}</span>
                        </button>

                        {/* Views */}
                        <span className='flex items-center gap-1 transition-colors hover:text-[#E4525C] stat-item'>
                            <img src="/ICON/views.png" alt="Views" className="w-3.5 h-3.5 opacity-50 transition-all stat-icon" />
                            <span>{formatCount(stats.views)}</span>
                        </span>
                    </div>
                    <style>{`
                        .stat-item:hover .stat-icon {
                            opacity: 1;
                            filter: brightness(0) saturate(100%) invert(39%) sepia(68%) saturate(2494%) hue-rotate(333deg) brightness(92%) contrast(88%);
                        }
                        .stat-item {
                            cursor: pointer;
                        }
                    `}</style>
                </div>
            </Link>

            {/* ═══════════════════════════════════════ */}
            {/* ═══ COMMENTS / REVIEWS POPUP ═══ */}
            {/* ═══════════════════════════════════════ */}
            {showComments && (
                <CommentsPopup
                    productId={productId}
                    productName={product.name}
                    productImage={product.image}
                    onClose={() => setShowComments(false)}
                />
            )}

            {/* ═══════════════════════════════════════ */}
            {/* ═══ SHARE POPUP ═══ */}
            {/* ═══════════════════════════════════════ */}
            {showShare && (
                <div
                    className='fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4'
                    onClick={() => setShowShare(false)}
                >
                    <div
                        className='bg-white rounded-lg w-full max-w-[420px] overflow-hidden shadow-2xl'
                        onClick={(e) => e.stopPropagation()}
                        style={{ animation: 'fbModalIn 0.2s ease-out' }}
                    >
                        {/* Header — FB style */}
                        <div className='flex items-center justify-between px-4 py-3 border-b border-gray-200'>
                            <h3 className='text-base font-bold text-gray-900'>Share Product</h3>
                            <button
                                onClick={() => setShowShare(false)}
                                className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors'
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        {/* Product preview — like a FB post */}
                        <div className='px-4 py-3 border-b border-gray-100'>
                            <div className='flex items-center gap-3'>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className='w-12 h-12 rounded-lg object-cover'
                                />
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm font-semibold text-gray-900 truncate'>{product.name}</p>
                                    <p className='text-xs text-[#E4525C] font-medium'>Tk.{currentPrice.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Grid */}
                        <div className='px-4 py-4'>
                            <div className='grid grid-cols-4 gap-3'>
                                {shareLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className='flex flex-col items-center gap-1.5 py-2 rounded-lg hover:bg-gray-50 transition-colors'
                                    >
                                        <div
                                            className='w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110'
                                            style={{ background: social.color }}
                                        >
                                            <social.icon size={16} />
                                        </div>
                                        <span className='text-[10px] font-medium text-gray-600'>{social.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Copy Link Bar */}
                        <div className='px-4 pb-4'>
                            <div className='flex items-center bg-gray-100 rounded-lg overflow-hidden'>
                                <input
                                    type="text"
                                    readOnly
                                    value={productUrl}
                                    className='flex-1 bg-transparent text-xs text-gray-600 outline-none px-3 py-2.5 truncate'
                                />
                                <button
                                    onClick={handleCopyLink}
                                    className='px-4 py-2.5 bg-[#0B4222] text-white text-xs font-semibold hover:bg-[#093519] transition-colors flex items-center gap-1.5 whitespace-nowrap'
                                >
                                    {linkCopied ? (
                                        <><FiCheck size={13} /> Copied!</>
                                    ) : (
                                        <><FiCopy size={13} /> Copy</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <style>{`
                        @keyframes fbModalIn {
                            from { transform: scale(0.95) translateY(10px); opacity: 0; }
                            to { transform: scale(1) translateY(0); opacity: 1; }
                        }
                    `}</style>
                </div>
            )}
        </>
    );
};


/* ═══════════════════════════════════════════════ */
/* ═══ COMMENTS POPUP — with write comment ═══ */
/* ═══════════════════════════════════════════════ */
const CommentsPopup: React.FC<{
    productId: string;
    productName: string;
    productImage: string;
    onClose: () => void;
}> = ({ productId, productName, productImage, onClose }) => {
    const { data: reviewsData, isLoading } = useGetProductReviewsQuery({ productId });
    const [publicCreateReview] = usePublicCreateReviewMutation();
    const reviews = reviewsData?.data || [];

    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [userName, setUserName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;
        setIsSubmitting(true);
        try {
            await publicCreateReview({
                product: productId,
                rating: newRating,
                comment: newComment.trim(),
                userName: userName.trim() || 'Anonymous'
            }).unwrap();
            setNewComment('');
            setUserName('');
            setNewRating(5);
            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to submit review:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className='fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4'
            onClick={onClose}
        >
            <div
                className='bg-white rounded-lg w-full max-w-[620px] max-h-[88vh] flex flex-col overflow-hidden shadow-2xl'
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'fbModalIn 0.2s ease-out' }}
            >
                {/* ── Header ── */}
                <div className='flex items-center justify-between px-4 py-2.5 border-b border-gray-200 shrink-0'>
                    <h3 className='text-[15px] font-bold text-gray-900 truncate pr-4'>{productName}</h3>
                    <button
                        onClick={onClose}
                        className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors shrink-0'
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {/* ── Product image — full view ── */}
                <div className='shrink-0 border-b border-gray-200'>
                    <div className='w-full bg-gray-50 flex items-center justify-center' style={{ maxHeight: '280px' }}>
                        <img
                            src={productImage}
                            alt={productName}
                            className='w-full object-contain'
                            style={{ maxHeight: '280px' }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/620x200/f3f4f6/9ca3af?text=No+Image';
                            }}
                        />
                    </div>
                    {/* Stats bar */}
                    <div className='flex items-center justify-between px-4 py-1.5 text-xs text-gray-500'>
                        <span>{reviews.length} {reviews.length === 1 ? 'Comment' : 'Comments'}</span>
                    </div>
                </div>

                {/* ── Comments List — scrollable ── */}
                <div className='flex-1 overflow-y-auto px-4 py-2 space-y-1.5' style={{ minHeight: '60px' }}>
                    {isLoading ? (
                        <div className='flex items-center justify-center py-8'>
                            <div className='w-6 h-6 border-2 border-gray-200 border-t-[#0B4222] rounded-full animate-spin' />
                        </div>
                    ) : reviews.length > 0 ? (
                        <>
                            <p className='text-[11px] font-semibold text-gray-400 uppercase tracking-wide'>Most relevant</p>
                            {reviews.map((review: any, idx: number) => (
                                <div key={idx} className='flex gap-2'>
                                    <div className='w-7 h-7 rounded-full bg-gradient-to-br from-[#0B4222] to-[#16a34a] flex items-center justify-center text-white text-[10px] font-bold shrink-0'>
                                        {(review.userName || review.user?.firstName || review.user?.name || 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='bg-gray-100 rounded-2xl px-3 py-1.5'>
                                            <span className='text-[11px] font-semibold text-gray-900'>
                                                {review.userName || review.user?.name || `${review.user?.firstName || ''} ${review.user?.lastName || ''}`.trim() || 'Anonymous'}
                                            </span>
                                            {review.comment && (
                                                <p className='text-[11px] text-gray-700 leading-snug'>{review.comment}</p>
                                            )}
                                        </div>
                                        <div className='flex items-center gap-3 px-3 mt-0.5 text-[10px] text-gray-400'>
                                            <span className='flex gap-0.5'>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <FiStar key={star} size={9} style={{
                                                        color: '#f59e0b',
                                                        fill: star <= (review.rating || 0) ? '#f59e0b' : 'none'
                                                    }} />
                                                ))}
                                            </span>
                                            <span className='font-medium hover:underline cursor-pointer'>Like</span>
                                            <span className='font-medium hover:underline cursor-pointer'>Reply</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className='text-center py-6'>
                            <p className='text-sm text-gray-500'>No comments yet</p>
                            <p className='text-xs text-gray-400 mt-1'>Be the first to comment!</p>
                        </div>
                    )}
                </div>

                {/* ── Comment Input — bottom bar ── */}
                <div className='border-t border-gray-200 px-4 py-2.5 shrink-0 bg-white'>
                    {submitSuccess && (
                        <div className='mb-2 text-center text-xs text-green-600 font-medium bg-green-50 py-1.5 rounded-lg'>
                            ✅ Comment posted!
                        </div>
                    )}

                    <div className='flex items-start gap-2.5'>
                        {/* Avatar — updates live with typed name */}
                        <div className='w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5'>
                            {userName ? userName.charAt(0).toUpperCase() : '?'}
                        </div>

                        {/* Name + Comment + Rating — all in one compact block */}
                        <div className='flex-1 min-w-0 bg-gray-100 rounded-2xl px-3 py-1.5'>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Your name"
                                className='w-full bg-transparent text-[12px] text-gray-900 font-normal placeholder-gray-400 placeholder:font-normal outline-none pb-1 border-b border-gray-300/50'
                            />
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && newComment.trim()) handleSubmitComment(); }}
                                placeholder="Write a comment..."
                                className='w-full bg-transparent text-[12px] text-gray-700 font-normal placeholder-gray-400 placeholder:font-normal outline-none pt-1'
                            />
                            {/* Rating + Send row */}
                            <div className='flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-200/60'>
                                <div className='flex items-center gap-1.5'>
                                    <span className='text-[11px] text-gray-400'>Rating</span>
                                    <div className='flex gap-px'>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                onClick={() => setNewRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className='p-px transition-transform hover:scale-125'
                                            >
                                                <FiStar size={13} style={{
                                                    color: '#f59e0b',
                                                    fill: star <= (hoverRating || newRating) ? '#f59e0b' : 'none',
                                                    transition: 'all 0.15s ease'
                                                }} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={handleSubmitComment}
                                    disabled={!newComment.trim() || isSubmitting}
                                    className='text-[#0B4222] font-semibold text-[13px] hover:text-[#093519] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1'
                                >
                                    {isSubmitting ? (
                                        <div className='w-4 h-4 border-2 border-gray-300 border-t-[#0B4222] rounded-full animate-spin' />
                                    ) : (
                                        <><FiSend size={13} /> Post</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fbModalIn {
                    from { transform: scale(0.95) translateY(10px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default NewProductCard;
