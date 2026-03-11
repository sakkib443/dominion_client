"use client";

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiCamera, FiChevronDown, FiSearch, FiMenu, FiX, FiUpload } from 'react-icons/fi';
import { useAppSelector, useAppDispatch } from '@/redux';
import { useGetCategoriesQuery } from '@/redux/api/categoryApi';
import { setImageSearching, setImageSearchResults, clearImageSearch } from '@/redux/slices/imageSearchSlice';

interface Category {
    _id: string;
    name: string;
    slug: string;
    icon?: string;
}

const NewHeader: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isCategoryHovered, setIsCategoryHovered] = useState(false);
    const categoryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);
    const cartItems = useAppSelector((state) => state.cart.items);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { data: categoriesData } = useGetCategoriesQuery({});
    const categories: Category[] = categoriesData?.data || [];

    // ── Hover handlers with slight delay so moving mouse to dropdown doesn't close it ─
    const handleCategoryMouseEnter = () => {
        if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current);
        setIsCategoryHovered(true);
    };

    const handleCategoryMouseLeave = () => {
        categoryTimeoutRef.current = setTimeout(() => {
            setIsCategoryHovered(false);
        }, 150);
    };

    const handleImageUpload = useCallback(async (file: File) => {
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        setIsImageSearchOpen(false);
        setIsSearching(true);
        dispatch(setImageSearching(true));

        try {
            // Step 1: Analyze image in browser using TensorFlow.js MobileNet + Color extraction
            const { analyzeImage } = await import('@/utils/imageSearch');
            const analysis = await analyzeImage(file);

            // Step 2: Send analyzed data to backend for product matching
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/image`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    labels: analysis.labels,
                    colors: analysis.colors.map(c => c.name),
                    colorHexes: analysis.colors.map(c => c.hex),
                    keywords: analysis.keywords,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Dispatch results to Redux — homepage will display them
                dispatch(setImageSearchResults({
                    products: data.data.products,
                    searchMeta: {
                        ...data.data.searchMeta,
                        colors: analysis.colors,
                    },
                    previewImage: imageUrl,
                }));

                // Navigate to homepage if not already there
                router.push('/');
            } else {
                console.error('Image search failed:', data.message);
                dispatch(setImageSearching(false));
            }
        } catch (error) {
            console.error('Image search error:', error);
            dispatch(setImageSearching(false));
        } finally {
            setIsSearching(false);
        }
    }, [dispatch, router]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageUpload(file);
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) handleImageUpload(file);
    };

    const handlePaste = useCallback((e: ClipboardEvent) => {
        if (!isImageSearchOpen) return;
        const items = e.clipboardData?.items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.startsWith('image/')) {
                    const file = items[i].getAsFile();
                    if (file) { handleImageUpload(file); break; }
                }
            }
        }
    }, [isImageSearchOpen, handleImageUpload]);

    React.useEffect(() => {
        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [handlePaste]);

    const clearImage = () => { setSelectedImage(null); setIsSearching(false); };

    return (
        <>
            <header className="sticky top-0 z-50">
                {/* Main Header */}
                <div className="bg-[#0B4222]">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between py-5 gap-4">

                            {/* Mobile Menu Button */}
                            <button
                                className="lg:hidden text-white/90 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                            </button>

                            {/* ── Categories Dropdown (HOVER, no click) ───────── */}
                            <div
                                className="relative hidden lg:block"
                                onMouseEnter={handleCategoryMouseEnter}
                                onMouseLeave={handleCategoryMouseLeave}
                            >
                                <button
                                    className="bg-white/15 backdrop-blur-sm text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-white/25 transition-all font-medium text-sm border border-white/10 cursor-default select-none"
                                    tabIndex={-1}
                                    aria-haspopup="true"
                                    aria-expanded={isCategoryHovered}
                                >
                                    <FiMenu size={16} />
                                    <span>All Categories</span>
                                    <FiChevronDown
                                        className={`transition-transform duration-200 ${isCategoryHovered ? 'rotate-180' : ''}`}
                                        size={14}
                                    />
                                </button>

                                {/* Dropdown */}
                                <div
                                    className={`absolute top-full left-0 mt-1.5 w-60 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 overflow-hidden transition-all duration-200 origin-top ${isCategoryHovered
                                        ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto'
                                        : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none'
                                        }`}
                                    onMouseEnter={handleCategoryMouseEnter}
                                    onMouseLeave={handleCategoryMouseLeave}
                                >
                                    {/* All products link */}
                                    <Link
                                        href="/"
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-[#0B4222] hover:text-white transition-colors border-b border-gray-50 font-medium"
                                    >
                                        <span className="text-base">🛒</span>
                                        All Products
                                    </Link>
                                    {categories.length > 0 ? (
                                        categories.map((category) => (
                                            <Link
                                                key={category._id}
                                                href={`/?category=${category._id}`}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#0B4222] hover:text-white transition-colors"
                                                onClick={() => setIsCategoryHovered(false)}
                                            >
                                                {category.icon && <span className="text-base">{category.icon}</span>}
                                                {category.name}
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-gray-400">Loading...</div>
                                    )}
                                </div>
                            </div>

                            {/* Company Logo */}
                            <Link href="/" className="flex items-center gap-2 shrink-0">
                                <Image src="/logo.svg" alt="Logo" width={180} height={50} style={{ width: '180px', height: 'auto' }} />
                            </Link>

                            {/* Search Bar — Desktop */}
                            <div className="flex-1 max-w-2xl hidden md:flex items-center gap-0">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                    className="hidden"
                                />

                                {/* Main search box */}
                                <div className="relative flex-1 h-11">
                                    {selectedImage && (
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
                                            <div className="relative group">
                                                <img src={selectedImage} alt="Search" className="w-8 h-8 rounded object-cover border border-white/30" />
                                                <button
                                                    onClick={clearImage}
                                                    className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#E4525C] text-white rounded-full text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >×</button>
                                            </div>
                                        </div>
                                    )}

                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && console.log('search:', searchQuery)}
                                        placeholder={isSearching ? 'Searching by image...' : 'Search products...'}
                                        className={`w-full h-full bg-white/15 backdrop-blur-sm border border-white/20 rounded-l-full ${selectedImage ? 'pl-14' : 'pl-7'
                                            } pr-12 text-white placeholder-white/50 focus:bg-white/20 focus:border-white/30 focus:outline-none transition-all text-sm`}
                                    />

                                    {/* Search submit button — inside, right side of input */}
                                    <button
                                        className="absolute right-0 top-0 h-full px-5 bg-white/20 hover:bg-white/30 text-white rounded-r-none transition-colors flex items-center justify-center border-l border-white/20"
                                        title="Search"
                                    >
                                        {isSearching
                                            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            : <FiSearch size={16} />}
                                    </button>
                                </div>

                                {/* Divider + Image search — outside the main input */}
                                <div className="flex items-center h-11">
                                    {/* Rounded right cap that closes the whole bar */}
                                    <button
                                        onClick={() => setIsImageSearchOpen(true)}
                                        title="Search by Image"
                                        className="flex items-center gap-2 h-full pl-5 pr-8 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-l-0 border-white/20 rounded-r-full transition-all text-sm font-medium"
                                    >
                                        <FiCamera size={16} />
                                        <span className="text-xs hidden lg:inline">Image</span>
                                    </button>
                                </div>
                            </div>

                            {/* Cart */}
                            <Link href="/cart" className="relative flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white px-4 py-2.5 rounded-lg hover:bg-white/25 transition-all border border-white/10">
                                <FiShoppingCart size={18} />
                                <span className="hidden lg:inline text-sm font-medium">Cart</span>
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#E4525C] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>
                        </div>

                        {/* Mobile Search */}
                        <div className="md:hidden pb-3">
                            <div className="flex items-center gap-0">
                                {/* Main input */}
                                <div className="relative flex-1">
                                    {selectedImage && (
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
                                            <div className="relative group">
                                                <img src={selectedImage} alt="Search" className="w-7 h-7 rounded object-cover border border-white/30" />
                                                <button onClick={clearImage} className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#E4525C] text-white rounded-full text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className={`w-full bg-white/15 border border-white/20 rounded-l-full py-2.5 ${selectedImage ? 'pl-11' : 'pl-4'} pr-12 text-white placeholder-white/50 focus:outline-none text-sm`}
                                    />
                                    {/* Search icon inside */}
                                    <button className="absolute right-0 top-0 h-full px-3 bg-white/20 text-white rounded-r-none border-l border-white/20 flex items-center">
                                        <FiSearch size={14} />
                                    </button>
                                </div>
                                {/* Image search outside */}
                                <button
                                    onClick={() => setIsImageSearchOpen(true)}
                                    className="flex items-center justify-center px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-l-0 border-white/20 rounded-r-full transition-all"
                                >
                                    <FiCamera size={15} />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        {isMobileMenuOpen && (
                            <div className="lg:hidden border-t border-white/15 py-4">
                                <div className="space-y-1">
                                    <button
                                        className="w-full flex items-center justify-between px-3 py-2 text-white/80 font-semibold text-sm"
                                        onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
                                    >
                                        <span>Categories</span>
                                        <FiChevronDown className={`transition-transform ${isMobileCategoryOpen ? 'rotate-180' : ''}`} size={14} />
                                    </button>
                                    {isMobileCategoryOpen && (
                                        <div className="pl-2 space-y-1">
                                            <Link href="/" className="block px-4 py-2 text-white/70 hover:text-white text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                                                All Products
                                            </Link>
                                            {categories.map((cat) => (
                                                <Link
                                                    key={cat._id}
                                                    href={`/?category=${cat._id}`}
                                                    className="flex items-center gap-2 px-4 py-2 text-white/70 hover:bg-white/10 hover:text-white rounded-lg text-sm transition-colors"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    {cat.icon && <span>{cat.icon}</span>}
                                                    {cat.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scrolling Offer Ticker */}
                <div className="bg-[#E4525C] py-2.5 overflow-hidden">
                    <div className="animate-marquee whitespace-nowrap">
                        <span className="text-white text-sm font-medium mx-8">🎉 Special Offer: Get 50% OFF on all Electronics! Limited Time Only!</span>
                        <span className="text-white/80 mx-2">•</span>
                        <span className="text-white text-sm font-medium mx-8">🚚 Free Shipping on orders over Tk.5000</span>
                        <span className="text-white/80 mx-2">•</span>
                        <span className="text-white text-sm font-medium mx-8">💳 Extra 10% Cashback with bKash Payment</span>
                        <span className="text-white/80 mx-2">•</span>
                        <span className="text-white text-sm font-medium mx-8">🔥 Flash Sale: Up to 70% OFF on Fashion Items</span>
                        <span className="text-white/80 mx-2">•</span>
                        <span className="text-white text-sm font-medium mx-8">📱 Download Our App & Get Tk.100 Discount</span>
                        <span className="text-white/80 mx-2">•</span>
                        <span className="text-white text-sm font-medium mx-8">🎉 Special Offer: Get 50% OFF on all Electronics! Limited Time Only!</span>
                        <span className="text-white/80 mx-2">•</span>
                        <span className="text-white text-sm font-medium mx-8">🚚 Free Shipping on orders over Tk.5000</span>
                        <span className="text-white/80 mx-2">•</span>
                        <span className="text-white text-sm font-medium mx-8">💳 Extra 10% Cashback with bKash Payment</span>
                    </div>
                </div>
            </header>

            {/* Image Search Modal */}
            {isImageSearchOpen && (
                <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-24">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsImageSearchOpen(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-fadeIn overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-base font-semibold text-gray-800">Search products by Image</h3>
                            <button onClick={() => setIsImageSearchOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                                <FiX size={18} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div
                                ref={dropZoneRef}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? 'border-[#0B4222] bg-[#0B4222]/5 scale-[1.02]' : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'}`}
                            >
                                <div className="flex flex-col items-center gap-4">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-[#0B4222]/10 text-[#0B4222]' : 'bg-gray-100 text-gray-400'}`}>
                                        <FiUpload size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Paste a copied image with <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono">Ctrl</kbd> <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono">V</kbd>
                                        </p>
                                        <p className="text-sm text-gray-400">Drag and drop an image here, or click to browse</p>
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-8 py-2.5 bg-[#0B4222] text-white rounded-full text-sm font-semibold hover:bg-[#093519] transition-colors shadow-md hover:shadow-lg"
                                    >
                                        Browse File
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 pb-5">
                            <div className="bg-[#0B4222]/5 rounded-xl px-4 py-3 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-[#0B4222]/10 flex items-center justify-center shrink-0">
                                    <FiCamera size={18} className="text-[#0B4222]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Visual Search</p>
                                    <p className="text-xs text-gray-500">Upload or screenshot a product to find similar items instantly</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NewHeader;
