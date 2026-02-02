"use client";

import { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaTag, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import ConfirmationModal from "@/components/common/ConfirmationModal";

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
    // Removed editName, using newName for both
    // const [editName, setEditName] = useState("");
    const [editLoading, setEditLoading] = useState(false);

    // Delete Confirmation State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        if (editingId) {
            await handleUpdate();
        } else {
            await handleCreate();
        }
    };

    const handleCreate = async () => {
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

    const confirmDelete = (id: string) => {
        setDeleteId(id);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);

        try {
            const res = await fetch(`/api/admin/categories?id=${deleteId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setCategories(prev => prev.filter(c => c._id !== deleteId));
                setDeleteId(null);
            }
        } catch {
            alert("Failed to delete category");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingId(category._id);
        setNewName(category.name);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setNewName("");
    };

    const handleUpdate = async () => {
        if (!newName.trim()) return;
        setCreateLoading(true); // Reuse create loading state or use editLoading

        try {
            const res = await fetch("/api/admin/categories", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editingId, name: newName }),
            });

            if (res.ok) {
                // Update local state directly for immediate feedback
                setCategories(prev => prev.map(c => c._id === editingId ? { ...c, name: newName } : c));
                fetchCategories(); // Fetch to be sure
                cancelEditing();
            } else {
                const data = await res.json();
                alert(data.message);
            }
        } catch {
            alert("Failed to update category");
        } finally {
            setCreateLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading categories...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Category"
                message="Are you sure you want to delete this category? This action cannot be undone."
                confirmLabel="Delete"
                isDestructive={true}
                isLoading={deleteLoading}
            />

            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <FaTag size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Categories</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage blog categories</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 h-fit transition-colors">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">{editingId ? "Edit Category" : "Add New Category"}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                            placeholder="Category Name"
                            required
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={createLoading}
                                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm disabled:opacity-70"
                            >
                                {createLoading ? (editingId ? "Updating..." : "Adding...") : (editingId ? <><FaSave size={12} /> Update</> : <><FaPlus size={12} /> Add Category</>)}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEditing}
                                    className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300 transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List */}
                <div className="md:col-span-2 space-y-4">
                    {categories.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-gray-200 dark:border-white/10 transition-colors">
                            No categories found. Create one to get started.
                        </div>
                    ) : (
                        categories.map((category) => (
                            <div key={category._id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center justify-between group transition-colors">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{category.name}</h3>
                                    <code className="text-xs text-gray-400 bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded mt-1 inline-block">
                                        /{category.slug}
                                    </code>
                                </div>
                                <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <FaEdit size={14} />
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(category._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
