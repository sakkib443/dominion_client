"use client";

import React from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux';
import {
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart
} from '@/redux/slices/cartSlice';
import {
    FiTrash2,
    FiPlus,
    FiMinus,
    FiArrowRight,
    FiShoppingBag,
    FiChevronLeft
} from 'react-icons/fi';
import EmptyState from '@/components/shared/EmptyState';
import { toast } from 'react-hot-toast';

const CartPage = () => {
    const { items, totalPrice } = useAppSelector((state) => state.cart);
    const dispatch = useAppDispatch();

    if (items.length === 0) {
        return (
            <div className="py-20">
                <EmptyState
                    title="Your cart is empty"
                    description="Looks like you haven't added anything to your cart yet."
                    buttonText="Start Shopping"
                    buttonLink="/shop"
                />
            </div>
        );
    }

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            dispatch(clearCart());
            toast.success('Cart cleared successfully');
        }
    };

    return (
        <div className="bg-gray-50/50 min-h-screen pb-20">
            <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-8">
                {/* Breadcrumb / Back button */}
                <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[var(--color-primary)] mb-8 transition-colors group">
                    <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back to Shopping
                </Link>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Cart Items List */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                <FiShoppingBag className="text-[var(--color-primary)]" />
                                Shopping Cart
                                <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full ml-2">
                                    {items.length} {items.length === 1 ? 'Item' : 'Items'}
                                </span>
                            </h1>
                            <button
                                onClick={handleClearCart}
                                className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 uppercase tracking-widest active:scale-95 transition-all"
                            >
                                <FiTrash2 /> Clear Cart
                            </button>
                        </div>

                        <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
                            <div className="hidden md:grid grid-cols-6 p-6 border-b border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <div className="col-span-3">Product Details</div>
                                <div className="text-center">Price</div>
                                <div className="text-center">Quantity</div>
                                <div className="text-right">Total</div>
                            </div>

                            <div className="divide-y divide-gray-50">
                                {items.map((item) => (
                                    <div key={item.id} className="p-6 grid grid-cols-1 md:grid-cols-6 items-center gap-6 group">
                                        {/* Product Info */}
                                        <div className="col-span-1 md:col-span-3 flex items-center gap-4">
                                            <div className="w-20 h-24 bg-gray-50 rounded-md overflow-hidden flex-shrink-0 border border-gray-100 p-2">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">{item.category}</span>
                                                <h3 className="text-sm font-bold text-gray-900 mt-1 hover:text-[var(--color-primary)] transition-colors cursor-pointer">{item.name}</h3>
                                                <button
                                                    onClick={() => dispatch(removeFromCart(item.id))}
                                                    className="mt-3 text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                                                >
                                                    <FiTrash2 size={12} /> Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="text-center hidden md:block">
                                            <p className="text-sm font-bold text-gray-900">৳{item.price.toLocaleString()}</p>
                                            {item.mrp > item.price && (
                                                <p className="text-[10px] text-gray-400 line-through">৳{item.mrp.toLocaleString()}</p>
                                            )}
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex justify-center">
                                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1">
                                                <button
                                                    onClick={() => dispatch(decreaseQuantity(item.id))}
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-white hover:text-[var(--color-primary)] rounded-md transition-all text-gray-500"
                                                >
                                                    <FiMinus size={14} />
                                                </button>
                                                <span className="w-10 text-center text-sm font-black text-gray-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => dispatch(increaseQuantity(item.id))}
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-white hover:text-[var(--color-primary)] rounded-md transition-all text-gray-500"
                                                >
                                                    <FiPlus size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Row Total */}
                                        <div className="text-right">
                                            <p className="text-base font-black text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:w-[380px]">
                        <div className="bg-white rounded-md border border-gray-100 shadow-xl shadow-gray-200/20 p-8 sticky top-32">
                            <h2 className="text-xl font-black text-gray-900 mb-8 pb-4 border-b border-gray-50">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Subtotal</span>
                                    <span className="font-bold text-gray-900">৳{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Shipping Fee</span>
                                    <span className="font-bold text-emerald-500 uppercase tracking-widest text-[10px]">Calculated at next step</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Tax</span>
                                    <span className="font-bold text-gray-900">৳0</span>
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex justify-between">
                                    <span className="text-lg font-black text-gray-900">Total</span>
                                    <span className="text-2xl font-black text-[var(--color-primary)] tracking-tight">৳{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full flex items-center justify-center gap-3 py-5 bg-gray-900 text-white rounded-md font-bold text-sm tracking-widest hover:bg-[var(--color-primary)] transition-all shadow-xl shadow-gray-200 hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] group"
                            >
                                PROCEED TO CHECKOUT
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <div className="mt-8 flex flex-col gap-4">
                                <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest leading-relaxed">
                                    Secure Payments & Instant Support
                                </p>
                                <div className="flex justify-center gap-4 grayscale opacity-40">
                                    {/* These are mock payment icons */}
                                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
