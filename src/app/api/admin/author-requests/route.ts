
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import AuthorRequest from "@/models/AuthorRequest";


export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const requests = await AuthorRequest.find().sort({ createdAt: -1 }).populate("user", "name email");

        return NextResponse.json(requests);
    } catch (error) {
        console.error("Error fetching author requests:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
