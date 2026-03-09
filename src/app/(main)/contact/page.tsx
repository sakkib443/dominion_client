"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiSend,
    FiChevronRight,
    FiFacebook,
    FiTwitter,
    FiInstagram,
    FiLinkedin,
    FiClock,
    FiCheckCircle
} from 'react-icons/fi';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsSent(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSent(false), 5000);
    };

    const contactInfo = [
        {
            icon: <FiMapPin size={22} />,
            title: "Store Location",
            details: "123 Fashion Street, New York, NY 10001",
            color: "text-blue-600 bg-blue-50"
        },
        {
            icon: <FiPhone size={22} />,
            title: "Phone Number",
            details: "+1 (234) 567-890",
            color: "text-emerald-600 bg-emerald-50"
        },
        {
            icon: <FiMail size={22} />,
            title: "Support Email",
            details: "support@megashop.com",
            color: "text-rose-600 bg-rose-50"
        },
        {
            icon: <FiClock size={22} />,
            title: "Opening Hours",
            details: "Mon - Sat: 9 AM - 10 PM",
            color: "text-amber-600 bg-amber-50"
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Minimal Header */}
            <div className="bg-gray-50/50 border-b border-gray-100 py-16">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
                        <FiChevronRight />
                        <span className="text-gray-900">Contact</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                        Contact <span className="text-[var(--color-primary)]">Us</span>
                    </h1>
                    <p className="mt-4 text-gray-500 font-medium max-w-lg leading-relaxed">
                        We're here to help you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 max-w-7xl py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Contact Details */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                            {contactInfo.map((info, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-5 rounded-md border border-gray-100 bg-white hover:border-[var(--color-primary)] transition-colors group">
                                    <div className={`w-12 h-12 rounded-md ${info.color} flex items-center justify-center shrink-0`}>
                                        {info.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-gray-900 mb-1">{info.title}</h3>
                                        <p className="text-sm text-gray-500 font-medium leading-relaxed">{info.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Connect */}
                        <div className="p-6 rounded-md bg-gray-900 text-white">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6">Connect With Us</h3>
                            <div className="flex gap-3">
                                {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
                                    <button key={i} className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-all">
                                        <Icon size={18} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-md p-8 md:p-10 border border-gray-100 shadow-sm">
                            <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Send Message</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-md px-5 py-3.5 text-sm font-medium outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-md px-5 py-3.5 text-sm font-medium outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border border-gray-100 rounded-md px-5 py-3.5 text-sm font-medium outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all"
                                        placeholder="Message Subject"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Message</label>
                                    <textarea
                                        rows={5}
                                        required
                                        className="w-full bg-gray-50 border border-gray-100 rounded-md px-5 py-3.5 text-sm font-medium outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all resize-none"
                                        placeholder="How can we assist you?"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full md:w-auto min-w-[180px] h-14 rounded-md font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isSent
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-gray-900 text-white hover:bg-[var(--color-primary)] active:scale-95 shadow-lg shadow-gray-200 hover:shadow-[var(--color-primary)]/20'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : isSent ? (
                                        <><FiCheckCircle size={18} /> Sent Successfully</>
                                    ) : (
                                        <><FiSend size={18} /> Send Message</>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stylized Map View */}
            <div className="container mx-auto px-4 md:px-8 max-w-7xl mb-24">
                <div className="w-full h-[400px] bg-gray-100 rounded-md relative overflow-hidden group shadow-sm">
                    <img
                        src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000"
                        className="w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 transition-transform duration-1000"
                        alt="Location"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white p-8 rounded-md shadow-2xl text-center max-w-xs border border-gray-50 transform hover:-translate-y-2 transition-all duration-300">
                            <div className="w-12 h-12 bg-[var(--color-primary)] text-white rounded-md flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                                <FiMapPin size={24} />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 mb-1 tracking-tight">VISIT US</h3>
                            <p className="text-xs text-gray-500 font-medium px-4 leading-relaxed">Fashion Avenue, NY 10001, United States</p>
                            <button className="mt-4 text-[9px] font-black text-[var(--color-primary)] uppercase tracking-widest hover:underline">View Map Location</button>
                        </div>
                    </div>
                    {/* Minimal pattern overlay */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                </div>
            </div>

            <style jsx>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
