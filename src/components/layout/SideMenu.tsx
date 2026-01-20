import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFire, FaEnvelope } from "react-icons/fa";

interface Post {
    _id: string;
    title: string;
    slug: string;
    likes?: number;
}

export default function SideMenu() {
    const [popularPosts, setPopularPosts] = useState<Post[]>([]);

    useEffect(() => {
        async function fetchPopular() {
            try {
                const res = await fetch("/api/posts");
                if (res.ok) {
                    const data = await res.json();
                    // Sort by likes desc
                    const sorted = data.sort((a: Post, b: Post) => (b.likes || 0) - (a.likes || 0)).slice(0, 5);
                    setPopularPosts(sorted);
                }
            } catch {
                console.error("Failed to fetch popular posts");
            }
        }
        fetchPopular();
    }, []);

    return (
        <aside className="space-y-8">
            {/* Popular Posts Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="flex items-center gap-2 text-xl font-bold text-primary mb-6">
                    <FaFire className="text-orange-500" />
                    Popular Posts
                </h3>
                <ul className="space-y-4">
                    {popularPosts.length > 0 ? (
                        popularPosts.map((post) => (
                            <li key={post._id}>
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="flex items-center justify-between group"
                                >
                                    <span className="text-gray-700 font-medium group-hover:text-primary transition-colors line-clamp-1">
                                        {post.title}
                                    </span>
                                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors min-w-[20px] text-center">
                                        {post.likes || 0}
                                    </span>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500 text-sm">No popular posts yet.</li>
                    )}
                </ul>
            </div>

            {/* Newsletter Widget */}
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                <h3 className="flex items-center gap-2 text-lg font-bold text-primary mb-2">
                    <FaEnvelope />
                    Newsletter
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Get the latest green news directly in your inbox.
                </p>
                <div className="space-y-2">
                    <input
                        type="email"
                        placeholder="Your email address"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                    <button className="w-full bg-primary text-white font-medium py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm">
                        Subscribe
                    </button>
                </div>
            </div>

            {/* Social Proof / Comments Widget could go here */}
        </aside>
    );
}
