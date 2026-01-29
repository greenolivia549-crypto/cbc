import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import "@/models/User"; // Ensure User model is registered for population

export async function POST(req: Request) {
    try {
        const auth = await checkAdminAuth();
        if (!auth.authorized) return auth.response;

        const { title, slug, content, excerpt, image, category, seoTitle, seoDescription, keywords, featured, published, authorProfile } = await req.json();

        // Basic Validation
        if (!title || !slug || !content || !category) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await connectToDatabase();

        // Check for duplicate slug
        const existingPost = await Post.findOne({ slug });
        if (existingPost) {
            return NextResponse.json({ message: "Slug already exists. Please choose another." }, { status: 400 });
        }

        const newPost = await Post.create({
            title,
            slug: slug.toLowerCase(),
            content,
            excerpt: excerpt || content.substring(0, 150) + "...",
            image: image || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop", // Default placeholder
            category,
            seoTitle,
            seoDescription,
            keywords,

            featured,
            published,
            ...(authorProfile ? { authorProfile } : {}),
            author: auth.session?.user.id
        });

        return NextResponse.json({ message: "Post created successfully", post: newPost }, { status: 201 });

    } catch (error: any) {
        console.error("Create Post Error:", error);

        // Mongoose Validation Error
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
            return NextResponse.json({ message: messages.join(', ') }, { status: 400 });
        }

        // Duplicate Key Error (e.g., Slug)
        if (error.code === 11000) {
            return NextResponse.json({ message: "Duplicate value entered for unique field (likely slug or title)" }, { status: 400 });
        }

        // Cast Error (Invalid ID)
        if (error.name === 'CastError') {
            return NextResponse.json({ message: `Invalid ID format: ${error.path}` }, { status: 400 });
        }

        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const auth = await checkAdminAuth();
        if (!auth.authorized) return auth.response;

        await connectToDatabase();

        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .populate("author", "name email")
            .populate("authorProfile", "name");

        return NextResponse.json(posts);

    } catch (error) {
        console.error("Fetch Admin Posts Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
