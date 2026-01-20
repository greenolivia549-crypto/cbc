import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";

// GET: Fetch single post for editing
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await checkAdminAuth();
        if (!auth.authorized) return auth.response;

        const { id } = await params;
        await connectToDatabase();

        const post = await Post.findById(id);

        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("Fetch Post Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// PUT: Update post
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await checkAdminAuth();
        if (!auth.authorized) return auth.response;

        const { id } = await params;
        const { title, slug, content, excerpt, image, category, seoTitle, seoDescription, keywords, featured } = await req.json();

        await connectToDatabase();

        // Check if slug is taken by ANOTHER post
        if (slug) {
            const existingSlug = await Post.findOne({ slug, _id: { $ne: id } });
            if (existingSlug) {
                return NextResponse.json({ message: "Slug already currently in use." }, { status: 400 });
            }
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {
                title,
                slug,
                content,
                excerpt: excerpt || content.substring(0, 150) + "...",
                image,
                category,
                seoTitle,
                seoDescription,

                keywords,
                featured
            },
            { new: true }
        );

        if (!updatedPost) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Post updated successfully", post: updatedPost });
    } catch (error) {
        console.error("Update Post Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE: Remove post
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await checkAdminAuth();
        if (!auth.authorized) return auth.response;

        const { id } = await params;
        await connectToDatabase();

        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Delete Post Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
