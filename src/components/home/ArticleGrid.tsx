"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import LikeButton from "@/components/common/LikeButton";
import { FaCalendar, FaUser, FaFire, FaClock } from "react-icons/fa";

interface Post {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    image: string;
    category: string;
    createdAt: string;
    likes?: number;
    isFavorited?: boolean;
    author?: {
        name: string;
    };
}

export default function ArticleGrid() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch("/api/posts");
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data);
                }
            } catch {
                console.error("Failed to fetch posts");
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Loading latest articles...</div>;
    }

    if (posts.length === 0) {
        return <div className="text-center py-10 text-gray-500">No articles published yet.</div>;
    }

    // Client-side sorting
    const filteredPosts = [...posts].sort((a, b) => {
        if (activeTab === 'latest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
            return (b.likes || 0) - (a.likes || 0);
        }
    });

    return (
        <div>
            {/* Tabs */}
            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-1">
                <button
                    onClick={() => setActiveTab('latest')}
                    className={`flex items-center gap-2 pb-3 px-1 text-sm font-bold transition-all relative ${activeTab === 'latest' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <FaClock />
                    Latest
                    {activeTab === 'latest' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('popular')}
                    className={`flex items-center gap-2 pb-3 px-1 text-sm font-bold transition-all relative ${activeTab === 'popular' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <FaFire />
                    Most Liked
                    {activeTab === 'popular' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                    )}
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((article) => (
                    <article key={article._id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-48 overflow-hidden">
                            <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                unoptimized
                            />
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary capitalize">
                                {article.category}
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                <span className="flex items-center gap-1"><FaCalendar /> {new Date(article.createdAt).toLocaleDateString()}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><FaUser /> {article.author?.name || "Admin"}</span>
                            </div>

                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                <Link href={`/blog/${article.slug}`}>
                                    {article.title}
                                </Link>
                            </h3>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {article.excerpt}
                            </p>

                            <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                                <LikeButton slug={article.slug} initialLikes={article.likes || 0} initialIsFavorited={article.isFavorited} />



                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
