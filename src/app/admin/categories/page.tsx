"use client";

import { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaTag, FaEdit, FaSave, FaTimes } from "react-icons/fa";

interface Category {
    _id: string;
    name: string;
    slug: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newName, setNewName] = useState("");
    const [loading, setLoading] = useState(true);
    const [createLoading, setCreateLoading] = useState(false);

    // Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/admin/categories");
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch {
            console.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setCreateLoading(true);
        try {
            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName }),
            });

            if (res.ok) {
                setNewName("");
                fetchCategories();
            } else {
                const data = await res.json();
                alert(data.message);
            }
        } catch {
            alert("Failed to create category");
        } finally {
            setCreateLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this category?")) return;

        try {
            const res = await fetch(`/api/admin/categories?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setCategories(prev => prev.filter(c => c._id !== id));
            }
        } catch {
            alert("Failed to delete category");
        }
    };

    const startEditing = (category: Category) => {
        setEditingId(category._id);
        setEditName(category.name);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditName("");
    };

    const handleUpdate = async () => {
        if (!editName.trim()) return;
        setEditLoading(true);

        try {
            const res = await fetch("/api/admin/categories", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editingId, name: editName }),
            });

            if (res.ok) {
                const updatedCat = await res.json();
                setCategories(prev => prev.map(c => c._id === editingId ? updatedCat : c));
                cancelEditing();
            } else {
                const data = await res.json();
                alert(data.message);
            }
        } catch {
            alert("Failed to update category");
        } finally {
            setEditLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading categories...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <FaTag size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-500">Manage blog categories</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="font-bold text-gray-900 mb-4">Add New Category</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            placeholder="Category Name"
                            required
                        />
                        <button
                            type="submit"
                            disabled={createLoading}
                            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-70"
                        >
                            {createLoading ? "Adding..." : <><FaPlus size={12} /> Add Category</>}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="md:col-span-2 space-y-4">
                    {categories.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">
                            No categories yet. Create one!
                        </div>
                    ) : (
                        categories.map((category) => (
                            <div key={category._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group">
                                {editingId === category._id ? (
                                    <div className="flex-1 flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="flex-1 px-3 py-1 border border-primary rounded outline-none"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleUpdate}
                                            disabled={editLoading}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                                            title="Save"
                                        >
                                            <FaSave />
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded"
                                            title="Cancel"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{category.name}</h4>
                                            <code className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded mt-1 inline-block">
                                                /{category.slug}
                                            </code>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEditing(category)}
                                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category._id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
