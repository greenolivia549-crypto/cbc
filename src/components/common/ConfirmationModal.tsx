"use client";

import { m, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    isDestructive = false,
    isLoading = false
}: ConfirmationModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={isLoading ? undefined : onClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <m.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm px-4"
                    >
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-white/10">
                            {/* Header */}
                            <div className={`p-6 text-center border-b relative ${isDestructive ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5'}`}>
                                {!isLoading && (
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-foreground transition-colors"
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl ${isDestructive ? 'bg-red-100 dark:bg-red-900/20 text-red-500' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-500'}`}>
                                    <FaExclamationTriangle />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">{title}</h3>
                            </div>

                            {/* Body */}
                            <div className="p-6 text-center">
                                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                    {message}
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={onClose}
                                        disabled={isLoading}
                                        className="flex-1 py-3 px-4 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                                    >
                                        {cancelLabel}
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        disabled={isLoading}
                                        className={`flex-1 py-3 px-4 font-bold rounded-xl transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 ${isDestructive
                                            ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20 text-white'
                                            : 'bg-primary hover:bg-primary/90 shadow-primary/20 text-primary-foreground'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            confirmLabel
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </m.div>
                </>
            )}
        </AnimatePresence>
    );
}
