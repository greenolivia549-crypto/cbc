"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaPaperPlane, FaUserEdit } from "react-icons/fa";

export default function BecomeAuthorPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        bio: "",
        portfolio: ""
    });

    if (status === "loading") {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <FaUserEdit className="text-4xl text-primary mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Become an Author</h1>
                    <p className="text-gray-600 mb-6">Join our community of writers. Please sign in to submit your application.</p>
                    <button
                        onClick={() => router.push("/auth/signin?callbackUrl=/become-author")}
                        className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
                    >
                        Sign In to Apply
                    </button>
                </div>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/author-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                alert("Your application has been submitted successfully! We will review it shortly.");
                router.push("/");
            } else {
                alert(data.error || "Failed to submit application");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-primary/10 p-8 text-center border-b border-gray-100">
                    <FaUserEdit className="text-4xl text-primary mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply to become an Author</h1>
                    <p className="text-gray-600">Share your stories with the world. Apply now to join our writing team.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="e.g. john@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tell us about yourself (Bio)</label>
                        <textarea
                            name="bio"
                            required
                            rows={5}
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                            placeholder="Your background, expertise, and what you'd like to write about..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL (Optional)</label>
                        <input
                            type="url"
                            name="portfolio"
                            value={formData.portfolio}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="https://yourwebsite.com"
                        />
                        <p className="text-xs text-gray-500 mt-1">Link to your blog, previous work, or LinkedIn profile.</p>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Submitting..." : (
                                <>
                                    <FaPaperPlane /> Submit Application
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
