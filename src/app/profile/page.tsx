"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaUser, FaLock, FaSave, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function ProfilePage() {
    const { data: session, update } = useSession();

    const [name, setName] = useState("");

    // Password Form State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Feedback State
    const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });
    const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });

    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        }
    }, [session]);

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Please sign in to view your profile.</p>
            </div>
        );
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingProfile(true);
        setProfileStatus({ type: null, message: "" });

        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update profile");
            }

            // Update session client-side
            await update({ name });
            setProfileStatus({ type: "success", message: "Profile updated successfully!" });
        } catch (error: unknown) {
            setProfileStatus({ type: "error", message: (error as Error).message });
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingPassword(true);
        setPasswordStatus({ type: null, message: "" });

        if (newPassword !== confirmPassword) {
            setPasswordStatus({ type: "error", message: "New passwords do not match." });
            setLoadingPassword(false);
            return;
        }

        try {
            const res = await fetch("/api/user/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update password");
            }

            setPasswordStatus({ type: "success", message: "Password updated successfully!" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: unknown) {
            setPasswordStatus({ type: "error", message: (error as Error).message });
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
                    <p className="mt-2 text-gray-600">Manage your profile and security preferences.</p>
                </div>

                {/* Profile Information Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                        <FaUser className="text-primary" />
                        <h2 className="text-lg font-bold text-foreground">Profile Information</h2>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={session.user?.email || ""}
                                    disabled
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed select-none"
                                />
                                <p className="mt-1 text-xs text-gray-400">Email cannot be changed.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    placeholder="Your display name"
                                    minLength={2}
                                />
                            </div>

                            {profileStatus.message && (
                                <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${profileStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {profileStatus.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                                    {profileStatus.message}
                                </div>
                            )}

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={loadingProfile}
                                    className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70"
                                >
                                    {loadingProfile ? "Saving..." : <><FaSave /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Password Security Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                        <FaLock className="text-primary" />
                        <h2 className="text-lg font-bold text-foreground">Security</h2>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    required
                                />
                            </div>

                            <div className="border-t border-gray-100 my-4 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>
                            </div>

                            {passwordStatus.message && (
                                <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${passwordStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {passwordStatus.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                                    {passwordStatus.message}
                                </div>
                            )}

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={loadingPassword}
                                    className="flex items-center gap-2 px-6 py-2 bg-foreground text-white rounded-lg font-medium hover:bg-green-900 transition-colors disabled:opacity-70"
                                >
                                    {loadingPassword ? "Updating..." : <><FaLock /> Update Password</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
