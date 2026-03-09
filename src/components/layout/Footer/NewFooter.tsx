"use client";

import React from 'react';
import Link from 'next/link';

const NewFooter: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-6 mt-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-gray-600">
                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="hover:text-[#0B4222] transition-colors font-medium">
                            Navigation
                        </Link>
                        <span className="text-gray-300">-</span>
                        <Link href="/contact" className="hover:text-[#0B4222] transition-colors font-medium">
                            Contact
                        </Link>
                        <span className="text-gray-300">-</span>
                        <Link href="/shop" className="hover:text-[#0B4222] transition-colors font-medium">
                            Navbar
                        </Link>
                        <span className="text-gray-300">-</span>
                        <span className="font-bold text-[#0B4222]">NT</span>
                    </div>
                </div>
                
                {/* Copyright */}
                <div className="text-center mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} MegaShop. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default NewFooter;
