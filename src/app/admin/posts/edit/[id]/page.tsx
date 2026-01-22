"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft, FaSearch, FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import Link from "next/link";

interface Category {
    _id: string;
    name: string;
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        category: "",
        image: "",
        content: "",
        seoTitle: "",
        seoDescription: "",
        keywords: "",
        featured: false
    });

    // Fetch existing post data and categories
    // Fetch existing post data and categories
    useEffect(() => {
        const fetchData = async () => {
            // Fetch Categories
            try {
                const catRes = await fetch("/api/admin/categories");
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(catData);
                }
            } catch (e) { console.error("Failed to load categories") }

            // Check for local draft first
            const draftKey = `admin_post_edit_draft_${id}`;
            const savedDraft = localStorage.getItem(draftKey);
            let draftLoaded = false;

            if (savedDraft) {
                try {
                    const parsed = JSON.parse(savedDraft);
                    if (confirm("Found an unsaved draft for this post. Restore?")) {
                        setFormData(parsed);
                        draftLoaded = true;
                        setFetching(false);
                    } else {
                        localStorage.removeItem(draftKey);
                    }
                } catch (e) { console.error("Failed to parse draft", e); }
            }

            if (!draftLoaded) {
                try {
                    // Fetch Post
                    const res = await fetch(`/api/admin/posts/${id}`);
                    if (!res.ok) throw new Error("Failed to fetch post");
                    const data = await res.json();

                    setFormData({
                        title: data.title,
                        slug: data.slug,
                        excerpt: data.excerpt,
                        category: data.category,
                        image: data.image,
                        content: data.content,
                        seoTitle: data.seoTitle || "",
                        seoDescription: data.seoDescription || "",
                        keywords: data.keywords || "",
                        featured: data.featured || false
                    });
                } catch {
                    setError("Could not load post data.");
                } finally {
                    setFetching(false);
                }
            }
        };

        fetchData();
    }, [id]);

    // Auto-save draft
    useEffect(() => {
        if (!fetching) { // Don't save while initial fetching
            const timer = setTimeout(() => {
                const draftKey = `admin_post_edit_draft_${id}`;
                localStorage.setItem(draftKey, JSON.stringify(formData));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [formData, id, fetching]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-generate slug from title if title is edited
        if (name === "title") {
            const autoSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
            setFormData(prev => ({ ...prev, slug: autoSlug }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            setFormData(prev => ({ ...prev, image: data.url }));
        } catch (err) {
            console.error(err);
            setError("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (published: boolean) => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/admin/posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, published })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update post");
            }

            // Redirect back to list
            localStorage.removeItem(`admin_post_edit_draft_${id}`);
            router.push("/admin/posts");
            router.refresh();

        } catch (err: unknown) {
            setError((err as Error).message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-8 text-center text-gray-500">Loading post data...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/posts" className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
                        <FaArrowLeft className="text-gray-600" />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
                </div>
            </div>

            <form className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">

                            {error && (
                                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                                    {error}
                                </div>
                            )}

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Post Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 text-lg border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    placeholder="Enter article title..."
                                    required
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Content (HTML Supported)</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows={15}
                                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-mono text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* SEO Section */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FaSearch className="text-primary" /> SEO Settings
                            </h3>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">SEO Title</label>
                                <input
                                    type="text"
                                    name="seoTitle"
                                    value={formData.seoTitle}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    placeholder="Meta Title (Max 60 chars)"
                                    maxLength={60}
                                />
                                <div className="text-xs text-right text-gray-400 mt-1">{formData.seoTitle.length}/60</div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Meta Description</label>
                                <textarea
                                    name="seoDescription"
                                    value={formData.seoDescription}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                    placeholder="Meta Description (Max 160 chars)"
                                    maxLength={160}
                                    rows={3}
                                />
                                <div className="text-xs text-right text-gray-400 mt-1">{formData.seoDescription.length}/160</div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Keywords (Comma Separated)</label>
                                <input
                                    type="text"
                                    name="keywords"
                                    value={formData.keywords}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    placeholder="e.g. nature, green, sustainability"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                            <h3 className="font-bold text-gray-900">Publishing</h3>

                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={() => handleSubmit(true)}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Saving..." : <><FaSave /> Publish / Update</>}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSubmit(false)}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Saving..." : "Save as Draft"}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                            <h3 className="font-bold text-gray-900">Visibility</h3>
                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured || false}
                                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                                    className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <div>
                                    <span className="font-bold text-gray-900 block">Feature this Post</span>
                                    <span className="text-xs text-gray-500">Show in Home Page Slider</span>
                                </div>
                            </label>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                            <h3 className="font-bold text-gray-900">Organization</h3>

                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Slug</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-gray-50 font-mono text-sm"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    required
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                            <h3 className="font-bold text-gray-900">Featured Image</h3>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Image Source</label>

                                {/* Tabs or simple switcher could be here, but let's just show both options or priority to upload */}
                                <div className="space-y-4">
                                    {/* Upload Button */}
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="imageUpload"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={uploading}
                                        />
                                        <label
                                            htmlFor="imageUpload"
                                            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors text-gray-600 hover:text-primary"
                                        >
                                            {uploading ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                                            ) : (
                                                <FaCloudUploadAlt className="text-xl" />
                                            )}
                                            <span className="font-medium text-sm">{uploading ? "Uploading..." : "Upload from Computer"}</span>
                                        </label>
                                    </div>

                                    <div className="text-center text-xs text-gray-400 font-medium uppercase tracking-wider">- OR -</div>

                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                                        placeholder="Paste Image URL..."
                                    />
                                </div>
                            </div>

                            {formData.image && (
                                <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative group">
                                    <Image src={formData.image} alt="Preview" fill className="object-cover" unoptimized />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                                        title="Remove Image"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            )}

                            {/* Excerpt */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Excerpt</label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none text-sm"
                                    placeholder="Short summary..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
