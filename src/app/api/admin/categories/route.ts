import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
    try {
        await connectToDatabase();
        const categories = await Category.find({}).sort({ name: 1 });
        return NextResponse.json(categories);
    } catch {
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const auth = await checkAdminAuth();
        if (!auth.authorized) return auth.response;

        const { name } = await req.json();

        if (!name) {
            return NextResponse.json({ message: "Name is required" }, { status: 400 });
        }

        await connectToDatabase();

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

        const category = await Category.create({ name, slug });
        return NextResponse.json(category, { status: 201 });

    } catch (error: unknown) {
        if ((error as { code?: number }).code === 11000) {
            return NextResponse.json({ message: "Category already exists" }, { status: 400 });
        }
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const auth = await checkAdminAuth();
        if (!auth.authorized) return auth.response;

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 });
        }

        await connectToDatabase();
        await Category.findByIdAndDelete(id);

        return NextResponse.json({ message: "Category deleted" });

    } catch {
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const auth = await checkAdminAuth();
        if (!auth.authorized) return auth.response;

        const { id, name } = await req.json();

        if (!id || !name) {
            return NextResponse.json({ message: "ID and Name are required" }, { status: 400 });
        }

        await connectToDatabase();

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, slug },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(updatedCategory);

    } catch (error: unknown) {
        if ((error as { code?: number }).code === 11000) {
            return NextResponse.json({ message: "Category name already exists" }, { status: 400 });
        }
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
