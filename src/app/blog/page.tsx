import Link from "next/link";
import Image from "next/image";

import { FaCalendar, FaUser } from "react-icons/fa";

import { IPost } from "@/types";
import Pagination from "@/components/common/Pagination";
import ArticleCard from "@/components/common/ArticleCard";
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
                        <ArticleCard key={post._id} post={post} />
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
