"use client";

import { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane, FaQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    {
        question: "How do I create an account?",
        answer: "To create an account, click on the 'Sign In' button at the top right corner and select 'Sign Up'. Fill in your details and you're good to go!"
    },
    {
        question: "Can I write articles for GreenBlog?",
        answer: "Yes! We welcome guest contributions. Please use the contact form below to pitch your ideas or request author access."
    },
    {
        question: "How do I reset my password?",
        answer: "Go to the login page and click 'Forgot Password'. Follow the instructions sent to your email to reset it."
    },
    {
        question: "Is there a newsletter?",
        answer: "Yes, you can subscribe to our newsletter to get the latest updates on sustainable living directly in your inbox."
    }
];

export default function HelpCentrePage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [openFaq, setOpenFaq] = useState<number | null>(null);

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

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-12 pb-24">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-primary mb-4"
                    >
                        Help Centre
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 text-lg"
                    >
                        Find answers to common questions or get in touch with our team.
                    </motion.p>
                </div>

                <div className="max-w-4xl mx-auto space-y-16">

                    {/* FAQ Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                            <FaQuestionCircle className="text-primary" /> Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full px-6 py-4 text-left flex items-center justify-between font-bold text-gray-800 hover:bg-gray-50 transition-colors"
                                    >
                                        {faq.question}
                                        {openFaq === index ? <FaChevronUp className="text-primary" /> : <FaChevronDown className="text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h2>
                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <FaMapMarkerAlt className="text-primary text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Our Location</h3>
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
                                            <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                                            <p className="text-gray-600 mb-1">General: hello@greenblog.com</p>
                                            <p className="text-gray-600">Support: support@greenblog.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <FaPhone className="text-primary text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                                            <p className="text-gray-600">+1 (555) 123-4567</p>
                                            <p className="text-gray-500 text-sm mt-1">Mon-Fri: 9am - 6pm EST</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
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
                                        rows={4}
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
                                    {loading ? "Sending..." : <>Send Message <FaPaperPlane className="text-sm" /></>}
                                </button>
                                {status === "success" && (
                                    <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center border border-green-200">
                                        Message sent! We'll get back to you soon.
                                    </div>
                                )}
                                {status === "error" && (
                                    <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center border border-red-200">
                                        Something went wrong. Please try again.
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
