"use client";

import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-primary/10 text-black dark:text-white hover:text-primary transition-all backdrop-blur-sm mb-6"
            aria-label="Go Back"
        >
            <FaArrowLeft />
        </button>
    );
}
