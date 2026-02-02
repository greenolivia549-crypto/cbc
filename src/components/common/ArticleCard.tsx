"use client";

import Link from "next/link";
import Image from "next/image";
import { FaCalendar, FaUser } from "react-icons/fa";
import { m } from "framer-motion";
import LikeButton from "@/components/common/LikeButton";
import { IPost } from "@/types";

interface ArticleCardProps {
    post: IPost;
    index?: number; // Optional for staggered animation delay if needed
}

export default function ArticleCard({ post }: ArticleCardProps) {
    return (
        <m.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 border border-zinc-200 dark:border-white/5"
        >
            <Link href={`/blog/${post.slug}`}>
                <div className="relative h-56 overflow-hidden">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 left-4 glass px-4 py-1.5 rounded-full text-xs font-bold text-black dark:text-white uppercase tracking-wide backdrop-blur-md">
                        {post.category}
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 mb-3 font-medium">
                        <span className="flex items-center gap-1">
                            <FaCalendar className="text-primary/70" />
                            {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <FaUser className="text-primary/70" />
                            {(typeof post.authorProfile === 'object' && (post.authorProfile as any)?.name) || (typeof post.author === 'object' && (post.author as any)?.name) || "Admin"}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-zinc-900 dark:text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight font-serif tracking-tight">
                        {post.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-300 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-white/10">
                        <span className="text-sm font-bold text-primary group-hover:underline">
                            Read Article
                        </span>
                        <LikeButton slug={post.slug} initialLikes={post.likes || 0} initialIsFavorited={post.isFavorited} />
                    </div>
                </div>
            </Link>
        </m.article>
    );
}
