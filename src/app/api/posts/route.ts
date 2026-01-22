import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const featured = searchParams.get("featured");
        const q = searchParams.get("q");

        const query: { published: boolean; featured?: boolean; category?: string; $or?: object[] } = { published: true }; // Only show published posts

        if (featured === "true") {
            query.featured = true;
        }

        const category = searchParams.get("category");
        if (category) {
            query.category = category;
        }

        if (q) {
            const regex = new RegExp(q, "i"); // Case-insensitive regex
            query.$or = [
                { title: { $regex: regex } },
                { excerpt: { $regex: regex } },
                // { content: { $regex: regex } } // Optional: deep search in content
            ];
        }

        const posts = await Post.find(query).sort({ createdAt: -1 }).lean();

        // Check for User Session to determine 'isFavorited'
        const session = await getServerSession(authOptions);
        let userFavorites: string[] = [];

        if (session && session.user?.id) {
            const user = await User.findById(session.user.id).select("favorites");
            if (user && user.favorites) {
                userFavorites = user.favorites.map((id: { toString: () => string }) => id.toString());
            }
        }

        const postsWithStatus = posts.map((post) => ({
            ...post,
            isFavorited: userFavorites.includes((post._id as { toString: () => string }).toString())
        }));

        return NextResponse.json(postsWithStatus);
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return NextResponse.json({ message: "Failed to fetch posts" }, { status: 500 });
    }
}
