import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import Link from "next/link";
import Image from "next/image";
import { FaCalendar, FaUser, FaTag } from "react-icons/fa";
import BackButton from "@/components/common/BackButton";

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    await connectToDatabase();

    // Fetch posts by category (case-insensitive)
    // We assume the slug in the URL maps to the category name in the DB
    // Or we could have querying by 'category' field.
    // Given the previous setup, we should probably query by category name regex.

    // Also only show published posts for safety, though not strictly asked, it's consistent.
    const posts = await Post.find({
        category: { $regex: new RegExp(`^${slug}$`, "i") },
        published: true
    }).sort({ createdAt: -1 });

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
                            <article key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                                <Link href={`/blog/${post.slug}`}>
                                    <div className="relative h-56 overflow-hidden">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            unoptimized
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wide flex items-center gap-1">
                                            <FaTag size={10} />
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
                                                {post.author?.name}
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
