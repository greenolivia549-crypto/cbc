import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "You must be logged in to claim admin rights." }, { status: 401 });
        }

        await connectToDatabase();

        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { role: "admin" },
            { new: true }
        );

        return NextResponse.json({
            message: "Success! You are now an Admin.",
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            },
            nextStep: "Please log out and log back in (or refresh your session) to access the /admin dashboard."
        });

    } catch (error) {
        return NextResponse.json({ message: "Error upgrading user", error }, { status: 500 });
    }
}
