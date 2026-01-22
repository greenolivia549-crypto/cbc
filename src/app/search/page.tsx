"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaCalendar, FaUser, FaSearch } from "react-icons/fa";

interface Post {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    description: string;
    image: string;
    category: string;
    createdAt: string;
    author: {
        name: string;
    };
}

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");
    const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                // If no query and no category, we might want to return nothing.
                if (!query) {
                    setPosts([]);
                    setLoading(false);
                    return;
                }

                let url = `/api/posts?q=${encodeURIComponent(query)}`;
                if (selectedCategory) {
                    url += `&category=${selectedCategory}`;
                }

                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data);
                }
            } catch (error) {
                console.error("Failed to fetch search results", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [query, selectedCategory]);

    if (!query) {
        return (
            <div className="text-center py-20">
                <FaSearch className="mx-auto text-6xl text-gray-200 mb-6" />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Search GreenBlog</h1>
                <p className="text-gray-500 text-lg">Enter a keyword to start searching for articles.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                    Search Results for <span className="text-primary">"{query}"</span>
                </h1>

                {/* Category Filter */}
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700 bg-white"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat.slug} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center items-center min-h-[40vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <article key={post._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                            <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    unoptimized
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        {post.category}
                                    </span>
                                </div>
                            </Link>

                            <div className="p-6">
                                <Link href={`/blog/${post.slug}`}>
                                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                </Link>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {post.excerpt || post.description}
                                </p>
                                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <FaUser className="text-primary/60" />
                                        <span>{post.author?.name || "Admin"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaCalendar className="text-primary/60" />
                                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500 text-lg">No results found for "{query}"{selectedCategory && ` in ${selectedCategory}`}.</p>
                    <p className="text-gray-400 mt-2">Try checking your spelling or use different keywords.</p>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-12 pb-24">
            <div className="container mx-auto px-4">
                <Suspense fallback={<div>Loading search...</div>}>
                    <SearchResults />
                </Suspense>
            </div>
        </div>
    );
}
