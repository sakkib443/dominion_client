"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAppDispatch } from '@/redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { useGetProductReviewsQuery, useCreateReviewMutation } from '@/redux/api/reviewApi';
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
                                className='relative text-gray-600 hover:text-[#0B4222] transition-all p-2 cart-icon-animate rounded-full bg-[#0B4222]/30 hover:bg-[#0B4222]/40'
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
                        {/* Heart / Like — unlimited clicks */}
                        <button
                            onClick={handleLike}
                            className='flex items-center gap-1 hover:text-[#E4525C] transition-colors'
                        >
                            <img
                                src="/ICON/like.png"
                                alt="Like"
                                className="w-3.5 h-3.5 opacity-50 transition-transform"
                                style={{ transform: likeAnim ? 'scale(1.5)' : 'scale(1)' }}
                            />
                            <span style={{ color: localLikes > 0 ? '#E4525C' : undefined, fontWeight: localLikes > 0 ? 600 : undefined }}>
                                {formatCount(stats.likes + localLikes)}
                            </span>
                        </button>

                        {/* Comments */}
                        <button
                            onClick={handleCommentsClick}
                            className='flex items-center gap-1 hover:text-[#0B4222] transition-colors'
                        >
                            <img src="/ICON/comments.png" alt="Comments" className="w-3.5 h-3.5 opacity-50" />
                            <span>{formatCount(stats.comments)}</span>
                        </button>

                        {/* Shares */}
                        <button
                            onClick={handleShareClick}
                            className='flex items-center gap-1 hover:text-[#0B4222] transition-colors'
                        >
                            <img src="/ICON/share.png" alt="Share" className="w-3.5 h-3.5 opacity-50" />
                            <span>{formatCount(stats.shares)}</span>
                        </button>

                        {/* Views */}
                        <span className='flex items-center gap-1'>
                            <img src="/ICON/views.png" alt="Views" className="w-3.5 h-3.5 opacity-50" />
                            <span>{formatCount(stats.views)}</span>
                        </span>
                    </div>
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
                    className='fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4'
                    onClick={() => setShowShare(false)}
                >
                    <div
                        className='bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden'
                        onClick={(e) => e.stopPropagation()}
                        style={{ animation: 'popIn 0.25s ease-out' }}
                    >
                        {/* Header with product preview */}
                        <div className='px-5 pt-5 pb-3'>
                            <div className='flex items-center justify-between mb-4'>
                                <h3 className='text-lg font-bold text-gray-800'>Share On</h3>
                                <button
                                    onClick={() => setShowShare(false)}
                                    className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors'
                                >
                                    <FiX size={20} />
                                </button>
                            </div>
                            {/* Product mini-preview */}
                            <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-1'>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className='w-12 h-12 rounded-lg object-cover border border-gray-200'
                                />
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm font-semibold text-gray-800 truncate'>{product.name}</p>
                                    <p className='text-xs text-[#E4525C] font-medium'>Tk.{currentPrice.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Grid */}
                        <div className='px-5 py-4'>
                            <div className='grid grid-cols-4 gap-3'>
                                {shareLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className='flex flex-col items-center gap-1.5 py-2 rounded-xl hover:bg-gray-50 transition-all group/s'
                                    >
                                        <div
                                            className='w-11 h-11 rounded-full flex items-center justify-center text-white shadow-sm transition-transform group-hover/s:scale-110'
                                            style={{ background: social.color }}
                                        >
                                            <social.icon size={18} />
                                        </div>
                                        <span className='text-[10px] font-medium text-gray-500'>{social.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Copy Link Bar */}
                        <div className='px-5 pb-5'>
                            <div className='flex items-center gap-2 bg-gray-100 rounded-xl p-2'>
                                <input
                                    type="text"
                                    readOnly
                                    value={productUrl}
                                    className='flex-1 bg-transparent text-xs text-gray-600 outline-none px-2 truncate'
                                />
                                <button
                                    onClick={handleCopyLink}
                                    className='px-4 py-2 bg-[#0B4222] text-white text-xs font-semibold rounded-lg hover:bg-[#093519] transition-colors flex items-center gap-1.5 whitespace-nowrap'
                                >
                                    {linkCopied ? (
                                        <><FiCheck size={14} /> Copied!</>
                                    ) : (
                                        <><FiCopy size={14} /> Copy</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Animation keyframes */}
                    <style>{`
                        @keyframes popIn {
                            from { transform: scale(0.9); opacity: 0; }
                            to { transform: scale(1); opacity: 1; }
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
    const [createReview] = useCreateReviewMutation();
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
            await createReview({
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
            className='fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4'
            onClick={onClose}
        >
            <div
                className='bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden'
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'popIn 0.25s ease-out' }}
            >
                {/* Header */}
                <div className='flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0'>
                    <img src={productImage} alt="" className='w-10 h-10 rounded-lg object-cover border border-gray-200' />
                    <div className='flex-1 min-w-0'>
                        <h3 className='text-sm font-bold text-gray-800'>Ratings & Reviews</h3>
                        <p className='text-xs text-gray-400 truncate'>{productName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors'
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {/* Reviews List — scrollable */}
                <div className='flex-1 overflow-y-auto p-5 space-y-3'>
                    {isLoading ? (
                        <div className='flex flex-col items-center py-10 gap-3'>
                            <div className='w-8 h-8 border-2 border-gray-200 border-t-[#0B4222] rounded-full animate-spin' />
                            <p className='text-sm text-gray-400'>Loading reviews...</p>
                        </div>
                    ) : reviews.length > 0 ? (
                        reviews.map((review: any, idx: number) => (
                            <div key={idx} className='p-3.5 bg-gray-50 rounded-xl'>
                                <div className='flex items-center justify-between mb-2'>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-7 h-7 rounded-full bg-[#0B4222]/10 flex items-center justify-center text-[#0B4222] text-xs font-bold'>
                                            {(review.userName || review.user?.name || 'A').charAt(0).toUpperCase()}
                                        </div>
                                        <span className='font-semibold text-sm text-gray-700'>
                                            {review.userName || review.user?.name || 'Anonymous'}
                                        </span>
                                    </div>
                                    <div className='flex gap-0.5'>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <FiStar key={star} size={11} style={{
                                                color: '#f59e0b',
                                                fill: star <= (review.rating || 0) ? '#f59e0b' : 'none'
                                            }} />
                                        ))}
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className='text-xs text-gray-600 leading-relaxed pl-9'>{review.comment}</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className='text-center py-8'>
                            <div className='text-4xl mb-3'>💬</div>
                            <p className='text-sm font-medium text-gray-600'>No reviews yet</p>
                            <p className='text-xs text-gray-400 mt-1'>Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>

                {/* Write Comment Section — always visible at bottom */}
                <div className='border-t border-gray-100 px-5 py-4 shrink-0 bg-white'>
                    {submitSuccess && (
                        <div className='mb-3 text-center text-xs text-green-600 font-medium bg-green-50 py-2 rounded-lg'>
                            ✅ Your review has been submitted!
                        </div>
                    )}

                    {/* Star Rating Selector */}
                    <div className='flex items-center gap-2 mb-3'>
                        <span className='text-xs text-gray-500 font-medium'>Rating:</span>
                        <div className='flex gap-0.5'>
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setNewRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className='p-0.5 transition-transform hover:scale-125'
                                >
                                    <FiStar size={16} style={{
                                        color: '#f59e0b',
                                        fill: star <= (hoverRating || newRating) ? '#f59e0b' : 'none',
                                        transition: 'all 0.15s ease'
                                    }} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name Input */}
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Your name (optional)"
                        className='w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-[#0B4222]/30 focus:ring-1 focus:ring-[#0B4222]/20 mb-2 transition-colors'
                    />

                    {/* Comment Input + Send */}
                    <div className='flex items-end gap-2'>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write your review..."
                            rows={2}
                            className='flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-[#0B4222]/30 focus:ring-1 focus:ring-[#0B4222]/20 resize-none transition-colors'
                        />
                        <button
                            onClick={handleSubmitComment}
                            disabled={!newComment.trim() || isSubmitting}
                            className='w-10 h-10 rounded-xl bg-[#0B4222] text-white flex items-center justify-center hover:bg-[#093519] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0'
                        >
                            {isSubmitting ? (
                                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                            ) : (
                                <FiSend size={16} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes popIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default NewProductCard;
