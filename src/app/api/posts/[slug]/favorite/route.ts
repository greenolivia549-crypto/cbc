import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";
import { DUMMY_POSTS, DUMMY_LIKES_STORE } from "@/lib/dummyData";

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
            // Check for dummy post
            const dummyPost = DUMMY_POSTS.find((p: { slug: string; likes?: number }) => p.slug === slug);
            if (dummyPost) {
                // Use in-memory store to simulate persistent toggle
                const key = `${session.user.id}:${slug}`;
                const isFavorited = DUMMY_LIKES_STORE.has(key);

                let newLikes = dummyPost.likes || 0;

                if (isFavorited) {
                    DUMMY_LIKES_STORE.delete(key);
                    // Base count (user unliked)
                } else {
                    DUMMY_LIKES_STORE.add(key);
                    newLikes += 1;
                }

                return NextResponse.json({
                    isFavorited: !isFavorited,
                    likes: newLikes
                });
            }
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
            const dummyPost = DUMMY_POSTS.find((p: { slug: string; likes?: number }) => p.slug === slug);
            if (dummyPost) {
                const key = `${session.user.id}:${slug}`;
                const isFavorited = DUMMY_LIKES_STORE.has(key);
                const likes = isFavorited ? (dummyPost.likes || 0) + 1 : (dummyPost.likes || 0);
                return NextResponse.json({ isFavorited, likes });
            }
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
