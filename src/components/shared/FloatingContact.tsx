"use client";

import React, { useState } from 'react';
import { FiPhone, FiX } from 'react-icons/fi';

const FloatingContact: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const phoneNumber = "+880 1XXX-XXXXXX";
    const whatsappLink = `https://wa.me/880XXXXXXXXXX`;
    const messengerLink = "https://m.me/YOUR_PAGE_USERNAME";

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">
            {/* WhatsApp & Messenger Options */}
            <div
                className={`flex flex-col items-end gap-2 transition-all duration-300 ${isOpen
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
            >
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(37, 211, 102, 0.4))' }}
                >
                    <svg viewBox="0 0 24 24" fill="#25D366" width="18" height="18">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span className="text-[#25D366] text-sm font-semibold">WhatsApp</span>
                </a>

                <a
                    href={messengerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(0, 106, 255, 0.4))' }}
                >
                    <svg viewBox="0 0 24 24" fill="#006AFF" width="18" height="18">
                        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.2l3.131 3.26 5.886-3.26-6.558 6.763z" />
                    </svg>
                    <span className="text-[#006AFF] text-sm font-semibold">Messenger</span>
                </a>
            </div>

            {/* Phone Number — visible text with subtle backdrop */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 cursor-pointer border-none bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-sm"
                style={{
                    filter: isOpen
                        ? 'none'
                        : 'drop-shadow(0 0 8px rgba(11, 66, 34, 0.3))',
                }}
            >
                {isOpen ? (
                    <FiX size={20} className="text-[#E4525C]" />
                ) : (
                    <FiPhone size={20} className="text-[#0B4222]" />
                )}
                <span
                    className="font-extrabold text-base whitespace-nowrap"
                    style={{
                        color: isOpen ? '#E4525C' : '#0B4222',
                    }}
                >
                    {isOpen ? 'বন্ধ করুন' : phoneNumber}
                </span>
            </button>
        </div>
    );
};

export default FloatingContact;
