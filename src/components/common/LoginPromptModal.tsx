"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaSignInAlt, FaTimes } from "react-icons/fa";

interface LoginPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
}

export default function LoginPromptModal({ isOpen, onClose, message = "Please login to continue" }: LoginPromptModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm px-4"
                    >
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {/* Header */}
                            <div className="bg-primary/5 p-6 text-center border-b border-primary/10 relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FaTimes />
                                </button>
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-2xl">
                                    <FaSignInAlt />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Login Required</h3>
                            </div>

                            {/* Body */}
                            <div className="p-6 text-center">
                                <p className="text-gray-600 mb-6 font-medium">
                                    {message}
                                </p>

                                <div className="space-y-3">
                                    <Link
                                        href="/auth/signin"
                                        className="block w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-primary/20"
                                    >
                                        Sign In
                                    </Link>
                                    <button
                                        onClick={onClose}
                                        className="block w-full py-3 text-gray-500 font-bold hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
