import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFire } from "react-icons/fa";

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
