"use client";

import { useState } from "react";
import ArticleCard from "@/components/common/ArticleCard";
import { FaFire, FaClock } from "react-icons/fa";
import { m } from "framer-motion";

import { IPost } from "@/types";

export default function ArticleGrid({ initialPosts = [] }: { initialPosts?: IPost[] }) {
    const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');

    if (initialPosts.length === 0) {
        return <div className="text-center py-10 text-gray-500">No articles published yet.</div>;
    }

    // Client-side sorting
    const filteredPosts = [...initialPosts].sort((a, b) => {
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
            {/* Grid */}
            <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                {filteredPosts.map((post) => (
                    <ArticleCard key={post._id} post={post} />
                ))}
            </m.div>
        </div>
    );
}
