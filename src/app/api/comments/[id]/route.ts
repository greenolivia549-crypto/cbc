import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import Comment from "@/models/Comment";


export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectToDatabase();

        const comment = await Comment.findById(id);

        if (!comment) {
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        // Verify ownership
        // session.user.id is usually string, comment.user is ObjectId.
        if (comment.user.toString() !== session.user.id) {
            return NextResponse.json({ message: "Forbidden: You can only delete your own comments" }, { status: 403 });
        }

        await Comment.findByIdAndDelete(id);

        return NextResponse.json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Delete Comment Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
