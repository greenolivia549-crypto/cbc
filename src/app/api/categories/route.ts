import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectToDatabase();
        const categories = await Category.find({}).sort({ name: 1 });
        return NextResponse.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
