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
    FiSettings,
    FiChevronRight,
    FiClock,
    FiCheckCircle,
    FiTruck,
    FiDollarSign,
} from 'react-icons/fi';
import { useGetMyOrdersQuery } from '@/redux/api/orderApi';
import { useGetWishlistQuery } from '@/redux/api/userApi';

const StatusBadge = ({ status }: { status: string }) => {
    const config: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
        pending: { bg: 'bg-amber-50', text: 'text-amber-700', icon: FiClock },
        confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', icon: FiCheckCircle },
        processing: { bg: 'bg-purple-50', text: 'text-purple-700', icon: FiPackage },
        shipped: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: FiTruck },
        delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: FiCheckCircle },
        cancelled: { bg: 'bg-red-50', text: 'text-red-700', icon: FiPackage },
    };
    const { bg, text, icon: Icon } = config[status] || config.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold capitalize ${bg} ${text}`}>
            <Icon size={12} />
            {status}
        </span>
    );
};

const UserDashboard = () => {
    const { user } = useAppSelector((state) => state.auth);
    const { data: ordersData, isLoading: ordersLoading } = useGetMyOrdersQuery({ limit: 5 });
    const { data: wishlistData, isLoading: wishlistLoading } = useGetWishlistQuery({});

    const orders = ordersData?.data || [];
    const wishlistCount = wishlistData?.data?.length || 0;
    const totalOrders = ordersData?.meta?.total || orders.length || 0;
    const totalSpent = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

    const menuItems = [
        {
            icon: FiShoppingBag,
            label: 'My Orders',
            href: '/dashboard/user/orders',
            description: 'Track, return, or buy things again',
            color: 'bg-blue-50 text-blue-600',
            stat: totalOrders,
        },
        {
            icon: FiHeart,
            label: 'Wishlist',
            href: '/dashboard/user/wishlist',
            description: 'Your saved items',
            color: 'bg-rose-50 text-rose-600',
            stat: wishlistCount,
        },
        {
            icon: FiMapPin,
            label: 'Addresses',
            href: '/dashboard/user/addresses',
            description: 'Manage your delivery addresses',
            color: 'bg-green-50 text-green-600',
        },
        {
            icon: FiUser,
            label: 'Profile Settings',
            href: '/dashboard/user/profile',
            description: 'Update your personal information',
            color: 'bg-orange-50 text-orange-600',
        },
        {
            icon: FiSettings,
            label: 'Account Settings',
            href: '/dashboard/user/settings',
            description: 'Password, notifications & more',
            color: 'bg-gray-100 text-gray-600',
        },
    ];

    const stats = [
        { label: 'Total Orders', value: totalOrders, color: 'text-[#0B4222]', bg: 'bg-[#0B4222]/5', icon: FiShoppingBag },
        { label: 'Wishlist', value: wishlistCount, color: 'text-rose-500', bg: 'bg-rose-50', icon: FiHeart },
        { label: 'Total Spent', value: `৳${totalSpent.toLocaleString()}`, color: 'text-purple-600', bg: 'bg-purple-50', icon: FiDollarSign },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B4222] to-[#1a6b3c] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-[#0B4222]/20">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                        </h1>
                        <p className="text-gray-400 text-sm mt-0.5">Here&apos;s what&apos;s happening with your account</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={22} />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${stat.color} leading-none`}>
                                    {ordersLoading ? '...' : stat.value}
                                </p>
                                <p className="text-xs text-gray-400 font-semibold mt-1 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Menu Grid */}
            <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <item.icon size={22} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-gray-800 group-hover:text-[#0B4222] transition-colors">
                                            {item.label}
                                        </h3>
                                        {item.stat !== undefined && (
                                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                                {item.stat}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                                </div>
                                <FiChevronRight className="text-gray-200 group-hover:text-[#0B4222] group-hover:translate-x-1 transition-all mt-1" size={18} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Orders */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
                    <Link href="/dashboard/user/orders" className="text-sm text-[#0B4222] font-semibold hover:underline">
                        View All →
                    </Link>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {ordersLoading ? (
                        <div className="p-8 text-center">
                            <div className="w-8 h-8 border-3 border-[#0B4222]/20 border-t-[#0B4222] rounded-full animate-spin mx-auto"></div>
                            <p className="text-sm text-gray-400 mt-3">Loading orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="p-10 text-center">
                            <FiPackage size={40} className="mx-auto text-gray-200 mb-4" />
                            <h3 className="font-bold text-gray-600 mb-1">No orders yet</h3>
                            <p className="text-sm text-gray-400 mb-4">Start shopping to see your orders here</p>
                            <Link href="/" className="inline-block px-6 py-2.5 bg-[#0B4222] text-white rounded-xl font-semibold text-sm hover:bg-[#093519] transition-all shadow-md shadow-[#0B4222]/20">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {orders.slice(0, 5).map((order: any) => (
                                <Link
                                    key={order._id}
                                    href={`/dashboard/user/orders/${order._id}`}
                                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                                            <FiPackage size={18} className="text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{order.orderNumber || `#${order._id?.slice(-8).toUpperCase()}`}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {order.items?.length || 0} items • {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-bold text-gray-800">৳{order.total?.toLocaleString()}</p>
                                        </div>
                                        <StatusBadge status={order.status} />
                                        <FiChevronRight size={16} className="text-gray-300 group-hover:text-[#0B4222] group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
