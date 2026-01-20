import Image from "next/image";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import Interactions from "@/components/blog/Interactions";
import { FaCalendar, FaUser } from "react-icons/fa";

import BackButton from "@/components/common/BackButton";

// Helper to get post
async function getPost(slug: string) {
    await connectToDatabase();
    // Try finding in DB
    const post = await Post.findOne({ slug }).populate("author", "name");
    if (post) return post;

    return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return {
            title: "Post Not Found",
            description: "The article you are looking for does not exist."
        };
    }

    return {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        keywords: post.keywords ? post.keywords.split(",") : [post.category, "blog", "green energy"],
        openGraph: {
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt,
            url: `https://your-domain.com/blog/${post.slug}`,
            images: [
                {
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
            type: "article",
        },
    };
}

export default async function SinglePostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-white pb-20">
            {/* Hero Header */}
            <div className="w-full h-[400px] md:h-[500px] relative">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white max-w-5xl mx-auto">
                    <BackButton />

                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm font-medium">
                        <span className="bg-primary px-3 py-1 rounded-full">{post.category}</span>
                        <span className="flex items-center gap-2">
                            <FaCalendar />
                            {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-2">
                            <FaUser />
                            {post.author?.name || "Admin"}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                        {post.title}
                    </h1>

                    <p className="text-lg md:text-xl text-gray-200 max-w-3xl">
                        {post.excerpt}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 mt-12">
                <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">

                    {/* Main Article Body */}
                    <div className="lg:w-2/3">
                        <div
                            className="prose prose-lg prose-green max-w-none text-gray-800"
                            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
                        />
                        {/* Note: In a real app, use a markdown renderer like 'react-markdown' instead of dangerous HTML */}

                        {/* Tags / Interactions placeholder */}
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Share this article</h3>
                            <div className="flex gap-4">
                                {/* Social Share Buttons Placeholder */}
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">Facebook</button>
                                <button className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-bold">Twitter</button>
                                <button className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-bold">LinkedIn</button>
                            </div>
                        </div>

                        <Interactions slug={post.slug} initialLikes={post.likes} />
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-1/3 space-y-8">
                        {/* Author Box */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">About the Author</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xl">
                                    <FaUser />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{post.author?.name || "Admin"}</p>
                                    <p className="text-xs text-gray-500">Content Creator</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                Passionate about green energy and sustainable living practices.
                            </p>
                        </div>
                    </aside>

                </div>
            </div>
        </article>
    );
}
