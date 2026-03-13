"use client";

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import {
    FiSettings,
    FiBell,
    FiShield,
    FiLogOut,
    FiToggleLeft,
    FiToggleRight,
    FiAlertTriangle,
    FiTrash2,
} from 'react-icons/fi';

export default function SettingsPage() {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        promotions: false,
        newsletter: true,
        sms: false,
    });

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        router.push('/');
    };

    const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
        <button onClick={onChange} className="focus:outline-none">
            {enabled ? (
                <FiToggleRight size={28} className="text-[#0B4222]" />
            ) : (
                <FiToggleLeft size={28} className="text-gray-300" />
            )}
        </button>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-sm text-gray-400 mt-1">Manage your account preferences</p>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                    <FiBell size={18} className="text-[#0B4222]" />
                    <h2 className="text-base font-bold text-gray-800">Notification Preferences</h2>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-50">
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Order Updates</p>
                            <p className="text-xs text-gray-400 mt-0.5">Get notified about your order status</p>
                        </div>
                        <Toggle enabled={notifications.orderUpdates} onChange={() => setNotifications(n => ({ ...n, orderUpdates: !n.orderUpdates }))} />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-50">
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Promotions & Deals</p>
                            <p className="text-xs text-gray-400 mt-0.5">Receive offers and discount notifications</p>
                        </div>
                        <Toggle enabled={notifications.promotions} onChange={() => setNotifications(n => ({ ...n, promotions: !n.promotions }))} />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-50">
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Newsletter</p>
                            <p className="text-xs text-gray-400 mt-0.5">Weekly newsletter with trending products</p>
                        </div>
                        <Toggle enabled={notifications.newsletter} onChange={() => setNotifications(n => ({ ...n, newsletter: !n.newsletter }))} />
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-700">SMS Notifications</p>
                            <p className="text-xs text-gray-400 mt-0.5">Receive updates via SMS</p>
                        </div>
                        <Toggle enabled={notifications.sms} onChange={() => setNotifications(n => ({ ...n, sms: !n.sms }))} />
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                    <FiShield size={18} className="text-[#0B4222]" />
                    <h2 className="text-base font-bold text-gray-800">Security</h2>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Email</p>
                            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-lg">Verified</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Password</p>
                            <p className="text-xs text-gray-400 mt-0.5">Last changed: Unknown</p>
                        </div>
                        <a href="/dashboard/user/profile" className="text-xs font-bold text-[#0B4222] hover:underline">
                            Change
                        </a>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                    <FiAlertTriangle size={18} className="text-red-500" />
                    <h2 className="text-base font-bold text-red-600">Danger Zone</h2>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-red-50/30 rounded-xl border border-red-50">
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Logout</p>
                            <p className="text-xs text-gray-400 mt-0.5">Sign out from your account</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-semibold hover:bg-gray-900 transition-all flex items-center gap-2"
                        >
                            <FiLogOut size={14} />
                            Logout
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50/30 rounded-xl border border-red-50">
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Delete Account</p>
                            <p className="text-xs text-gray-400 mt-0.5">Permanently delete your account and data</p>
                        </div>
                        <button className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all flex items-center gap-2">
                            <FiTrash2 size={14} />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
