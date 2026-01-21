"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaComment, FaPaperPlane, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LikeButton from "@/components/common/LikeButton";
import CommentLikeButton from "@/components/blog/CommentLikeButton";
import LoginPromptModal from "@/components/common/LoginPromptModal";

interface Comment {
    _id: string;
    content: string;
    createdAt: string;
    user: {
        _id: string;
        name: string;
        image?: string;
    };
    likes?: string[];
}

export default function Interactions({ slug, initialLikes = 0 }: { slug: string; initialLikes?: number }) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    // Login Prompt State
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginMessage, setLoginMessage] = useState("");

    const openLoginModal = (msg: string) => {
        setLoginMessage(msg);
        setShowLoginModal(true);
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/posts/${slug}/comments`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(data);
                }
            } catch {
                console.error("Failed to fetch comments");
            }
        };

        const checkFavoriteStatus = async () => {
            try {
                const res = await fetch(`/api/posts/${slug}/favorite`);
                if (res.ok) {
                    const data = await res.json();
                    setIsFavorited(data.isFavorited);
                }
            } catch {
                console.error("Failed to check favorite status");
            }
        };

        fetchComments();
        if (session) checkFavoriteStatus();
    }, [session, slug]);

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            openLoginModal("Please login to comment on this post");
            return;
        }
        if (!newComment.trim()) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/posts/${slug}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment }),
            });

            if (res.ok) {
                const comment = await res.json();
                setComments((prev) => [comment, ...prev]);
                setNewComment("");
            }
        } catch {
            console.error("Failed to post comment");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            const res = await fetch(`/api/comments/${commentId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setComments((prev) => prev.filter((c) => c._id !== commentId));
            } else {
                alert("Failed to delete comment");
            }
        } catch {
            alert("Error deleting comment");
        }
    };

    return (
        <div className="mt-12 pt-8 border-t border-gray-100 relative">
            <LoginPromptModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                message={loginMessage}
            />

            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FaComment className="text-primary" />
                    Comments ({comments.length})
                </h3>

                <div className="flex items-center gap-4">
                    {/* Like Button Wrapper to handle Login Prompt */}
                    <div onClickCapture={(e) => {
                        if (!session) {
                            e.preventDefault();
                            e.stopPropagation();
                            openLoginModal("Please login to like this post");
                        }
                    }}>
                        <LikeButton slug={slug} initialLikes={initialLikes} initialIsFavorited={isFavorited} />
                    </div>
                </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleComment} className="mb-10 bg-gray-50 p-4 rounded-xl">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onClick={() => !session && openLoginModal("Please login to comment on this post")}
                    className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                    placeholder="Share your thoughts..."
                    rows={3}
                // Remove required so we can handle empty + no session via onClick/onSubmit
                />
                <div className="flex justify-end mt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                        {loading ? "Posting..." : <><FaPaperPlane size={12} /> Post Comment</>}
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                <AnimatePresence>
                    {comments.map((comment) => (
                        <motion.div
                            key={comment._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex gap-4"
                        >
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-500 font-bold overflow-hidden relative">
                                {comment.user?.image ? (
                                    <Image
                                        src={comment.user.image}
                                        alt="User"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    comment.user?.name?.[0] || "?"
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="bg-gray-50 p-4 rounded-xl rounded-tl-none relative group">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-gray-900">{comment.user?.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            {session?.user?.id === comment.user?._id && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                    title="Delete comment"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-sm mb-2">{comment.content}</p>

                                    <div className="flex items-center gap-4">
                                        {/* Wrapper for Comment Like to intercept click */}
                                        <div onClickCapture={(e) => {
                                            if (!session) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                openLoginModal("Please login to like this comment");
                                            }
                                        }}>
                                            <CommentLikeButton
                                                commentId={comment._id}
                                                initialLikes={comment.likes?.length || 0}
                                                initialIsLiked={session && comment.likes ? comment.likes.includes(session.user.id) : false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
