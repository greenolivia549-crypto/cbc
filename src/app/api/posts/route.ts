import { NextResponse } from "next/server";
import { getPosts } from "@/lib/posts";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const featured = searchParams.get("featured") === "true";
        const q = searchParams.get("q") || undefined;
        const category = searchParams.get("category") || undefined;
        const startDate = searchParams.get("startDate") || undefined;
        const endDate = searchParams.get("endDate") || undefined;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "9");

        const result = await getPosts({
            page,
            limit,
            featured,
            category,
            search: q,
            startDate,
            endDate
        });

        // Check for User Session to determine 'isFavorited'
        const session = await getServerSession(authOptions);
        let userFavorites: string[] = [];

        if (session && session.user?.id) {
            const user = await User.findById(session.user.id).select("favorites");
            if (user && user.favorites) {
                userFavorites = user.favorites.map((id: { toString: () => string }) => id.toString());
            }
        }

        const postsWithStatus = result.posts.map((post) => ({
            ...post,
            isFavorited: userFavorites.includes(post._id.toString())
        }));

        return NextResponse.json({
            posts: postsWithStatus,
            pagination: result.pagination
        });
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return NextResponse.json({ message: "Failed to fetch posts" }, { status: 500 });
    }
}
