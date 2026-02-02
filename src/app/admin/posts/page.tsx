"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaPen, FaEye, FaTrash, FaEdit } from "react-icons/fa";

import { IPost } from "@/types";
import ConfirmationModal from "@/components/common/ConfirmationModal";

interface Category {
    _id: string;
    name: string;
}

interface Author {
    _id: string;
    name: string;
}

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedAuthor, setSelectedAuthor] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);

    // Delete State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

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

    const fetchFilters = async () => {
        try {
            const [catRes, authorsRes] = await Promise.all([
                fetch("/api/admin/categories"),
                fetch("/api/admin/authors")
            ]);

            if (catRes.ok) setCategories(await catRes.json());
            if (authorsRes.ok) setAuthors(await authorsRes.json());
        } catch (error) {
            console.error("Failed to fetch filters", error);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchFilters();
    }, []);

    // Helper to get author name safely
    const getAuthorName = (post: IPost) => {
        if (post.authorProfile && typeof post.authorProfile === 'object' && 'name' in post.authorProfile) {
            return (post.authorProfile as any).name;
        }
        if (post.author && typeof post.author === 'object' && 'name' in post.author) {
            return post.author.name;
        }
        return "Admin";
    };

    // Filter Logic
    const filteredPosts = posts.filter(post => {
        // Search Filter
        const matchesSearch = searchQuery === "" ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.slug.toLowerCase().includes(searchQuery.toLowerCase());

        // Category Filter
        const matchesCategory = selectedCategory === "" || post.category === selectedCategory;

        // Author Filter
        // Note: we filter by name matching or ID if we stored IDs. 
        // Simplest is to check if the displayed name matches or if the authorProfile ID matches
        const authorName = getAuthorName(post);
        const matchesAuthor = selectedAuthor === "" || (() => {
            // Check if selectedAuthor is an ID
            const profileId = typeof post.authorProfile === 'object' ? (post.authorProfile as any)._id : post.authorProfile;
            if (profileId === selectedAuthor) return true;

            // Fallback: check if the fallback author ID matches (for Admin/Default)
            const authorId = typeof post.author === 'object' ? post.author._id : post.author;
            return authorId === selectedAuthor;
        })();

        return matchesSearch && matchesCategory && matchesAuthor;
    });

    const confirmDelete = (postId: string) => {
        setDeleteId(postId);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);

        try {
            const res = await fetch(`/api/admin/posts/${deleteId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                // Remove from list immediately
                setPosts(prev => prev.filter(p => p._id !== deleteId));
                setDeleteId(null);
            } else {
                alert("Failed to delete post");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting post");
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-gray-500">Loading posts...</div>;
    }

    return (
        <div>
            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
                confirmLabel="Delete Post"
                isDestructive={true}
                isLoading={deleteLoading}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">All Posts</h1>
                <Link
                    href="/admin/posts/create"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm self-start md:self-auto"
                >
                    <FaPen size={14} /> Write New Post
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 mb-6 flex flex-col md:flex-row items-center gap-4 transition-colors">
                <div className="flex-1 w-full relative">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white min-w-[150px] transition-colors"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedAuthor}
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                        className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white min-w-[150px] transition-colors"
                    >
                        <option value="">All Authors</option>
                        {authors.map(author => (
                            <option key={author._id} value={author._id}>{author.name}</option>
                        ))}
                    </select>

                    {(searchQuery || selectedCategory || selectedAuthor) && (
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("");
                                setSelectedAuthor("");
                            }}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-semibold whitespace-nowrap transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-100 dark:border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {filteredPosts.length > 0 ? (
                                filteredPosts.map((post: IPost) => (
                                    <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white line-clamp-1">{post.title}</div>
                                            <div className="text-xs text-gray-400">{post.slug}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden relative">
                                                    {post.author && typeof post.author === 'object' && post.author.image && (
                                                        <Image
                                                            src={post.author.image}
                                                            alt={post.author.name || "Author"}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <span className="text-sm text-gray-600 dark:text-gray-300">{getAuthorName(post) || "Unknown"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                                                {typeof post.category === 'object' ? (post.category as any)?.name : post.category || "Uncategorized"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                target="_blank"
                                                className="inline-flex items-center justify-center p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="View Live"
                                            >
                                                <FaEye />
                                            </Link>
                                            <Link
                                                href={`/admin/posts/edit/${post._id}`}
                                                className="inline-flex items-center justify-center p-2 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                onClick={() => confirmDelete(post._id)}
                                                className="inline-flex items-center justify-center p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No posts found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
