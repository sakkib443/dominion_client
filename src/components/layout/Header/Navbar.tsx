"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiMenu, FiX, FiChevronDown, FiZap } from 'react-icons/fi';
import { BiCategory } from 'react-icons/bi';

interface Category {
    id: number;
    name: string;
    slug: string;
    image?: string;
}

// Default categories as fallback
const defaultCategories: Category[] = [
    { id: 1, name: "Electronics", slug: "electronics" },
    { id: 2, name: "Fashion", slug: "fashion" },
    { id: 3, name: "Home & Kitchen", slug: "home-kitchen" },
    { id: 4, name: "Sports & Fitness", slug: "sports-fitness" },
    { id: 5, name: "Beauty & Health", slug: "beauty-health" },
    { id: 6, name: "Books", slug: "books" },
];

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>(defaultCategories);
    const pathname = usePathname();
    const router = useRouter();

    // Fetch categories from JSON
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/data/products.json');
                if (response.ok) {
                    const data = await response.json();
                    if (data.categories && data.categories.length > 0) {
                        setCategories(data.categories);
                    }
                }
            } catch (error) {
                console.error('Failed to load categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const isActive = (path: string) => pathname === path;

    const handleCategoryClick = (categoryId: number) => {
        router.push(`/?category=${categoryId}`);
        setIsCategoryOpen(false);
    };

    const navLinks = [
        { label: 'Home', href: '/' },
        { label: 'Shop Now', href: '/shop' },
        { label: 'Special Offers', href: '/offers' },
        { label: 'Our Blog', href: '/blog' },
        { label: 'Contact Us', href: '/contact' },
    ];

    return (
        <div className='bg-white border-b border-gray-100'>
            <div className='container mx-auto px-4 sm:px-8 md:px-12 lg:px-16'>
                <div className='flex justify-between items-center h-12'>
                    {/* Category Selector with Hover Dropdown */}
                    <div 
                        className="hidden lg:block w-64 h-full relative group"
                    >
                        <button className="bg-[#1a1a2e] text-white w-full h-full px-5 flex items-center gap-3 font-medium text-sm">
                            <BiCategory size={18} />
                            All Categories ({categories.length})
                            <FiChevronDown className="ml-auto transition-transform duration-200 group-hover:rotate-180" size={14} />
                        </button>
                        
                        {/* Category Dropdown - Pure CSS hover */}
                        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-xl z-[9999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                            <button
                                onClick={() => router.push('/')}
                                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-[var(--color-primary)] hover:text-white transition-colors border-b border-gray-100"
                            >
                                All Products
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.id)}
                                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-[var(--color-primary)] hover:text-white transition-colors border-b border-gray-100 last:border-b-0"
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center gap-8 h-full'>
                        {navLinks.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-[var(--color-primary)] py-3 ${isActive(link.href)
                                    ? 'text-[var(--color-primary)]'
                                    : 'text-gray-600'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side: Offer Text */}
                    <div className='hidden lg:flex items-center gap-2 text-sm'>
                        <span className="text-gray-400">Free Shipping on orders over</span>
                        <span className="font-semibold text-[var(--color-primary)]">৳5,000</span>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className='md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-md transition-all'
                    >
                        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isOpen && (
                    <div className='md:hidden absolute left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50'>
                        <div className='flex flex-col p-4 gap-1'>
                            {navLinks.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive(link.href) ? 'bg-gray-50 text-[var(--color-primary)]' : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            
                            {/* Mobile Categories */}
                            {categories.length > 0 && (
                                <>
                                    <div className="h-px bg-gray-100 my-2"></div>
                                    <p className="px-4 py-2 text-xs text-gray-400 uppercase">Categories</p>
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => { handleCategoryClick(category.id); setIsOpen(false); }}
                                            className="px-4 py-3 rounded-md text-sm text-gray-600 hover:bg-gray-50 text-left transition-colors"
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </>
                            )}
                            
                            <div className="h-px bg-gray-100 my-2"></div>
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors"
                            >
                                Login / Sign In
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setIsOpen(false)}
                                className="mx-4 py-2.5 text-center bg-[var(--color-primary)] text-white rounded-md text-sm font-medium"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
