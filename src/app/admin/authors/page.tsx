"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import ConfirmationModal from "@/components/common/ConfirmationModal";

interface Author {
    _id: string;
    name: string;
    email: string;
    bio: string;
    image: string;
    createdAt: string;
}

export default function AdminAuthorsPage() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(true);

    // Delete State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchAuthors = async () => {
        try {
            const res = await fetch("/api/admin/authors");
            if (res.ok) {
                const data = await res.json();
                setAuthors(data);
            }
        } catch (error) {
            console.error("Failed to fetch authors", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    const confirmDelete = (authorId: string) => {
        setDeleteId(authorId);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);

        try {
            const res = await fetch(`/api/admin/authors/${deleteId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setAuthors(prev => prev.filter(a => a._id !== deleteId));
                setDeleteId(null);
            } else {
                alert("Failed to delete author");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting author");
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-gray-500">Loading authors...</div>;
    }

    return (
        <div>
            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Author"
                message="Are you sure you want to delete this author? This action cannot be undone."
                confirmLabel="Delete Author"
                isDestructive={true}
                isLoading={deleteLoading}
            />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Authors</h1>
                <Link
                    href="/admin/authors/create"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                >
                    <FaPlus size={14} /> Add New Author
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {authors.length > 0 ? (
                    authors.map((author) => (
                        <div key={author._id} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 p-6 flex flex-col items-center text-center transition-colors">
                            <Image
                                src={author.image || "/images/authors/default-author.png"}
                                alt={author.name}
                                width={96}
                                height={96}
                                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-50 dark:border-zinc-800"
                            />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{author.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{author.email}</p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-6 flex-grow">{author.bio}</p>

                            <div className="flex gap-2 w-full mt-auto">
                                <Link
                                    href={`/admin/authors/edit/${author._id}`}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors text-sm font-semibold"
                                >
                                    <FaEdit /> Edit
                                </Link>
                                <button
                                    onClick={() => confirmDelete(author._id)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-semibold"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
                        No authors found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
