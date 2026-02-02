"use client";

import { useState } from "react";
import { FaShareAlt, FaCheck } from "react-icons/fa";

interface ShareButtonProps {
    title: string;
    text: string;
    url?: string;
}

export default function ShareButton({ title, text, url }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareUrl = url || window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url: shareUrl,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-bold shadow-lg shadow-primary/20 transform transition-all hover:scale-105 active:scale-95"
            aria-label="Share this article"
        >
            {copied ? (
                <>
                    <FaCheck />
                    <span>Link Copied!</span>
                </>
            ) : (
                <>
                    <FaShareAlt />
                    <span>Share Article</span>
                </>
            )}
        </button>
    );
}
