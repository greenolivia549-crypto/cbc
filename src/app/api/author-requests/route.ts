
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import AuthorRequest from "@/models/AuthorRequest";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const body = await req.json();

        // Check if user already has a pending request
        const existingRequest = await AuthorRequest.findOne({
            user: session.user.id,
            status: "pending",
        });

        if (existingRequest) {
            return NextResponse.json(
                { error: "You already have a pending request." },
                { status: 400 }
            );
        }

        const newRequest = await AuthorRequest.create({
            ...body,
            user: session.user.id,
        });

        return NextResponse.json(newRequest, { status: 201 });
    } catch (error: unknown) {
        console.error("Error creating author request:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
