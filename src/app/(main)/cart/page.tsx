"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux';
import {
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart
} from '@/redux/slices/cartSlice';
import { useGuestCheckoutMutation } from '@/redux/api/orderApi';
import {
    FiTrash2,
    FiChevronLeft,
    FiX
} from 'react-icons/fi';
import EmptyState from '@/components/shared/EmptyState';
import { toast } from 'react-hot-toast';

const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if (num === 0) return 'Zero';
    const convert = (n: number): string => {
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
        if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
        if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
        if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
        return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
    };
    return convert(Math.round(num));
};

const CartPage = () => {
    const { items, totalPrice } = useAppSelector((state) => state.cart);
    const dispatch = useAppDispatch();
    const [guestCheckout, { isLoading: isOrdering }] = useGuestCheckoutMutation();
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', location: '' });

    if (items.length === 0 && !orderSuccess) {
        return (
            <div className="py-20">
                <EmptyState
                    title="Your cart is empty"
                    description="Looks like you haven't added anything to your cart yet."
                    buttonText="Start Shopping"
                    buttonLink="/"
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

    const handleSubmitOrder = async () => {
        // ── Client-side validation ──
        if (!formData.fullName.trim()) {
            toast.error('Full Name is required.'); return;
        }
        if (!formData.phone.trim()) {
            toast.error('Phone Number is required.'); return;
        }
        if (!/^[0-9+\-\s()]{7,}$/.test(formData.phone.trim())) {
            toast.error('Please enter a valid phone number.'); return;
        }
        if (!formData.location.trim()) {
            toast.error('Delivery Location is required.'); return;
        }

        try {
            const orderData = {
                shippingAddress: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    email: formData.email || `${formData.phone}@guest.com`,
                    address: formData.location,
                    city: '',
                    area: '',
                },
                items: items.map(item => ({
                    product: item.id,
                    quantity: item.quantity,
                })),
                paymentMethod: 'cod',
            };
            await guestCheckout(orderData).unwrap();
            setShowOrderModal(false);
            setOrderSuccess(true);
            dispatch(clearCart());
            setFormData({ fullName: '', phone: '', email: '', location: '' });
            toast.success('Order placed successfully!');
        } catch (err: any) {
            const data = err?.data;

            // Try to extract detailed validation messages
            if (data?.errors) {
                if (Array.isArray(data.errors)) {
                    // Array of { field, message } or just strings
                    const msgs = data.errors.map((e: any) =>
                        typeof e === 'string' ? e : (e.message || e.msg || JSON.stringify(e))
                    ).join('\n');
                    toast.error(msgs, { duration: 5000 });
                } else if (typeof data.errors === 'object') {
                    // Object: { field: { message } }
                    const msgs = Object.values(data.errors)
                        .map((e: any) => e?.message || e?.msg || String(e))
                        .join('\n');
                    toast.error(msgs, { duration: 5000 });
                } else {
                    toast.error(String(data.errors), { duration: 5000 });
                }
            } else {
                toast.error(data?.message || 'Failed to place order. Please try again.', { duration: 4000 });
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '60px', background: '#fff' }}>
            <div className="container" style={{ padding: '0 1rem' }}>
                {/* Back Button */}
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#888', textDecoration: 'none', padding: '16px 0', transition: 'color 0.2s' }}>
                    <FiChevronLeft /> Back to Shopping
                </Link>

                {/* Cart Table */}
                <div style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                    {/* Table Header */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '60px 1fr 160px 120px 120px 40px',
                        borderBottom: '2px solid #e5e7eb', padding: '12px 16px',
                        fontSize: '12px', fontWeight: 800, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>
                        <div>SL NO</div>
                        <div style={{ paddingLeft: '8px' }}>Product Details</div>
                        <div style={{ textAlign: 'center' }}>Qty</div>
                        <div style={{ textAlign: 'center' }}>Unit Price</div>
                        <div style={{ textAlign: 'right' }}>Total Price</div>
                        <div></div>
                    </div>

                    {/* Cart Items */}
                    {items.map((item, index) => (
                        <div key={item.id} style={{
                            display: 'grid', gridTemplateColumns: '60px 1fr 160px 120px 120px 40px',
                            alignItems: 'center', padding: '8px 16px',
                            borderBottom: '1px solid #f3f4f6',
                            transition: 'background 0.15s',
                        }}>
                            {/* SL NO */}
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#555' }}>{index + 1}</div>

                            {/* Product Details */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '8px' }}>
                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden',
                                    flexShrink: 0, border: '1px solid #e5e7eb', background: '#f9fafb',
                                }}>
                                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', margin: 0, lineHeight: 1.4 }}>{item.name}</h3>
                                </div>
                            </div>

                            {/* Quantity Controls */}
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center',
                                    border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden',
                                }}>
                                    <button
                                        onClick={() => dispatch(decreaseQuantity(item.id))}
                                        style={{
                                            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: '#555',
                                        }}
                                    >−</button>
                                    <div style={{
                                        width: '48px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '13px', fontWeight: 800, color: '#1a1a1a', background: '#fff',
                                        borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb',
                                    }}>{item.quantity}</div>
                                    <button
                                        onClick={() => dispatch(increaseQuantity(item.id))}
                                        style={{
                                            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: '#555',
                                        }}
                                    >+</button>
                                </div>
                            </div>

                            {/* Unit Price */}
                            <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>
                                {item.price.toLocaleString()}
                            </div>

                            {/* Total Price */}
                            <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: 800, color: '#1a1a1a' }}>
                                {(item.price * item.quantity).toLocaleString()}
                            </div>

                            {/* Remove Icon */}
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button
                                    onClick={() => dispatch(removeFromCart(item.id))}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        padding: '4px', borderRadius: '4px', transition: 'color 0.2s',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = '#ccc')}
                                >
                                    <FiTrash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Total Amount Row */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '60px 1fr 160px 120px 120px',
                        padding: '14px 16px', background: '#f3f4f6', borderBottom: '1px solid #e5e7eb',
                    }}>
                        <div></div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a1a', textAlign: 'center', gridColumn: '2 / 5' }}>Total Amount</div>
                        <div style={{ textAlign: 'right', fontSize: '16px', fontWeight: 900, color: '#1a1a1a' }}>
                            {totalPrice.toLocaleString()}
                        </div>
                    </div>

                    {/* Amount in Words */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '60px 1fr 120px',
                        padding: '10px 16px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb',
                    }}>
                        <div></div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#666', textAlign: 'center' }}>
                            BDT {numberToWords(totalPrice)} Only
                        </div>
                        <div></div>
                    </div>
                </div>

                {/* Add More Products & Clear Cart */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', padding: '12px 16px' }}>
                    <button
                        onClick={handleClearCart}
                        style={{
                            fontSize: '12px', fontWeight: 700, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '4px',
                        }}
                    >
                        <FiTrash2 size={12} /> Clear Cart
                    </button>
                    <Link href="/" style={{ fontSize: '12px', fontWeight: 700, color: '#0B4222', textDecoration: 'none' }}>
                        To Add More Products
                    </Link>
                </div>

                {/* Confirm Order Button */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                    <button
                        onClick={() => setShowOrderModal(true)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            padding: '14px 48px', background: '#0B4222', color: '#fff',
                            fontSize: '14px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase',
                            borderRadius: '4px', border: 'none', cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        CONFIRM ORDER
                    </button>
                </div>

                {/* ═══ ORDER CONFIRMATION POPUP ═══ */}
                {showOrderModal && (
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.5)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        animation: 'fadeIn 0.2s ease-out',
                    }} onClick={() => setShowOrderModal(false)}>
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: '#fff', borderRadius: '8px',
                                width: '100%', maxWidth: '440px',
                                padding: '32px', position: 'relative',
                                boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                            }}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowOrderModal(false)}
                                style={{
                                    position: 'absolute', top: '12px', right: '12px',
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: '#f3f4f6', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#666',
                                }}
                            >
                                <FiX size={16} />
                            </button>

                            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 6px 0' }}>Confirm Your Order</h2>
                            <p style={{ fontSize: '12px', color: '#888', margin: '0 0 24px 0' }}>Please fill in your details to place the order</p>

                            {/* Form Fields */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#555', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="Enter your full name"
                                        style={{
                                            width: '100%', padding: '10px 14px', fontSize: '13px',
                                            border: '1px solid #e5e7eb', borderRadius: '6px', outline: 'none',
                                            transition: 'border-color 0.2s', boxSizing: 'border-box',
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#0B4222'}
                                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#555', display: 'block', marginBottom: '4px' }}>Phone Number *</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="01XXXXXXXXX"
                                        style={{
                                            width: '100%', padding: '10px 14px', fontSize: '13px',
                                            border: '1px solid #e5e7eb', borderRadius: '6px', outline: 'none',
                                            transition: 'border-color 0.2s', boxSizing: 'border-box',
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#0B4222'}
                                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#555', display: 'block', marginBottom: '4px' }}>Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="your@email.com (optional)"
                                        style={{
                                            width: '100%', padding: '10px 14px', fontSize: '13px',
                                            border: '1px solid #e5e7eb', borderRadius: '6px', outline: 'none',
                                            transition: 'border-color 0.2s', boxSizing: 'border-box',
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#0B4222'}
                                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#555', display: 'block', marginBottom: '4px' }}>Delivery Location *</label>
                                    <textarea
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="Enter your full delivery address"
                                        rows={3}
                                        style={{
                                            width: '100%', padding: '10px 14px', fontSize: '13px',
                                            border: '1px solid #e5e7eb', borderRadius: '6px', outline: 'none',
                                            transition: 'border-color 0.2s', resize: 'none', boxSizing: 'border-box',
                                            fontFamily: 'inherit',
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#0B4222'}
                                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                    />
                                </div>
                            </div>

                            {/* Order Summary in Modal */}
                            <div style={{
                                marginTop: '20px', padding: '12px', background: '#f9fafb',
                                borderRadius: '6px', border: '1px solid #e5e7eb',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555' }}>
                                    <span>Total Items: <strong>{items.length}</strong></span>
                                    <span>Total: <strong style={{ color: '#1a1a1a', fontSize: '15px' }}>৳{totalPrice.toLocaleString()}</strong></span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmitOrder}
                                disabled={isOrdering}
                                style={{
                                    width: '100%', marginTop: '20px', padding: '14px',
                                    background: isOrdering ? '#999' : '#0B4222', color: '#fff',
                                    fontSize: '14px', fontWeight: 800, letterSpacing: '1px',
                                    textTransform: 'uppercase', border: 'none', borderRadius: '6px',
                                    cursor: isOrdering ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {isOrdering ? 'PLACING ORDER...' : 'SUBMIT ORDER'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══ ORDER SUCCESS MESSAGE ═══ */}
                {orderSuccess && (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0B4222', margin: '0 0 8px 0' }}>Order Placed Successfully!</h2>
                        <p style={{ fontSize: '13px', color: '#666', margin: '0 0 24px 0' }}>Thank you for your order. We will contact you shortly.</p>
                        <Link
                            href="/"
                            style={{
                                display: 'inline-flex', padding: '12px 32px',
                                background: '#0B4222', color: '#fff', borderRadius: '6px',
                                fontSize: '13px', fontWeight: 700, textDecoration: 'none',
                            }}
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
