"use client";

import React, { useState } from 'react';
import {
    FiPhone, FiMail, FiMapPin, FiSend, FiCheckCircle,
    FiClock, FiMessageCircle, FiChevronRight,
} from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';

/* ─── Types ─── */
type FormState = { name: string; email: string; phone: string; subject: string; message: string };

/* ─── Data ─── */
const CONTACT_CARDS = [
    {
        icon: <FiPhone size={22} />,
        label: 'Call Us',
        primary: '01753923093',
        secondary: 'Sun – Thu, 9 AM – 6 PM',
        href: 'tel:01753923093',
        accent: '#0B4222',
    },
    {
        icon: <BsWhatsapp size={22} />,
        label: 'WhatsApp',
        primary: '01322840808',
        secondary: 'Quick reply within minutes',
        href: 'https://wa.me/8801322840808',
        accent: '#25D366',
    },
    {
        icon: <FiMail size={22} />,
        label: 'Email Us',
        primary: 'support@dominion.com',
        secondary: 'We reply within 24 hours',
        href: 'mailto:support@dominion.com',
        accent: '#4F46E5',
    },
    {
        icon: <FiMapPin size={22} />,
        label: 'Visit Us',
        primary: 'Dhaka, Bangladesh',
        secondary: 'Find us on the map below',
        href: '#map',
        accent: '#E4525C',
    },
];

const HOURS = [
    { day: 'Sunday – Thursday', time: '9:00 AM – 6:00 PM' },
    { day: 'Friday', time: '2:00 PM – 6:00 PM' },
    { day: 'Saturday', time: 'Closed' },
];

const SUBJECTS = [
    'Order Issue', 'Product Inquiry', 'Return / Refund',
    'Delivery Problem', 'Payment Issue', 'Other',
];

