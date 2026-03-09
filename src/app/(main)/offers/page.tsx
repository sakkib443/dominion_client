"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/shared/ProductCard';
import {
    FiZap,
    FiPercent,
    FiCopy,
    FiCheckCircle,
    FiArrowRight,
    FiClock,
    FiStar,
    FiGift,
    FiAward,
    FiBox,
    FiShield,
    FiTruck
} from 'react-icons/fi';

const flashProducts = [
    { id: 1, name: 'Floral Summer Dress', image: 'https://portotheme.com/html/wolmart/assets/images/demos/demo1/products/2-1.jpg', price: 45.00, originalPrice: 65.00, rating: 5, reviews: 12, category: 'Fashion' },
    { id: 2, name: 'Elegant Evening Gown', image: 'https://portotheme.com/html/wolmart/assets/images/demos/demo1/products/2-2.jpg', price: 120.00, originalPrice: 150.00, discount: 20, rating: 5, reviews: 8, category: 'Fashion' },
    { id: 11, name: 'Premium Leather Backpack', image: 'https://portotheme.com/html/wolmart/assets/images/demos/demo1/products/1-2.jpg', price: 85.00, originalPrice: 110.00, discount: 22, rating: 5, reviews: 24, category: 'Accessories' },
    { id: 14, name: 'Minimalist Black Cap', image: 'https://portotheme.com/html/wolmart/assets/images/demos/demo1/products/1-1.jpg', price: 18.00, originalPrice: 25.00, discount: 28, rating: 4.2, reviews: 18, category: 'Accessories' },
];

const vouchers = [
    { code: 'MEGA2024', label: 'Storewide', value: '25% OFF', desc: 'Valid on all orders above ৳2000' },
    { code: 'FREESHIP', label: 'Delivery', value: 'FREE', desc: 'No delivery charges on any order' },
    { code: 'WELCOME', label: 'New User', value: '৳500 OFF', desc: 'On your first purchase' },
];

export default function SpecialOffersPage() {
    const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 0 });
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.s > 0) return { ...prev, s: prev.s - 1 };
                if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
                if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className="bg-gray-50/50 min-h-screen pb-16 font-sans">
            {/* Minimal Header Section */}
            <div className="bg-white border-b border-gray-100 mb-8">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-xs font-bold mb-3 uppercase tracking-wider">
                                <FiZap size={14} className="fill-[var(--color-primary)]" />
                                Instant Deals
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Special Offers & Vouchers</h1>
                            <p className="text-gray-500 text-sm mt-1">Handpicked discounts and limited time deals just for you.</p>
                        </div>

                        {/* Soft & Minimalist Flash Timer */}
                        <div className="flex items-center gap-3 bg-white border border-gray-100 px-4 py-2.5 rounded-md shadow-sm">
                            <div className="flex items-center gap-2 border-r border-gray-100 pr-3">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Ends In</span>
                            </div>
                            <div className="flex gap-4">
                                {[
                                    { val: timeLeft.h, unit: 'h' },
                                    { val: timeLeft.m, unit: 'm' },
                                    { val: timeLeft.s, unit: 's' }
                                ].map((t, idx) => (
                                    <div key={idx} className="flex items-center gap-1">
                                        <span className="text-base font-black text-gray-900 tabular-nums tracking-tight">
                                            {t.val.toString().padStart(2, '0')}
                                        </span>
                                        <span className="text-[9px] font-bold text-[var(--color-primary)] uppercase">
                                            {t.unit}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 space-y-12">
                {/* Vouchers: Professional Grid */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-1.5 h-6 bg-[var(--color-primary)] rounded-full"></div>
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wider">Available Coupons</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {vouchers.map((v) => (
                            <div key={v.code} className="bg-white group border border-gray-100 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-gray-200/50 relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{v.label}</span>
                                        <h3 className="text-2xl font-bold text-gray-900 mt-2">{v.value}</h3>
                                    </div>
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                        <FiGift size={20} />
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 mb-6 font-medium leading-relaxed">{v.desc}</p>

                                <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                                    <code className="text-sm font-bold text-gray-700 font-mono tracking-wider">{v.code}</code>
                                    <button
                                        onClick={() => copyCode(v.code)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${copiedCode === v.code
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-900 hover:text-white hover:border-gray-900 shadow-sm'
                                            }`}
                                    >
                                        {copiedCode === v.code ? 'COPIED!' : 'COPY CODE'}
                                    </button>
                                </div>

                                {/* Circular cutouts for coupon look */}
                                <div className="absolute top-1/2 -left-2.5 w-5 h-5 bg-gray-50 rounded-full"></div>
                                <div className="absolute top-1/2 -right-2.5 w-5 h-5 bg-gray-50 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Banner Showcase: Sleek & Clean */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="relative h-64 rounded-3xl overflow-hidden group">
                        <img
                            src="https://portotheme.com/html/wolmart/assets/images/demos/demo1/banners/2.jpg"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt="Fashion Offer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent p-10 flex flex-col justify-center text-white">
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full mb-3">Limited Collection</span>
                            <h3 className="text-3xl font-bold mb-4">Winter Clearance <br /><span className="text-[var(--color-primary)]">60% FLAT OFF</span></h3>
                            <Link href="/shop" className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all w-fit">
                                Shop Now <FiArrowRight />
                            </Link>
                        </div>
                    </div>

                    <div className="relative h-64 rounded-3xl overflow-hidden group">
                        <img
                            src="https://portotheme.com/html/wolmart/assets/images/demos/demo1/banners/3.jpg"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt="Tech Offer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-gray-900/20 to-transparent p-10 flex flex-col justify-center text-white">
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full mb-3">Gadget Mania</span>
                            <h3 className="text-3xl font-bold mb-4">UP TO $200 CASHBACK <br /><span className="text-sky-400">On Latest Techo</span></h3>
                            <Link href="/shop" className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all w-fit">
                                Browse Gear <FiArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Flash Deals: Tight Grid */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-red-500 rounded-full animate-pulse"></div>
                            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wider">Top Flash Deals</h2>
                        </div>
                        <Link href="/shop" className="text-xs font-bold text-gray-400 hover:text-[var(--color-primary)] transition-colors uppercase tracking-widest flex items-center gap-2">
                            View All Items <FiArrowRight />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {flashProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>

                {/* Trust Services: Minimal Badges */}
                <div className="bg-white border border-gray-100 rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { icon: <FiShield className="text-gray-400" />, label: "Secure Payment", desc: "100% Secure Transaction" },
                        { icon: <FiBox className="text-gray-400" />, label: "Quality Check", desc: "Expert Verified Products" },
                        { icon: <FiTruck className="text-gray-400" />, label: "Fast Shipping", desc: "Across the country" },
                        { icon: <FiStar className="text-gray-400" />, label: "Top Rated", desc: "4.8 User ratings" }
                    ].map((s, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl mb-4 text-gray-400 group-hover:bg-[var(--color-primary)] transition-all">
                                {s.icon}
                            </div>
                            <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-1">{s.label}</h4>
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
