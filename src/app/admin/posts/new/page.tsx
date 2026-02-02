"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaImage, FaHeading, FaAlignLeft, FaTag, FaCheck, FaCloudUploadAlt, FaSpinner } from "react-icons/fa";

export default function CreatePost() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [contentUploading, setContentUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        image: "",
        category: "technology",
        featured: false,
        seoTitle: "",
        seoDescription: "",
        keywords: "",
    });

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, "") // Remove invalid chars
            .replace(/\s+/g, "-") // Replace spaces with -
            .replace(/-+/g, "-") // Collapse dashes
            .trim();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "title") {
                updated.slug = generateSlug(value);
            }
            return updated;
        });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, featured: e.target.checked }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isContent: boolean = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (isContent) setContentUploading(true);
        else setUploading(true);

        const data = new FormData();
        data.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: data,
            });

            if (!res.ok) throw new Error("Upload failed");

            const { url } = await res.json();

            if (isContent) {
                // Append Markdown image to content
                setFormData((prev) => ({
                    ...prev,
                    content: prev.content + `\n\n![Image Description](${url})`,
                }));
            } else {
                setFormData((prev) => ({ ...prev, image: url }));
            }

        } catch (error) {
            console.error("Upload error:", error);
            alert("Image upload failed");
        } finally {
            if (isContent) setContentUploading(false);
            else setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Ensure slug is populated
            const finalData = { ...formData };
            if (!finalData.slug) {
                finalData.slug = generateSlug(finalData.title);
            }

            const res = await fetch("/api/admin/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to create post");

            router.push("/admin");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert((error as Error).message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Create New Post</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">

                {/* Title & Slug */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <FaHeading className="text-primary" /> Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="Enter article title..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                            Slug (Auto-generated)
                        </label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 text-sm bg-gray-50 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-600"
                            placeholder="url-slug-goes-here"
                        />
                    </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <FaAlignLeft className="text-primary" /> Short Excerpt
                    </label>
                    <textarea
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        required
                        rows={2}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Brief summary for the preview card..."
                    />
                </div>

                {/* Category & Image Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <FaTag className="text-primary" /> Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                        >
                            <option value="technology">Technology</option>
                            <option value="lifestyle">Lifestyle</option>
                            <option value="travel">Travel</option>
                            <option value="food">Food & Drink</option>
                            <option value="business">Business</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <FaImage className="text-primary" /> Featured Image
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                required
                                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="https://example.com/image.jpg"
                            />
                            <label className="cursor-pointer flex items-center justify-center px-4 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition-colors">
                                {uploading ? <FaSpinner className="animate-spin text-gray-600" /> : <FaCloudUploadAlt className="text-gray-600 text-xl" />}
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, false)} disabled={uploading} />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <FaAlignLeft className="text-primary" /> Main Content (Markdown)
                        </label>
                        <label className="cursor-pointer flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-600 rounded-lg transition-colors">
                            {contentUploading ? <FaSpinner className="animate-spin" /> : <FaImage />}
                            Insert Image
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true)} disabled={contentUploading} />
                        </label>
                    </div>

                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows={15}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono text-sm"
                        placeholder="Write your article content here (Markdown supported)..."
                    />
                </div>

                {/* SEO Section */}
                <div className="border-t border-gray-100 pt-6 mt-2 space-y-4">
                    <h3 className="font-bold text-gray-800">SEO Settings (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">SEO Title</label>
                            <input
                                type="text"
                                name="seoTitle"
                                value={formData.seoTitle}
                                onChange={handleChange}
                                className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary outline-none"
                                placeholder="Meta Title"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Keywords (comma separated)</label>
                            <input
                                type="text"
                                name="keywords"
                                value={formData.keywords}
                                onChange={handleChange}
                                className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary outline-none"
                                placeholder="tech, coding, nextjs"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Meta Description</label>
                        <textarea
                            name="seoDescription"
                            value={formData.seoDescription}
                            onChange={handleChange}
                            rows={2}
                            className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary outline-none"
                            placeholder="Meta Description..."
                        />
                    </div>
                </div>

                {/* Options */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleCheckboxChange}
                        className="w-5 h-5 text-primary rounded focus:ring-primary"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                        Feature this post on the homepage
                    </label>
                </div>

                {/* Submit */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                    >
                        {loading ? "Publishing..." : <><FaCheck /> Publish Article</>}
                    </button>
                </div>

            </form>
        </div>
    );
}
