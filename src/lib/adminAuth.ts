import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function checkAdminAuth() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return {
            authorized: false,
            response: NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        };
    }

    if (session.user.role !== "admin") {
        return {
            authorized: false,
            response: NextResponse.json({ message: "Forbidden: Admin access required" }, { status: 403 })
        };
    }

    return { authorized: true, session };
}
