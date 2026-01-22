"use client";

import { useEffect, useState } from "react";
import { FaEnvelope, FaCalendar, FaPaperPlane, FaUser } from "react-icons/fa";

interface Message {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMessages() {
            try {
                const res = await fetch("/api/admin/messages");
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMessages();
    }, []);

    if (loading) return <div>Loading messages...</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {messages.length} Total
                </span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {messages.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No messages found.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {messages.map((msg) => (
                            <div key={msg._id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-gray-900 text-lg">{msg.subject}</h3>
                                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <FaCalendar size={10} />
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <a
                                        href={`mailto:${msg.email}`}
                                        className="text-primary text-sm hover:underline flex items-center gap-1"
                                    >
                                        <FaPaperPlane size={12} /> Reply
                                    </a>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                    <FaUser size={12} />
                                    <span className="font-medium">{msg.name}</span>
                                    <span className="text-gray-400">&lt;{msg.email}&gt;</span>
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {msg.message}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
