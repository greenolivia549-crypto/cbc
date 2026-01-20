import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import { DUMMY_POSTS } from "@/lib/dummyData";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        await connectToDatabase();

        const post = await Post.findOne({ slug });

        if (!post) {
            const dummyPost = DUMMY_POSTS.find((p: { slug: string }) => p.slug === slug);
            if (dummyPost) {
                // Return empty comments or mock comments for dummy post
                return NextResponse.json([]);
            }
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        const comments = await Comment.find({ post: post._id })
            .populate("user", "name image")
            .sort({ createdAt: -1 });

        return NextResponse.json(comments);
    } catch {
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { content } = await req.json();
        if (!content) {
            return NextResponse.json({ message: "Content required" }, { status: 400 });
        }

        const { slug } = await params;
        await connectToDatabase();

        const post = await Post.findOne({ slug });

        if (!post) {
            const dummyPost = DUMMY_POSTS.find((p: { slug: string }) => p.slug === slug);
            if (dummyPost) {
                // Return mock newly created comment
                return NextResponse.json({
                    _id: "dummy_comment_" + Date.now(),
                    content,
                    user: { name: session.user.name, image: session.user.image },
                    createdAt: new Date().toISOString()
                }, { status: 201 });
            }
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        const comment = await Comment.create({
            content,
            post: post._id,
            user: session.user.id,
        });

        // Populate user details for immediate return
        await comment.populate("user", "name image");

        return NextResponse.json(comment, { status: 201 });
    } catch {
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
