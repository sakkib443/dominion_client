"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux';
import { logout } from '@/redux/slices/authSlice';
import { FiUser, FiLogIn, FiLogOut } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const NewFooter: React.FC = () => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        router.push('/');
    };

    return (
        <footer className="bg-white border-t border-gray-200 py-6 mt-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-gray-600">
                    {/* Navigation Links */}
                    <div className="flex items-center gap-5 flex-wrap justify-center">
                        <Link href="/" className="hover:text-[#0B4222] transition-colors font-medium">
                            Home
                        </Link>
                        <span className="text-gray-300">-</span>
                        <Link href="/cart" className="hover:text-[#0B4222] transition-colors font-medium">
                            Cart
                        </Link>
                        <span className="text-gray-300">-</span>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href={user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/user'}
                                    className="hover:text-[#0B4222] transition-colors font-medium flex items-center gap-1.5"
                                >
                                    <FiUser size={14} />
                                    Dashboard
                                </Link>
                                <span className="text-gray-300">-</span>
                                <button
                                    onClick={handleLogout}
                                    className="hover:text-red-600 transition-colors font-medium flex items-center gap-1.5 text-gray-500"
                                >
                                    <FiLogOut size={14} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="hover:text-[#0B4222] transition-colors font-medium flex items-center gap-1.5"
                            >
                                <FiLogIn size={14} />
                                Login
                            </Link>
                        )}
                        <span className="text-gray-300">-</span>
                        <span className="font-bold text-[#0B4222]">Dominion</span>
                    </div>
                </div>
                
                {/* Copyright */}
                <div className="text-center mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Dominion. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default NewFooter;
