"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPen, FaEye, FaTrash, FaEdit } from "react-icons/fa";

import { IPost } from "@/types";

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/admin/posts");
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (postId: string) => {
        if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/posts/${postId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                // Remove from list immediately
                setPosts(prev => prev.filter(p => p._id !== postId));
            } else {
                alert("Failed to delete post");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting post");
        }
    };

    if (loading) {
        return <div className="p-8 text-gray-500">Loading posts...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
                <Link
                    href="/admin/posts/create"
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                    <FaPen size={14} /> Write New Post
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-gray-700 text-sm">Title</th>
                            <th className="px-6 py-4 font-bold text-gray-700 text-sm">Category</th>
                            <th className="px-6 py-4 font-bold text-gray-700 text-sm">Author</th>
                            <th className="px-6 py-4 font-bold text-gray-700 text-sm">Status</th>
                            <th className="px-6 py-4 font-bold text-gray-700 text-sm">Date</th>
                            <th className="px-6 py-4 font-bold text-gray-700 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {posts.length > 0 ? (
                            posts.map((post: IPost) => (
                                <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 line-clamp-1">{post.title}</div>
                                        <div className="text-xs text-gray-400 font-mono mt-1">/{post.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{(typeof post.author === 'object' && post.author?.name) || "Admin"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${post.published
                                            ? "bg-green-50 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                            }`}>
                                            {post.published ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                target="_blank"
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                title="View Live"
                                            >
                                                <FaEye size={12} />
                                            </Link>
                                            <Link
                                                href={`/admin/posts/edit/${post._id}`}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors"
                                                title="Edit"
                                            >
                                                <FaEdit size={12} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post._id)}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                title="Delete"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No posts found. Why not create one?
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