/* ─── Page ─── */
export default function ContactPage() {
    const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', subject: '', message: '' });
    const [focusField, setFocusField] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Partial<FormState>>({});

    const validate = () => {
        const e: Partial<FormState> = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
        if (!form.message.trim()) e.message = 'Message is required';
        return e;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        if (errors[name as keyof FormState]) setErrors(p => ({ ...p, [name]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        await new Promise(r => setTimeout(r, 1200));
        setLoading(false);
        setSubmitted(true);
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
    };

    /* ─── Helpers ─── */
    const field = (name: keyof FormState): React.CSSProperties => ({
        width: '100%',
        padding: '10px 14px',
        border: `1.5px solid ${errors[name] ? '#E4525C' : focusField === name ? '#0B4222' : '#e5e7eb'}`,
        borderRadius: '8px',
        fontSize: '13.5px',
        color: '#1a1a1a',
        background: focusField === name ? '#f7fbf9' : '#fafafa',
        outline: 'none',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box' as const,
        boxShadow: focusField === name ? '0 0 0 3px rgba(11,66,34,0.08)' : 'none',
    });

    return (
        <div style={{ background: '#fff', minHeight: '100vh' }}>

            {/* ══════════ HERO BANNER ══════════ */}
            <div style={{
                background: 'linear-gradient(180deg, #f8f9fb 0%, #f1f3f6 100%)',
                borderBottom: '1px solid #e5e7eb',
                padding: '44px 0 40px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* soft decorative circles */}
                <div style={{
                    position: 'absolute', top: '-80px', right: '-80px',
                    width: '300px', height: '300px',
                    borderRadius: '50%', background: 'rgba(11,66,34,0.04)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-60px', left: '5%',
                    width: '200px', height: '200px',
                    borderRadius: '50%', background: 'rgba(11,66,34,0.03)',
                    pointerEvents: 'none',
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '14px' }}>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>Home</span>
                        <FiChevronRight size={12} color="#9ca3af" />
                        <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>Contact Us</span>
                    </div>

                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 10px', lineHeight: 1.2 }}>
                        Get In Touch
                    </h1>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 auto', maxWidth: '460px', lineHeight: 1.75 }}>
                        Have a question, feedback, or need assistance with your order? Our team is ready to help you every step of the way.
                    </p>
                </div>
            </div>

            {/* ══════════ CONTACT CARDS ══════════ */}
            <div className="container" style={{ marginTop: '-1px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1px',
                    background: '#e5e7eb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0 0 12px 12px',
                    overflow: 'hidden',
                    marginBottom: '36px',
                }}>
                    {CONTACT_CARDS.map((card, i) => (
                        <a
                            key={i}
                            href={card.href}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '24px 16px',
                                background: '#fff',
                                textDecoration: 'none',
                                transition: 'background 0.2s ease',
                                textAlign: 'center',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f7fbf9')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                        >
                            <div style={{
                                width: '48px', height: '48px',
                                borderRadius: '12px',
                                background: `${card.accent}14`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: card.accent,
                                flexShrink: 0,
                            }}>
                                {card.icon}
                            </div>
                            <div>
                                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 2px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {card.label}
                                </p>
                                <p style={{ fontSize: '13.5px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 2px' }}>
                                    {card.primary}
                                </p>
                                <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                                    {card.secondary}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>

                {/* ══════════ MAIN CONTENT ══════════ */}
                <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginBottom: '40px' }}>

                    {/* ─── LEFT: Form ─── */}
                    <div style={{ flex: '1 1 380px' }}>
                        {/* Section heading */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '8px',
                                background: '#0B422214', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', color: '#0B4222',
                            }}>
                                <FiMessageCircle size={16} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Send Us a Message</h2>
                                <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>We'll get back to you within 24 hours</p>
                            </div>
                        </div>

                        {/* Success Banner */}
                        {submitted && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                background: 'linear-gradient(135deg, #f0faf4, #dcfce7)',
                                border: '1.5px solid #16a34a',
                                borderRadius: '10px', padding: '14px 16px',
                                marginBottom: '20px', color: '#15803d',
                                animation: 'fadeIn 0.3s ease-out',
                            }}>
                                <FiCheckCircle size={18} />
                                <div>
                                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>Message sent successfully!</p>
                                    <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Our team will reply within 24 hours.</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {/* Name + Phone */}
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <div style={{ flex: '1 1 160px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>
                                        Full Name <span style={{ color: '#E4525C' }}>*</span>
                                    </label>
                                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name"
                                        style={field('name')}
                                        onFocus={() => setFocusField('name')}
                                        onBlur={() => setFocusField(null)} />
                                    {errors.name && <p style={{ fontSize: '11px', color: '#E4525C', margin: '3px 0 0' }}>{errors.name}</p>}
                                </div>
                                <div style={{ flex: '1 1 160px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Phone Number</label>
                                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="01XXXXXXXXX"
                                        style={field('phone')}
                                        onFocus={() => setFocusField('phone')}
                                        onBlur={() => setFocusField(null)} />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>
                                    Email Address <span style={{ color: '#E4525C' }}>*</span>
                                </label>
                                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="example@email.com"
                                    style={field('email')}
                                    onFocus={() => setFocusField('email')}
                                    onBlur={() => setFocusField(null)} />
                                {errors.email && <p style={{ fontSize: '11px', color: '#E4525C', margin: '3px 0 0' }}>{errors.email}</p>}
                            </div>

                            {/* Subject */}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Subject</label>
                                <select name="subject" value={form.subject} onChange={handleChange}
                                    style={{ ...field('subject'), cursor: 'pointer', appearance: 'auto' }}
                                    onFocus={() => setFocusField('subject')}
                                    onBlur={() => setFocusField(null)}>
                                    <option value="">Select a topic...</option>
                                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            {/* Message */}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>
                                    Message <span style={{ color: '#E4525C' }}>*</span>
                                </label>
                                <textarea name="message" value={form.message} onChange={handleChange}
                                    placeholder="Describe your issue or question in detail..."
                                    rows={5}
                                    style={{ ...field('message'), resize: 'vertical', minHeight: '120px' }}
                                    onFocus={() => setFocusField('message')}
                                    onBlur={() => setFocusField(null)} />
                                {errors.message && <p style={{ fontSize: '11px', color: '#E4525C', margin: '3px 0 0' }}>{errors.message}</p>}
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={loading} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                padding: '12px 28px',
                                background: loading ? '#6b7280' : 'linear-gradient(135deg, #0B4222, #0d5c30)',
                                color: '#fff', border: 'none', borderRadius: '8px',
                                fontSize: '13.5px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease', alignSelf: 'flex-start',
                                boxShadow: loading ? 'none' : '0 4px 14px rgba(11,66,34,0.35)',
                            }}
                                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(11,66,34,0.45)'; } }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(11,66,34,0.35)'; }}
                            >
                                {loading
                                    ? <><span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'preloaderSpin 0.8s linear infinite' }} /> Sending...</>
                                    : <><FiSend size={14} /> Send Message</>
                                }
                            </button>
                        </form>
                    </div>

                    {/* ─── RIGHT: Info ─── */}
                    <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Business Hours */}
                        <div style={{
                            border: '1.5px solid #e5e7eb', borderRadius: '12px',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                background: '#f3f4f6', padding: '12px 18px',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                borderBottom: '1px solid #e5e7eb',
                            }}>
                                <FiClock size={15} color="#6b7280" />
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151' }}>Business Hours</span>
                            </div>
                            <div style={{ padding: '6px 0' }}>
                                {HOURS.map((h, i) => (
                                    <div key={i} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '10px 18px',
                                        borderBottom: i < HOURS.length - 1 ? '1px solid #f3f4f6' : 'none',
                                    }}>
                                        <span style={{ fontSize: '12.5px', color: '#374151', fontWeight: 500 }}>{h.day}</span>
                                        <span style={{
                                            fontSize: '12px', fontWeight: 600,
                                            color: h.time === 'Closed' ? '#E4525C' : '#0B4222',
                                            background: h.time === 'Closed' ? '#fef2f2' : '#f0faf4',
                                            padding: '2px 8px', borderRadius: '999px',
                                        }}>
                                            {h.time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Tips */}
                        <div style={{
                            background: 'linear-gradient(135deg, #f0faf4, #fafffe)',
                            border: '1.5px solid #bbf7d0',
                            borderRadius: '12px', padding: '16px 18px',
                        }}>
                            <p style={{ fontSize: '12.5px', fontWeight: 700, color: '#0B4222', margin: '0 0 10px' }}>💡 Quick Tips</p>
                            {[
                                'Have your order ID ready for faster support',
                                'WhatsApp is the fastest way to reach us',
                                'Attach screenshots for product issues',
                            ].map((tip, i) => (
                                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: i < 2 ? '8px' : 0 }}>
                                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0B4222', marginTop: '6px', flexShrink: 0 }} />
                                    <p style={{ fontSize: '12px', color: '#374151', margin: 0, lineHeight: 1.6 }}>{tip}</p>
                                </div>
                            ))}
                        </div>

                        {/* Social Quick Links */}
                        <div style={{ border: '1.5px solid #e5e7eb', borderRadius: '12px', padding: '16px 18px' }}>
                            <p style={{ fontSize: '12.5px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 12px' }}>Follow Us</p>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {[
                                    { label: 'Facebook', color: '#1877F2', href: '#' },
                                    { label: 'Instagram', color: '#E1306C', href: '#' },
                                    { label: 'YouTube', color: '#FF0000', href: '#' },
                                ].map((s, i) => (
                                    <a key={i} href={s.href} style={{
                                        padding: '6px 12px',
                                        background: `${s.color}12`,
                                        color: s.color,
                                        fontSize: '11.5px', fontWeight: 600,
                                        borderRadius: '6px', textDecoration: 'none',
                                        transition: 'all 0.2s ease',
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = s.color; e.currentTarget.style.color = '#fff'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = `${s.color}12`; e.currentTarget.style.color = s.color; }}
                                    >
                                        {s.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══════════ MAP ══════════ */}
                <div id="map" style={{ marginBottom: '48px' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        marginBottom: '14px',
                    }}>
                        <FiMapPin size={16} color="#0B4222" />
                        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Our Location</h2>
                    </div>
                    <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #e5e7eb', height: '320px' }}>
                        <iframe
                            title="Dominion Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233668.37666741206!2d90.27923878085938!3d23.780573099999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka!5e0!3m2!1sen!2sbd!4v1713000000000!5m2!1sen!2sbd"
                            width="100%"
                            height="100%"
                            style={{ border: 0, display: 'block' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
