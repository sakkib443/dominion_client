"use client";

import React, { useState, useEffect } from 'react';

const Preloader: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate progress while actual data loads
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + Math.random() * 15;
            });
        }, 200);

        // Check if page content is ready
        const handleLoad = () => {
            setProgress(100);
            setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => {
                    setIsLoading(false);
                }, 800);
            }, 400);
        };

        // Wait for window load or timeout (max 4 seconds)
        if (document.readyState === 'complete') {
            setTimeout(handleLoad, 1500);
        } else {
            window.addEventListener('load', () => setTimeout(handleLoad, 800));
        }

        // Safety timeout — never show preloader more than 4 seconds
        const safetyTimeout = setTimeout(handleLoad, 4000);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(safetyTimeout);
            window.removeEventListener('load', handleLoad);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div
            className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[#0B4222] transition-all duration-700 ${
                fadeOut ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
            style={{ pointerEvents: fadeOut ? 'none' : 'auto' }}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Animated gradient circles */}
                <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-[#0d5229]/40 blur-3xl preloader-float" />
                <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-[#0a3a1e]/50 blur-3xl preloader-float-reverse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#0d5229]/20 blur-2xl preloader-pulse-slow" />
                
                {/* Grid pattern overlay */}
                <div 
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Logo / Brand Mark */}
                <div className="relative">
                    {/* Outer ring animation */}
                    <div className="w-28 h-28 rounded-full border-2 border-white/10 flex items-center justify-center preloader-spin-slow">
                        <div className="absolute w-full h-full rounded-full border-t-2 border-r-2 border-emerald-300/60 preloader-spin" />
                    </div>
                    
                    {/* Inner logo area */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center preloader-pulse-glow">
                            <span className="text-3xl font-black text-white tracking-tighter select-none">
                                D
                            </span>
                        </div>
                    </div>

                    {/* Orbiting dots */}
                    <div className="absolute inset-[-8px] preloader-spin-reverse">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-300 shadow-lg shadow-emerald-300/50" />
                    </div>
                    <div className="absolute inset-[-16px] preloader-spin-slow">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/60" />
                    </div>
                </div>

                {/* Brand Name */}
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-[0.2em] uppercase preloader-text-reveal">
                        DOMINION
                    </h1>
                    <div className="mt-2 h-[1px] bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent preloader-line-expand" />
                    <p className="mt-3 text-emerald-200/60 text-xs tracking-[0.35em] uppercase font-medium preloader-fade-in-delay">
                        Premium Shopping Experience
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-48 sm:w-64">
                    <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-emerald-300 via-white to-emerald-300 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-emerald-200/40 font-medium tracking-widest uppercase">Loading</span>
                        <span className="text-[10px] text-emerald-200/60 font-bold tabular-nums">
                            {Math.round(Math.min(progress, 100))}%
                        </span>
                    </div>
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-emerald-300/30"
                            style={{
                                left: `${20 + i * 12}%`,
                                top: `${30 + (i % 3) * 20}%`,
                                animation: `preloaderParticle ${2 + i * 0.5}s ease-in-out infinite ${i * 0.3}s`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Preloader;
