"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaImage, FaHeading, FaAlignLeft, FaTag, FaCheck } from "react-icons/fa";

export default function CreatePost() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        image: "",
        category: "technology",
        featured: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, featured: e.target.checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to create post");

            router.push("/admin");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Create New Post</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">

                {/* Title */}
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
                            <FaImage className="text-primary" /> Image URL
                        </label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <FaAlignLeft className="text-primary" /> Main Content
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows={12}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono text-sm"
                        placeholder="Write your article content here (Markdown supported)..."
                    />
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
