"use client";

import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useSession } from "next-auth/react";

interface CommentLikeButtonProps {
    commentId: string;
    initialLikes: number;
    initialIsLiked: boolean;
}

export default function CommentLikeButton({ commentId, initialLikes, initialIsLiked }: CommentLikeButtonProps) {
    const { data: session } = useSession();
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [loading, setLoading] = useState(false);

    const handleToggleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session) {
            // In a real app, this might trigger a login modal
            return;
        }

        if (loading) return;
        setLoading(true);

        // Optimistic update
        const previousLikes = likes;
        const previousStatus = isLiked;

        setIsLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);

        try {
            const res = await fetch(`/api/comments/${commentId}/like`, { method: "POST" });
            if (res.ok) {
                const data = await res.json();
                setLikes(data.likes);
                setIsLiked(data.isLiked);
            } else {
                // Revert on error
                setLikes(previousLikes);
                setIsLiked(previousStatus);
            }
        } catch (error) {
            console.error("Failed to toggle like on comment", error);
            setLikes(previousLikes);
            setIsLiked(previousStatus);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleLike}
            disabled={loading || !session}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
                } ${!session ? "cursor-default opacity-60" : ""}`}
            title={session ? (isLiked ? "Unlike" : "Like") : "Sign in to like"}
        >
            <FaHeart className={loading ? "animate-pulse" : ""} />
            <span>{likes}</span>
        </button>
    );
}
