import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // In a real application, you would:
        // 1. Save to database (Contact Model)
        // 2. Send email notification (Nodemailer/Resend)

        console.log("CONTACT FORM SUBMISSION:", { name, email, subject, message });

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Contact API Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
