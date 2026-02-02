"use client";

import Link from "next/link";
import { FaFire } from "react-icons/fa";

import { IPost } from "@/types";

export default function SideMenu({ popularPosts = [] }: { popularPosts?: IPost[] }) {
    // Used to basic client side hydration if needed, but here we just render props

    return (
        <aside className="space-y-8">
            {/* Popular Posts Widget */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-200 dark:border-white/10">
                <h3 className="flex items-center gap-2 text-xl font-bold text-primary mb-6">
                    <FaFire className="text-orange-500" />
                    Popular Posts
                </h3>
                <ul className="space-y-4">
                    {popularPosts.length > 0 ? (
                        popularPosts.map((post) => (
                            <li key={post._id} className="border-b border-zinc-100 dark:border-white/5 last:border-0 pb-3 last:pb-0">
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="flex items-center justify-between group"
                                >
                                    <span className="text-foreground font-medium group-hover:text-primary transition-colors line-clamp-1">
                                        {post.title}
                                    </span>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500 text-sm">No popular posts yet.</li>
                    )}
                </ul>
            </div>
        </aside>
    );
}
