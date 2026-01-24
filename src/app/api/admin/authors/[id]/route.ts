
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import Author from "@/models/Author";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const author = await Author.findById(id);

        if (!author) {
            return NextResponse.json({ error: "Author not found" }, { status: 404 });
        }

        return NextResponse.json(author);
    } catch (error) {
        console.error("Error fetching author:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const body = await req.json();
        const { id } = await params;

        const author = await Author.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!author) {
            return NextResponse.json({ error: "Author not found" }, { status: 404 });
        }

        return NextResponse.json(author);
    } catch (error: unknown) {
        console.error("Error updating author:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const { id } = await params;
        const author = await Author.findByIdAndDelete(id);

        if (!author) {
            return NextResponse.json({ error: "Author not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Author deleted successfully" });
    } catch (error) {
        console.error("Error deleting author:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
