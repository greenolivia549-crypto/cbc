"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { FaChartLine, FaPen, FaList, FaUsers, FaHome, FaTag, FaEnvelope, FaUserTie, FaUserClock } from "react-icons/fa";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push("/auth/signin");
            return;
        }

        if (session.user.role !== "admin") {
            router.push("/");
            return;
        }
    }, [session, status, router]);

    if (status === "loading" || !session || session.user.role !== "admin") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: FaChartLine },
        { name: "All Posts", href: "/admin/posts", icon: FaList },
        { name: "New Post", href: "/admin/posts/create", icon: FaPen },
        { name: "Categories", href: "/admin/categories", icon: FaTag }, // Added Categories
        { name: "Users", href: "/admin/users", icon: FaUsers },
        { name: "Authors", href: "/admin/authors", icon: FaUserTie },
        { name: "Requests", href: "/admin/author-requests", icon: FaUserClock },
        { name: "Messages", href: "/admin/messages", icon: FaEnvelope },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white fixed h-full hidden md:block z-10">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-2xl font-bold text-green-400">Admin Panel</h2>
                    <p className="text-xs text-gray-400 mt-1">Manage GreenBlog</p>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
                        >
                            <item.icon />
                            {item.name}
                        </Link>
                    ))}

                    <div className="pt-8 mt-8 border-t border-gray-800">
                        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
                            <FaHome /> Back to Site
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Mobile Nav Placeholder (For simplicity on verify) */}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
