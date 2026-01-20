import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, excerpt, content, image, category, featured } = body;

        if (!title || !content || !image) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        await connectToDatabase();

        // Create simple slug
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        const newPost = await Post.create({
            title,
            slug,
            excerpt,
            content,
            image,
            category,
            featured,
            author: session.user.id,
        });

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error("Create Post Error:", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const featured = searchParams.get("featured");
        const session = await getServerSession(authOptions);

        await connectToDatabase();

        const query: { featured?: boolean } = {};
        if (featured === "true") {
            query.featured = true;
        }

        const posts = await Post.find(query).sort({ createdAt: -1 }).populate("author", "name");

        let favorites: string[] = [];
        if (session) {
            const user = await import("@/models/User").then(mod => mod.default.findById(session.user.id));
            if (user && user.favorites) {
                favorites = user.favorites.map((id: any) => id.toString());
            }
        }

        const postsWithStatus = posts.map((post) => ({
            ...post.toObject(),
            isFavorited: favorites.includes(post._id.toString()),
        }));

        return NextResponse.json(postsWithStatus);
    } catch (error) {
        console.error("Fetch Posts Error:", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
