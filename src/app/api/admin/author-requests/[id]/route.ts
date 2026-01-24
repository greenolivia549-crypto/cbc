
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import AuthorRequest from "@/models/AuthorRequest";
import Author from "@/models/Author";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { status } = await req.json();

        await connectToDatabase();

        const authorRequest = await AuthorRequest.findById(id);

        if (!authorRequest) {
            return NextResponse.json(
                { error: "Request not found" },
                { status: 404 }
            );
        }

        if (status === "approved") {
            // Create Author Profile
            // Check if author with email already exists to avoid duplicates
            const existingAuthor = await Author.findOne({ email: authorRequest.email });

            if (!existingAuthor) {
                await Author.create({
                    name: authorRequest.name,
                    email: authorRequest.email,
                    bio: authorRequest.bio,
                    // Add any other fields from request to author model if needed
                });
            }
        }

        authorRequest.status = status;
        await authorRequest.save();

        return NextResponse.json(authorRequest);
    } catch (error: unknown) {
        console.error("Error updating request:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
