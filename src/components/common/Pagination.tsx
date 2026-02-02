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

    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        const delta = 1; // Number of pages to show around the current page

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                pageNumbers.push(i);
            } else if (
                (i === currentPage - delta - 1 && currentPage - delta > 1) ||
                (i === currentPage + delta + 1 && currentPage + delta < totalPages)
            ) {
                pageNumbers.push("...");
            }
        }
        return pageNumbers;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-12">
            {/* Previous Button */}
            <Link
                href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${currentPage <= 1
                    ? "text-gray-300 dark:text-gray-600 pointer-events-none bg-gray-50 dark:bg-white/5"
                    : "text-foreground hover:bg-gray-100 dark:hover:bg-white/10 hover:text-primary"
                    }`}
                aria-disabled={currentPage <= 1}
            >
                <FaChevronLeft size={12} /> Previous
            </Link>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
                {getPageNumbers().map((page, index) => (
                    page === "..." ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">...</span>
                    ) : (
                        <Link
                            key={page}
                            href={createPageUrl(page as number)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${currentPage === page
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "border border-gray-200 dark:border-white/10 text-foreground hover:bg-gray-50 dark:hover:bg-white/5"
                                }`}
                        >
                            {page}
                        </Link>
                    )
                ))}
            </div>

            {/* Next Button */}
            <Link
                href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${currentPage >= totalPages
                    ? "text-gray-300 dark:text-gray-600 pointer-events-none bg-gray-50 dark:bg-white/5"
                    : "text-foreground hover:bg-gray-100 dark:hover:bg-white/10 hover:text-primary"
                    }`}
                aria-disabled={currentPage >= totalPages}
            >
                <FaChevronRight />
            </Link>
        </div>
    );
}
