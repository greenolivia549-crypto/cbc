"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

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

    const handleDelete = async (authorId: string) => {
        if (!confirm("Are you sure you want to delete this author?")) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/authors/${authorId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setAuthors(prev => prev.filter(a => a._id !== authorId));
            } else {
                alert("Failed to delete author");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting author");
        }
    };

    if (loading) {
        return <div className="p-8 text-gray-500">Loading authors...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Authors</h1>
                <Link
                    href="/admin/authors/create"
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                    <FaPlus size={14} /> Add New Author
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {authors.length > 0 ? (
                    authors.map((author) => (
                        <div key={author._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                            <Image
                                src={author.image || "/images/authors/default-author.png"}
                                alt={author.name}
                                width={96}
                                height={96}
                                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-50"
                                unoptimized
                            />
                            <h3 className="text-xl font-bold text-gray-900">{author.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{author.email}</p>
                            <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">{author.bio}</p>

                            <div className="flex gap-2 w-full mt-auto">
                                <Link
                                    href={`/admin/authors/edit/${author._id}`}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-semibold"
                                >
                                    <FaEdit /> Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(author._id)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-semibold"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        No authors found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
