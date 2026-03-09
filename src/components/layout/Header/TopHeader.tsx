"use client";

import React from 'react';
import { FiPhone, FiMail, FiMapPin, FiTwitter, FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';

const TopHeader: React.FC = () => {
    return (
        <div className="bg-[#1a1a2e] text-white py-2.5 hidden md:block">
            <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 flex justify-between items-center">
                {/* Left Side: Contact Info */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[13px] text-gray-300">
                        <FiPhone className="text-white/70" size={13} />
                        <a href="tel:01753923093" className="hover:text-white transition-colors">01753923093</a>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-gray-300">
                        <BsWhatsapp className="text-white/70" size={13} />
                        <a href="https://wa.me/01322840808" className="hover:text-white transition-colors">01322840808</a>
                    </div>
                </div>

                {/* Right Side: Links & Social */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-5 text-[13px] text-gray-300">
                        <a href="#" className="hover:text-white transition-colors">Track Order</a>
                        <span className="text-gray-600">|</span>
                        <a href="#" className="hover:text-white transition-colors">FAQ</a>
                        <span className="text-gray-600">|</span>
                        <a href="#" className="hover:text-white transition-colors">English</a>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400 border-l border-gray-700 pl-6">
                        {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
                            <a key={i} href="#" className="hover:text-white transition-colors">
                                <Icon size={14} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopHeader;
