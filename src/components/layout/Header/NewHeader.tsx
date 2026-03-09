"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart, FiCamera, FiChevronDown, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { useAppSelector } from '@/redux';
import { useGetCategoriesQuery } from '@/redux/api/categoryApi';

interface Category {
    _id: string;
    name: string;
    slug: string;
}

const NewHeader: React.FC = () => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cartItems = useAppSelector((state) => state.cart.items);

    const { data: categoriesData } = useGetCategoriesQuery({});
    const categories: Category[] = categoriesData?.data || [];

    const handleImageSearch = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            console.log('Image selected for search:', file.name);
        }
    };

    return (
        <header className="sticky top-0 z-50">
            {/* Main Header */}
            <div className="bg-[#0B4222] shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-4 gap-3">
                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden text-white p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>

                        {/* 1. Product Categories Dropdown - FIRST */}
                        <div className="relative hidden lg:block">
                            <button
                                className="bg-white text-[#0B4222] px-5 py-2.5 rounded-md flex items-center gap-2 hover:bg-gray-100 transition-colors font-medium"
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            >
                                <span>Product Categories</span>
                                <FiChevronDown className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isCategoryOpen && (
                                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-xl z-50">
                                    {categories.length > 0 ? (
                                        categories.map((category) => (
                                            <Link
                                                key={category._id}
                                                href={`/?category=${category._id}`}
                                                className="block px-4 py-3 text-gray-700 hover:bg-[#0B4222] hover:text-white transition-colors first:rounded-t-md last:rounded-b-md"
                                                onClick={() => setIsCategoryOpen(false)}
                                            >
                                                {category.name}
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-gray-500">Loading...</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 2. Company Logo - SECOND */}
                        <Link href="/" className="flex items-center gap-2 shrink-0">
                            <Image src="/logo.svg" alt="Logo" width={180} height={50} style={{ width: '180px', height: 'auto' }} />
                        </Link>

                        {/* 3. Search Bar - THIRD */}
                        <div className="flex-1 max-w-xl hidden md:block">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search your desired products here"
                                    className="w-full border-2 border-white rounded-md py-2.5 px-4 pr-12 focus:border-white focus:outline-none transition-colors bg-white"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B4222] hover:text-[#093519] transition-colors">
                                    <FiSearch size={20} />
                                </button>
                            </div>
                        </div>

                        {/* 4. Image Search - FOURTH */}
                        <div className="relative">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                onClick={handleImageSearch}
                                className="flex items-center gap-1.5 border-2 border-white bg-white px-3 py-2.5 rounded-md hover:bg-gray-100 transition-colors text-[#0B4222]"
                                title="Search by Image"
                            >
                                <FiCamera size={20} />
                                <span className="hidden lg:inline text-sm font-medium">Image Search</span>
                            </button>
                            {selectedImage && (
                                <div className="absolute top-full right-0 mt-2 p-2 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                    <img src={selectedImage} alt="Selected" className="w-20 h-20 object-cover rounded-md" />
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 5. Cart - FIFTH */}
                        <Link href="/cart" className="relative flex items-center gap-1.5 bg-white text-[#0B4222] px-4 py-2.5 rounded-md hover:bg-gray-100 transition-colors">
                            <FiShoppingCart size={20} />
                            <span className="hidden lg:inline text-sm font-medium">Cart</span>
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Search */}
                    <div className="md:hidden pb-3">
                        <div className="relative flex gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full border-2 border-white rounded-md py-2 px-4 pr-10 focus:border-white focus:outline-none bg-white"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B4222]">
                                    <FiSearch size={18} />
                                </button>
                            </div>
                            <button
                                onClick={handleImageSearch}
                                className="border-2 border-white bg-white px-3 rounded-md text-[#0B4222] hover:bg-gray-100"
                            >
                                <FiCamera size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden border-t border-white/20 py-4">
                            <div className="space-y-2">
                                <p className="font-semibold text-white px-2 mb-3">Categories</p>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <Link
                                            key={category._id}
                                            href={`/?category=${category._id}`}
                                            className="block px-4 py-2 text-white hover:bg-white/10 rounded-md"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {category.name}
                                        </Link>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-white/70">Loading categories...</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Scrolling Offer/News Ticker */}
            <div className="bg-[#E4525C] py-3 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap">
                    <span className="text-white text-sm font-medium mx-8">🎉 Special Offer: Get 50% OFF on all Electronics! Limited Time Only!</span>
                    <span className="text-white text-sm font-medium mx-8">🚚 Free Shipping on orders over ৳5000</span>
                    <span className="text-white text-sm font-medium mx-8">💳 Extra 10% Cashback with bKash Payment</span>
                    <span className="text-white text-sm font-medium mx-8">🔥 Flash Sale: Up to 70% OFF on Fashion Items</span>
                    <span className="text-white text-sm font-medium mx-8">📱 Download Our App & Get ৳100 Discount</span>
                    <span className="text-white text-sm font-medium mx-8">🎉 Special Offer: Get 50% OFF on all Electronics! Limited Time Only!</span>
                    <span className="text-white text-sm font-medium mx-8">🚚 Free Shipping on orders over ৳5000</span>
                    <span className="text-white text-sm font-medium mx-8">💳 Extra 10% Cashback with bKash Payment</span>
                </div>
            </div>
        </header>
    );
};

export default NewHeader;
