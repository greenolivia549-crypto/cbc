"use client";

import { useEffect, useState } from "react";
import { FaLayerGroup, FaUsers, FaHeart, FaPen } from "react-icons/fa";
import Link from "next/link";

interface RecentPost {
    _id: string;
    title: string;
    createdAt: string;
}

interface Stats {
    totalPosts: number;
    totalUsers: number;
    totalLikes: number;
    recentPosts: RecentPost[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-gray-500">Loading dashboard...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <Link
                    href="/admin/posts/create"
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                    <FaPen size={14} /> Write New Post
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                        <FaLayerGroup />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Posts</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats?.totalPosts || 0}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-xl">
                        <FaUsers />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Users</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center text-xl">
                        <FaHeart />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Likes</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats?.totalLikes?.toLocaleString() || 0}</h3>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Recent Post Activity</h2>
                </div>
                <div className="p-6">
                    {stats?.recentPosts && stats.recentPosts.length > 0 ? (
                        <div className="space-y-4">
                            {stats.recentPosts.map((post: RecentPost) => (
                                <div key={post._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{post.title}</h4>
                                        <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className="text-green-600 text-sm font-medium">Published</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No real posts created yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
