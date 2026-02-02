"use client";

import { useState, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import Link from "next/link";
import NextImage from "next/image";

import { IPost } from "@/types";

export default function TrendingSlider({ posts }: { posts: IPost[] }) {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);


    const nextSlide = useCallback(() => {
        if (posts.length === 0) return;
        setCurrent((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
    }, [posts]);

    const prevSlide = () => {
        if (posts.length === 0) return;
        setCurrent((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
    };

    useEffect(() => {
        if (paused) return; // Do not set interval if paused

        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [nextSlide, current, paused]);

    if (!posts || posts.length === 0) {
        return null; // Or a loading skeleton
    }

    if (!posts[current]) return null;

    return (
        <section
            className="relative w-full h-[500px] bg-gray-900 overflow-hidden group"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <AnimatePresence>
                <m.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    <div className="absolute inset-0 overflow-hidden">
                        <m.div
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 10, ease: "linear" }}
                            className="relative w-full h-full"
                        >
                            <NextImage
                                src={posts[current]?.image || ''}
                                alt={posts[current]?.title || 'Trending Post'}
                                fill
                                className="object-cover"
                                priority
                            />
                        </m.div>
                        <div className="absolute inset-0 bg-black/60" /> {/* Darker Overlay for better text contrast */}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                        <div className="max-w-3xl text-white">
                            <m.span
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-full"
                            >
                                Trending Now
                            </m.span>
                            <m.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="text-4xl md:text-6xl font-bold mb-4 font-serif tracking-tight"
                            >
                                <Link
                                    href={posts[current].slug !== '#' ? `/blog/${posts[current].slug}` : '#'}
                                    className="hover:underline decoration-2 underline-offset-4 transition-all"
                                >
                                    {posts[current].title}
                                </Link>
                            </m.h2>
                            <m.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="text-lg md:text-xl text-gray-200 line-clamp-2"
                            >
                                {posts[current].excerpt}
                            </m.p>
                        </div>
                    </div>
                </m.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full glass text-white hover:scale-110 transition-all z-10 shadow-lg"
                aria-label="Previous Slide"
            >
                <FaChevronLeft size={20} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full glass text-white hover:scale-110 transition-all z-10 shadow-lg"
                aria-label="Next Slide"
            >
                <FaChevronRight size={20} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {posts.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className="relative flex items-center justify-center p-2 focus:outline-none group/indicator"
                        aria-label={`Go to slide ${idx + 1}`}
                    >
                        <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${current === idx
                                ? "w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                : "w-1.5 bg-white/40 hover:bg-white/60"
                                }`}
                        />
                    </button>
                ))}
            </div>
        </section>
    );
}
