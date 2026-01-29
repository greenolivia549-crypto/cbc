import Link from "next/link";
import Image from "next/image";

import { FaCalendar, FaUser } from "react-icons/fa";

import { IPost } from "@/types";
import Pagination from "@/components/common/Pagination";
import { getPosts } from "@/lib/posts";

export const revalidate = 60;

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const { page } = await searchParams;
    const currentPage = parseInt(page || "1");

    const data = await getPosts({ page: currentPage, limit: 9 });
    const posts = data.posts || [];
    const pagination = data.pagination;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="text-4xl font-bold text-primary mb-4">Latest Articles</h1>
                <p className="text-gray-600">
                    Explore our latest thoughts on sustainable living, technology, and design.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.length > 0 ? (
                    posts.map((post: IPost) => (
                        <article key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                            <Link href={`/blog/${post.slug}`}>
                                <div className="relative h-56 overflow-hidden">
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

                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                        {post.excerpt}
                                    </p>

                                    <span className="inline-block text-primary font-bold text-sm hover:underline">
                                        Read Article →
                                    </span>
                                </div>
                            </Link>
                        </article>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No articles found. Check back soon!
                    </div>
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={pagination?.totalPages || 0}
                baseUrl="/blog"
            />
        </div>
    );
}
