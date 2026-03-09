"use client";

import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import Link from 'next/link';
import {
    FiPackage,
    FiHeart,
    FiMapPin,
    FiUser,
    FiShoppingBag,
    FiCreditCard,
    FiSettings,
    FiLogOut,
    FiChevronRight
} from 'react-icons/fi';

const UserDashboard = () => {
    const { user } = useAppSelector((state) => state.auth);

    const menuItems = [
        {
            icon: FiShoppingBag,
            label: 'My Orders',
            href: '/dashboard/user/orders',
            description: 'Track, return, or buy things again',
            color: 'bg-blue-50 text-blue-600'
        },
        {
            icon: FiHeart,
            label: 'Wishlist',
            href: '/dashboard/user/wishlist',
            description: 'Your saved items',
            color: 'bg-rose-50 text-rose-600'
        },
        {
            icon: FiMapPin,
            label: 'Addresses',
            href: '/dashboard/user/addresses',
            description: 'Manage your delivery addresses',
            color: 'bg-green-50 text-green-600'
        },
        {
            icon: FiCreditCard,
            label: 'Payment Methods',
            href: '/dashboard/user/payments',
            description: 'Manage payment options',
            color: 'bg-purple-50 text-purple-600'
        },
        {
            icon: FiUser,
            label: 'Profile Settings',
            href: '/dashboard/user/profile',
            description: 'Update your personal information',
            color: 'bg-orange-50 text-orange-600'
        },
        {
            icon: FiSettings,
            label: 'Account Settings',
            href: '/dashboard/user/settings',
            description: 'Password, notifications & more',
            color: 'bg-gray-100 text-gray-600'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                            {user?.firstName?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Hello, {user?.firstName || 'User'}!
                            </h1>
                            <p className="text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                        <div className="text-3xl font-bold text-[var(--color-primary)]">0</div>
                        <div className="text-sm text-gray-500 mt-1">Total Orders</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                        <div className="text-3xl font-bold text-rose-500">0</div>
                        <div className="text-sm text-gray-500 mt-1">Wishlist Items</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                        <div className="text-3xl font-bold text-green-500">0</div>
                        <div className="text-sm text-gray-500 mt-1">Reviews Given</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                        <div className="text-3xl font-bold text-purple-500">৳0</div>
                        <div className="text-sm text-gray-500 mt-1">Total Spent</div>
                    </div>
                </div>
            </div>

            {/* Menu Grid */}
            <div className="max-w-6xl mx-auto px-4 pb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Account Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center`}>
                                    <item.icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 group-hover:text-[var(--color-primary)] transition-colors">
                                        {item.label}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                </div>
                                <FiChevronRight className="text-gray-300 group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" size={20} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Orders */}
            <div className="max-w-6xl mx-auto px-4 pb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
                    <Link href="/dashboard/user/orders" className="text-sm text-[var(--color-primary)] font-semibold hover:underline">
                        View All
                    </Link>
                </div>
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-8 text-center">
                    <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="font-bold text-gray-600">No orders yet</h3>
                    <p className="text-sm text-gray-400 mt-1">Start shopping to see your orders here</p>
                    <Link href="/shop" className="inline-block mt-4 px-6 py-2 bg-[var(--color-primary)] text-white rounded-md font-semibold hover:opacity-90 transition-all">
                        Start Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
