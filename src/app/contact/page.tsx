"use client";

import { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { m } from "framer-motion";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-12 pb-24">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <m.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-primary mb-4"
                    >
                        Get in Touch
                    </m.h1>
                    <m.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 text-lg"
                    >
                        Have a question about sustainable living or want to collaborate? We&apos;d love to hear from you.
                    </m.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

                    {/* Contact Info */}
                    <m.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-8"
                    >
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
                            <h2 className="text-2xl font-bold text-foreground mb-8">Contact Information</h2>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <FaMapMarkerAlt className="text-primary text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground mb-1">Our Location</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            123 Green Earth Avenue<br />
                                            Eco District, NY 10012<br />
                                            United States
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <FaEnvelope className="text-primary text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground mb-1">Email Us</h3>
                                        <p className="text-gray-600 mb-1">General: hello@greenblog.com</p>
                                        <p className="text-gray-600">Support: support@greenblog.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <FaPhone className="text-primary text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground mb-1">Call Us</h3>
                                        <p className="text-gray-600">+1 (555) 123-4567</p>
                                        <p className="text-gray-500 text-sm mt-1">Mon-Fri: 9am - 6pm EST</p>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="mt-12 h-64 bg-gray-100 rounded-xl overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
                                    Interactive Map Loading...
                                </div>
                                {/* In a real app, embed Google Maps iframe here */}
                            </div>
                        </div>
                    </m.div>

                    {/* Contact Form */}
                    <m.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100"
                    >
                        <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-gray-50 focus:bg-white"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-gray-50 focus:bg-white"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-gray-50 focus:bg-white"
                                    placeholder="How can we help?"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-gray-50 focus:bg-white resize-none"
                                    placeholder="Write your message here..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/20 hover:bg-green-700 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    "Sending..."
                                ) : (
                                    <>
                                        Send Message <FaPaperPlane className="text-sm" />
                                    </>
                                )}
                            </button>

                            {status === "success" && (
                                <m.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-green-50 text-green-700 rounded-lg text-center border border-green-200"
                                >
                                    Thank you! Your message has been sent successfully.
                                </m.div>
                            )}

                            {status === "error" && (
                                <m.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-red-50 text-red-700 rounded-lg text-center border border-red-200"
                                >
                                    Something went wrong. Please try again later.
                                </m.div>
                            )}
                        </form>
                    </m.div>
                </div>
            </div>
        </div>
    );
}
