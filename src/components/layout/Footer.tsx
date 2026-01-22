"use client";

import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface Category {
    _id: string;
    name: string;
    slug: string;
}

export default function Footer() {
    const { data: session } = useSession();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">GreenBlog</h2>
                        <p className="text-green-100 text-sm leading-relaxed">
                            A professional platform dedicated to sustainable living, green technology, and modern eco-friendly lifestyles.
                        </p>
                        <div className="flex gap-4">
                            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                >
                                    <Icon size={14} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-green-100">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Latest Articles</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/help-centre" className="hover:text-white transition-colors">Help Centre</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Popular Categories</h3>
                        <ul className="space-y-3 text-sm text-green-100">
                            {categories.length > 0 ? (
                                categories.slice(0, 6).map((cat) => (
                                    <li key={cat._id || cat.slug}>
                                        <Link href={`/category/${cat.slug}`} className="hover:text-white transition-colors">
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li>No categories available</li>
                            )}
                        </ul>
                    </div>


                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-green-200">
                    <p>© 2026 GreenBlog. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        {session?.user.role === "admin" ? (
                            <Link href="/admin" className="text-yellow-300 font-bold hover:text-white transition-colors">Go to Dashboard</Link>
                        ) : (
                            <Link href="/auth/signin" className="hover:text-white transition-colors">Admin Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}
