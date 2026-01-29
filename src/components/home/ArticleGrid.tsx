"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import LikeButton from "@/components/common/LikeButton";
import { FaCalendar, FaUser, FaFire, FaClock } from "react-icons/fa";

import { IPost } from "@/types";

export default function ArticleGrid({ initialPosts = [] }: { initialPosts?: IPost[] }) {
    const [posts, setPosts] = useState<IPost[]>(initialPosts);
    const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');

    if (posts.length === 0) {
        return <div className="text-center py-10 text-gray-500">No articles published yet.</div>;
    }

    // Client-side sorting
    const filteredPosts = [...posts].sort((a, b) => {
        if (activeTab === 'latest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
            const likesB = b.likes ?? 0;
            const likesA = a.likes ?? 0;
            return likesB - likesA;
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
                    Popular
                    {activeTab === 'popular' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                    )}
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post) => (
                    <article key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                        <Link href={`/blog/${post.slug}`}>
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wide">
                                    {post.category}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                    <span className="flex items-center gap-1">
                                        <FaCalendar className="text-primary/70" />
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaUser className="text-primary/70" />
                                        {(typeof post.author === 'object' && post.author?.name) || "Admin"}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <span className="text-sm font-bold text-primary group-hover:underline">
                                        Read Article
                                    </span>
                                    {/* Pass likes and isFavorited to LikeButton to avoid initial fetch if possible */}
                                    {/* LikeButton currently fetches on mount, we can optimize later, but for now passing slug is enough */}
                                    <LikeButton slug={post.slug} initialLikes={post.likes} initialIsFavorited={post.isFavorited} />
                                </div>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    );
}
