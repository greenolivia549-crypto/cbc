import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { name } = await req.json();

        if (!name || name.trim().length < 2) {
            return NextResponse.json({ message: "Name must be at least 2 characters long." }, { status: 400 });
        }

        await connectToDatabase();

        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            { name: name.trim() },
            { new: true } // Return modified document
        ).select("-password -favorites"); // Exclude sensitive info

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
