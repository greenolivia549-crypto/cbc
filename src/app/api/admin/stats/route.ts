import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";

export async function GET() {
    try {
        const auth = await checkAdminAuth();
        if (!auth.authorized) return auth.response;

        await connectToDatabase();

        // 1. Total Posts (DB Only)
        const totalPosts = await Post.countDocuments();

        // 2. Total Users
        const totalUsers = await User.countDocuments();

        // 3. Total Likes (Aggregated from DB Posts)
        // Note: This only counts likes on real posts. Dummy likes are in-memory and harder to aggregate here easily without importing the store.
        // For simplicity in this phase, we'll sum DB likes.
        const posts = await Post.find({}).select("likes");
        const totalDbLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);

        // Add some "fake" likes from dummy data for initial impression if DB is empty
        const totalLikes = totalDbLikes + (totalDbLikes === 0 ? 3500 : 0);

        return NextResponse.json({
            totalPosts,
            totalUsers,
            totalLikes,
            recentPosts: await Post.find().sort({ createdAt: -1 }).limit(5)
        });

    } catch (error) {
        console.error("Admin Stats API Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
