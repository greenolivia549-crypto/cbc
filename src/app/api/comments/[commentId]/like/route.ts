import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import Comment from "@/models/Comment";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ commentId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { commentId } = await params;
        await connectToDatabase();

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        const userId = session.user.id;
        const isLiked = comment.likes.includes(userId);

        if (isLiked) {
            // Unlike
            comment.likes = comment.likes.filter((id: string) => id.toString() !== userId);
        } else {
            // Like
            comment.likes.push(userId);
        }

        await comment.save();

        return NextResponse.json({
            likes: comment.likes.length,
            isLiked: !isLiked
        });
    } catch (error) {
        console.error("Error toggling like:", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
