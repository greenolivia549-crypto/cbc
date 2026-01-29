"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
    const searchParams = useSearchParams();

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-12">
            {/* Previous Button */}
            <Link
                href={createPageUrl(currentPage - 1)}
                className={`p-3 rounded-lg border border-gray-200 transition-colors ${currentPage <= 1
                    ? "text-gray-300 pointer-events-none bg-gray-50"
                    : "text-gray-600 hover:bg-primary hover:text-white hover:border-primary"
                    }`}
                aria-disabled={currentPage <= 1}
            >
                <FaChevronLeft />
            </Link>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first, last, current, and neighbors
                if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                    return (
                        <Link
                            key={page}
                            href={createPageUrl(page)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors font-medium ${currentPage === page
                                ? "bg-primary text-white border-primary"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {page}
                        </Link>
                    );
                }

                // Show ellipsis
                if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                ) {
                    return <span key={page} className="text-gray-400">...</span>;
                }

                return null;
            })}

            {/* Next Button */}
            <Link
                href={createPageUrl(currentPage + 1)}
                className={`p-3 rounded-lg border border-gray-200 transition-colors ${currentPage >= totalPages
                    ? "text-gray-300 pointer-events-none bg-gray-50"
                    : "text-gray-600 hover:bg-primary hover:text-white hover:border-primary"
                    }`}
                aria-disabled={currentPage >= totalPages}
            >
                <FaChevronRight />
            </Link>
        </div>
    );
}
