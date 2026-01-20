import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: "Both current and new passwords are required." }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ message: "New password must be at least 6 characters long." }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findById(session.user.id).select("+password");

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return NextResponse.json({ message: "Incorrect current password." }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Password update error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
