"use client";

import { useTheme } from "@/context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-8 h-8" />; // Placeholder to avoid hydration mismatch
    }

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors flex items-center justify-center ${theme === 'dark'
                    ? 'bg-zinc-100 dark:bg-zinc-100 text-black hover:bg-zinc-200'
                    : 'hover:bg-zinc-200 text-yellow-500'
                }`}
            aria-label="Toggle Theme"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
            {theme === "light" ? (
                <FaSun size={18} />
            ) : (
                <FaMoon size={18} />
            )}
        </button>
    );
}
