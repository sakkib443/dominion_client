"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiChevronDown, FiMenu } from 'react-icons/fi';
import { useAppSelector } from '@/redux';

const MinHeader: React.FC = () => {
    const cartItems = useAppSelector(state => state.cart.items);
    const wishlistItems = useAppSelector(state => state.wishlist.items);
    const auth = useAppSelector(state => state.auth);
    const { user, isAuthenticated } = auth;

    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="bg-white py-4 sticky top-0 z-40 shadow-sm">
            <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
                <div className="flex items-center justify-between gap-8">
                    {/* Logo Area */}
                    <Link href="/" className="flex-shrink-0">
                        <Image src="/logo.svg" alt="Logo" width={180} height={50} style={{ width: '180px', height: 'auto' }} />
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-xl">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-3 pl-5 pr-12 text-sm border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all"
                            />
                            <button className="absolute right-1 top-1 bottom-1 px-4 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary)]/90 transition-colors">
                                <FiSearch size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Actions Area */}
                    <div className="flex items-center gap-1">
                        {/* Mobile Search */}
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="md:hidden w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <FiSearch size={20} />
                        </button>

                        {/* Wishlist */}
                        <Link href="/dashboard/user/wishlist" className="relative w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[var(--color-primary)] transition-colors">
                            <FiHeart size={20} />
                            {wishlistItems.length > 0 && (
                                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-semibold">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" className="relative flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-[var(--color-primary)] transition-colors">
                            <div className="relative">
                                <FiShoppingCart size={20} />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--color-primary)] text-white text-[9px] rounded-full flex items-center justify-center font-semibold">
                                        {cartItems.length}
                                    </span>
                                )}
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-[10px] text-gray-400 uppercase">Cart</p>
                                <p className="text-sm font-semibold text-gray-800">৳{cartTotal.toLocaleString()}</p>
                            </div>
                        </Link>

                        {/* Divider */}
                        <div className="hidden lg:block w-px h-8 bg-gray-200 mx-2"></div>

                        {/* User Account */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-2 py-2 text-gray-600 hover:text-[var(--color-primary)] transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold">
                                    {isAuthenticated ? user?.name?.charAt(0).toUpperCase() : <FiUser size={16} />}
                                </div>
                                <div className="hidden xl:block text-left">
                                    <p className="text-[10px] text-gray-400 uppercase">Account</p>
                                    <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                        {isAuthenticated ? user?.name.split(' ')[0] : 'Login'} <FiChevronDown size={12} />
                                    </p>
                                </div>
                            </button>

                            {/* Dropdown Card */}
                            <div className="absolute right-0 top-full w-56 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50 overflow-hidden">
                                {!isAuthenticated ? (
                                    <div className="p-5">
                                        <h4 className="text-base font-semibold text-gray-800 mb-1">Welcome!</h4>
                                        <p className="text-xs text-gray-500 mb-4">Access your account & orders</p>
                                        <div className="flex gap-2">
                                            <Link href="/login" className="flex-1 py-2 text-center text-xs font-semibold bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary)]/90 transition-colors">
                                                Sign In
                                            </Link>
                                            <Link href="/register" className="flex-1 py-2 text-center text-xs font-semibold border border-gray-200 text-gray-700 rounded-md hover:border-gray-300 transition-colors">
                                                Join
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                                        <p className="text-[10px] text-gray-400 uppercase">Signed in as</p>
                                        <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
                                    </div>
                                )}
                                <div className="py-1">
                                    {isAuthenticated && user?.role === 'admin' && (
                                        <Link href="/dashboard/admin" className="block px-4 py-2.5 text-sm text-[var(--color-primary)] bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 transition-colors">
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    {[
                                        { label: 'My Profile', href: '/account' },
                                        { label: 'Order History', href: '/orders' },
                                        { label: 'Wishlist', href: '/wishlist' },
                                        { label: 'Support', href: '#' }
                                    ].map((item, idx) => (
                                        <Link key={idx} href={item.href} className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Search */}
                {showSearch && (
                    <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full py-3 px-4 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-[var(--color-primary)] text-sm"
                            />
                            <button className="absolute right-1 top-1 bottom-1 px-4 bg-[var(--color-primary)] text-white rounded-md">
                                <FiSearch size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MinHeader;
