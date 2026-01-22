import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await connectToDatabase();
        await ContactMessage.create({ name, email, subject, message });

        return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Contact API Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
