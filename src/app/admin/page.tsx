"use client";

import { useEffect, useState } from "react";
import { FaLayerGroup, FaUsers, FaHeart, FaPen, FaFileAlt, FaComments } from "react-icons/fa";
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Dashboard</h1>
                <Link
                    href="/admin/posts/create"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                >
                    <FaPen size={14} /> Write New Post
                </Link>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-4 transition-colors">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-500">
                        <FaFileAlt size={24} />
                    </div>
                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Posts</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{stats?.totalPosts || 0}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-4 transition-colors">
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500">
                        <FaUsers size={24} />
                    </div>
                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Users</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{stats?.totalUsers || 0}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-4 transition-colors">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-500">
                        <FaComments size={24} />
                    </div>
                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Comments</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{stats?.totalLikes || 0}</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 transition-colors">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors">Recent Activity</h2>
                <div className="space-y-4">
                    {stats?.recentPosts && stats.recentPosts.length > 0 ? (
                        stats.recentPosts.map((post) => (
                            <div key={post._id} className="flex justify-between items-center bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-lg transition-colors">
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm transition-colors">{post.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className="text-green-600 dark:text-green-400 text-xs font-medium">Published</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">No recent activity.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
