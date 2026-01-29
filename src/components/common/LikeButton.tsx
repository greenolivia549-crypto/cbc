"use client";

import { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { useSession } from "next-auth/react";

interface LikeButtonProps {
    slug: string;
    initialLikes: number;
    initialIsFavorited?: boolean;
}

export default function LikeButton({ slug, initialLikes, initialIsFavorited = false }: LikeButtonProps) {
    const { data: session } = useSession();
    const [likes, setLikes] = useState(initialLikes);
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsFavorited(initialIsFavorited);
    }, [initialIsFavorited]);

    // If we're on the grid, we might not know the initial status, so we could fetch it.
    // However, for the grid, avoiding N requests is better.

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to the article
        e.stopPropagation();

        if (!session) {
            // Optional: Redirect to login or show toast
            alert("Please sign in to like this post!");
            return;
        }

        if (loading) return;
        setLoading(true);

        // Optimistic update
        const previousLikes = likes;
        const previousStatus = isFavorited;

        setIsFavorited(!isFavorited);
        setLikes(isFavorited ? likes - 1 : likes + 1);

        try {
            const res = await fetch(`/api/posts/${slug}/favorite`, { method: "POST" });
            if (res.ok) {
                const data = await res.json();
                setLikes(data.likes);
                setIsFavorited(data.isFavorited);
            } else {
                // Revert on error
                setLikes(previousLikes);
                setIsFavorited(previousStatus);
            }
        } catch {
            setLikes(previousLikes);
            setIsFavorited(previousStatus);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleFavorite}
            disabled={loading}
            className={`flex items-center gap-1.5 text-sm transition-colors ${isFavorited ? "text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
        >
            <FaHeart className={loading ? "animate-pulse" : ""} />
            <span>{likes}</span>
        </button>
    );
}
