import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";


export async function POST(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await params;
        await connectToDatabase();

        const post = await Post.findOne({ slug });

        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        // Toggle Favorite on User model
        const user = await User.findById(session.user.id);
        const isFavorited = user.favorites.includes(post._id);

        if (isFavorited) {
            user.favorites.pull(post._id);
            // Decrement likes on Post
            post.likes = Math.max(0, (post.likes || 0) - 1);
        } else {
            user.favorites.push(post._id);
            // Increment likes on Post
            post.likes = (post.likes || 0) + 1;
        }

        await Promise.all([user.save(), post.save()]);

        return NextResponse.json({ isFavorited: !isFavorited, likes: post.likes });
    } catch (error) {
        console.error("Favorite toggle error:", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ isFavorited: false });
        }

        const { slug } = await params;
        await connectToDatabase();

        const post = await Post.findOne({ slug });
        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        const user = await User.findById(session.user.id);
        const isFavorited = user.favorites.includes(post._id);

        return NextResponse.json({ isFavorited, likes: post.likes });
    } catch (error) {
        console.error("Check favorite status error:", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
