"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import Link from "next/link";

interface Post {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    image: string;
    featured?: boolean;
}

export default function TrendingSlider() {
    const [current, setCurrent] = useState(0);
    const [articles, setArticles] = useState<Post[]>([]);

    useEffect(() => {
        async function fetchFeatured() {
            try {
                const res = await fetch("/api/posts?featured=true");
                if (res.ok) {
                    const data = await res.json();
                    // Filter client side if API returns all, or rely on API if implemented
                    // Assuming API currently returns all, let's filter here just in case
                    const featured = data.filter((p: Post) => p.featured).slice(0, 5);
                    if (featured.length > 0) {
                        setArticles(featured);
                    } else if (data.length > 0) {
                        // Fallback to latest 3 if no featured
                        setArticles(data.slice(0, 3));
                    }
                }
            } catch {
                console.error("Failed to fetch featured posts");
            }
        }
        fetchFeatured();
    }, []);

    const nextSlide = useCallback(() => {
        if (articles.length === 0) return;
        setCurrent((prev) => (prev === articles.length - 1 ? 0 : prev + 1));
    }, [articles]);

    const prevSlide = () => {
        if (articles.length === 0) return;
        setCurrent((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
    };



    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    if (!articles || articles.length === 0 || !articles[current]) {
        return null; // Or a loading skeleton
    }

    return (
        <section className="relative w-full h-[500px] bg-gray-900 overflow-hidden">
            <AnimatePresence>
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${articles[current]?.image || ''})` }}
                    >
                        <div className="absolute inset-0 bg-black/50" /> {/* Overlay */}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                        <div className="max-w-3xl text-white">
                            <motion.span
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider bg-primary rounded-full"
                            >
                                Trending Now
                            </motion.span>
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="text-4xl md:text-6xl font-bold mb-4 hover:text-primary transition-colors"
                            >
                                <Link href={articles[current].slug !== '#' ? `/blog/${articles[current].slug}` : '#'}>
                                    {articles[current].title}
                                </Link>
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="text-lg md:text-xl text-gray-200"
                            >
                                {articles[current].excerpt}
                            </motion.p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors z-10 backdrop-blur-sm"
            >
                <FaChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors z-10 backdrop-blur-sm"
            >
                <FaChevronRight size={24} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {articles.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className="relative w-3 h-3 flex items-center justify-center"
                    >
                        <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${current === idx ? "bg-transparent" : "bg-white/50 hover:bg-white"}`} />

                        {current === idx && (
                            <motion.div
                                layoutId="active-indicator"
                                className="absolute inset-0 bg-primary rounded-full w-8 -left-2.5"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>
        </section>
    );
}
