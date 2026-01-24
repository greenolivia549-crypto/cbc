"use client";

import { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaExternalLinkAlt } from "react-icons/fa";

interface AuthorRequest {
    _id: string;
    name: string;
    email: string;
    bio: string;
    portfolio?: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
}

export default function AdminAuthorRequestsPage() {
    const [requests, setRequests] = useState<AuthorRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/admin/author-requests");
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (requestId: string, action: "approved" | "rejected") => {
        if (!confirm(`Are you sure you want to ${action} this request?`)) return;

        try {
            const res = await fetch(`/api/admin/author-requests/${requestId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: action })
            });

            if (res.ok) {
                // Update local state
                setRequests(prev => prev.map(req =>
                    req._id === requestId ? { ...req, status: action } : req
                ));
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        }
    };

    if (loading) return <div className="p-8 text-gray-500">Loading requests...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Author Requests</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-gray-700 text-sm">Applicant</th>
                            <th className="px-6 py-4 font-bold text-gray-700 text-sm">Bio</th>
                            <th className="px-6 py-4 font-bold text-gray-700 text-sm">Portfolio</th>
                            <th className="px-6 py-4 font-bold text-gray-700 text-sm">Status</th>
                            <th className="px-6 py-4 font-bold text-gray-700 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {requests.length > 0 ? (
                            requests.map((req) => (
                                <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{req.name}</div>
                                        <div className="text-xs text-gray-500">{req.email}</div>
                                        <div className="text-xs text-gray-400 mt-1">{new Date(req.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600 max-w-xs line-clamp-3">{req.bio}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {req.portfolio ? (
                                            <a href={req.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline text-sm">
                                                Link <FaExternalLinkAlt size={10} />
                                            </a>
                                        ) : (
                                            <span className="text-xs text-gray-400">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full capitalize
                                            ${req.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {req.status === 'pending' && (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleAction(req._id, "approved")}
                                                    className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
                                                    title="Approve"
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(req._id, "rejected")}
                                                    className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                                                    title="Reject"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No pending requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
