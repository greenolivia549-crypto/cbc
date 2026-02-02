"use client";

import { useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
                <FaExclamationTriangle className="text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Something went wrong!</h2>
            <p className="text-gray-500 max-w-md mb-8">
                We&apos;re sorry, but we encountered an unexpected error. Please try again later.
            </p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
                Try again
            </button>
        </div>
    );
}
