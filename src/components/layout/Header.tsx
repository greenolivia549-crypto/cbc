"use client";

import Link from "next/link";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

interface Category {
    _id: string;
    name: string;
    slug: string;
}

export default function Header() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const menuRef = useRef<HTMLDivElement>(null);

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

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo / Brand */}
                <Link href="/" className="text-2xl font-bold tracking-tight">
                    GreenBlog
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className="hover:text-green-200 transition-colors">
                        Home
                    </Link>

                    <Link href="/blog" className="hover:text-green-200 transition-colors">
                        Latest Blog
                    </Link>


                    {/* Categories Dropdown */}
                    <div className="relative group">
                        <button
                            className="flex items-center gap-1 hover:text-green-200 transition-colors py-4"
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            onMouseEnter={() => setIsCategoryOpen(true)}
                        >
                            Categories <FaChevronDown size={10} />
                        </button>

                        {/* Dropdown Panel */}
                        <div
                            className="absolute top-full left-0 w-48 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-100 py-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0"
                            onMouseEnter={() => setIsCategoryOpen(true)}
                            onMouseLeave={() => setIsCategoryOpen(false)}
                        >
                            {categories.length > 0 ? (
                                categories.map((cat) => (
                                    <Link
                                        key={cat._id || cat.slug}
                                        href={`/category/${cat.slug}`}
                                        className="block px-4 py-2 hover:bg-green-50 hover:text-primary text-sm font-medium"
                                    >
                                        {cat.name}
                                    </Link>
                                ))
                            ) : (
                                <span className="block px-4 py-2 text-sm text-gray-500">No categories</span>
                            )}
                        </div>
                    </div>


                    <Link href="/about" className="hover:text-green-200 transition-colors">
                        About Us
                    </Link>
                    <Link href="/faqs" className="hover:text-green-200 transition-colors">
                        FAQs
                    </Link>
                    <Link href="/contact" className="hover:text-green-200 transition-colors">
                        Contact
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">

                    <div className="flex items-center gap-2">
                        {session ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
                                >
                                    <FaUserCircle className="text-lg" />
                                    <span className="max-w-[100px] truncate hidden sm:block">{session.user?.name || "User"}</span>
                                </button>

                                {/* Dropdown Menu */}
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                            <p className="text-xs text-gray-500">Signed in as</p>
                                            <p className="font-bold truncate text-primary">{session.user?.email}</p>
                                        </div>
                                        {session.user?.role === "admin" && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="block px-4 py-2 hover:bg-green-50 hover:text-primary text-sm"
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block px-4 py-2 hover:bg-green-50 hover:text-primary text-sm"
                                        >
                                            Your Profile
                                        </Link>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full text-left px-4 py-2 hover:bg-red-50 hover:text-red-600 text-sm"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/auth/signin"
                                className="px-4 py-1.5 rounded-full bg-white text-primary font-medium hover:bg-green-50 transition-colors text-sm"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
