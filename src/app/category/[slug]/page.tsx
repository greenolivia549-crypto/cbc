import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import Category from "@/models/Category";
import Link from "next/link";
import Image from "next/image";
import { FaCalendar, FaUser, FaTag } from "react-icons/fa";
import BackButton from "@/components/common/BackButton";
import ArticleCard from "@/components/common/ArticleCard";

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    await connectToDatabase();

    // 1. Find the category document by slug to get the correct 'name'
    // This is important if 'category' in Post is stored as 'Name' but slug is 'slug'
    const categoryDoc = await Category.findOne({ slug: slug });

    let posts = [];
    if (categoryDoc) {
        // If category found, search posts by that category name (case-insensitive for safety)
        posts = await Post.find({
            category: { $regex: new RegExp(`^${categoryDoc.name}$`, "i") },
            published: true
        }).sort({ createdAt: -1 }).populate("author", "name").populate("authorProfile");
    } else {
        // Fallback: search by slug directly if for some reason category doc doesn't exist but posts use the slug (unlikely but safe)
        posts = await Post.find({
            category: { $regex: new RegExp(`^${slug}$`, "i") },
            published: true
        }).sort({ createdAt: -1 }).populate("author", "name").populate("authorProfile");
    }

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <BackButton />
                    <div>
                        <span className="text-primary font-bold uppercase tracking-wide text-sm">Category</span>
                        <h1 className="text-4xl font-bold text-gray-900 capitalize">{slug}</h1>
                    </div>
                </div>

                {/* Grid */}
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <ArticleCard key={post._id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No articles found</h3>
                        <p className="text-gray-500">
                            We haven&apos;t published any articles in the <span className="font-bold text-primary">&quot;{slug}&quot;</span> category yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
