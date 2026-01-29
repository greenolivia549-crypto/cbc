import Link from "next/link";
import { FaHome, FaSearch } from "react-icons/fa";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <h1 className="text-9xl font-bold text-gray-200">404</h1>
            <h2 className="text-3xl font-bold text-foreground mt-4 mb-2">Page Not Found</h2>
            <p className="text-gray-500 max-w-md mb-8">
                The page you are looking for doesn't exist or has been moved.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                    <FaHome />
                    Go Home
                </Link>
                <Link
                    href="/search"
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                    <FaSearch />
                    Search Articles
                </Link>
            </div>
        </div>
    );
}
