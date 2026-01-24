
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import Author from "@/models/Author";

export async function GET() {
    try {
        await connectToDatabase();
        const authors = await Author.find({}).sort({ createdAt: -1 });
        return NextResponse.json(authors);
    } catch (error) {
        console.error("Error fetching authors:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const body = await req.json();

        const author = await Author.create(body);

        return NextResponse.json(author, { status: 201 });
    } catch (error: unknown) {
        console.error("Error creating author:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
