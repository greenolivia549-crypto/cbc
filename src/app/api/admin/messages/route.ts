import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";

export async function GET() {
    try {
        await connectToDatabase();
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        return NextResponse.json(messages);
    } catch (error) {
        console.error("Failed to fetch messages:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
