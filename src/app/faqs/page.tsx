import React from 'react';

const faqs = [
    {
        question: "How do I create a new blog post?",
        answer: "Once you're signed in, navigate to your dashboard or click the 'Write' button in the header. You'll be taken to our rich text editor where you can craft your story."
    },
    {
        question: "Is this platform free to use?",
        answer: "Yes! Reading and writing articles is completely free. We believe in open access to knowledge and creativity."
    },
    {
        question: "Can I edit my comments?",
        answer: "Currently, you can delete and re-post comments, but direct editing is coming in a future update to ensure conversation integrity."
    },
    {
        question: "How does the 'Trending' section work?",
        answer: "Our algorithm highlights stories that are receiving high engagement (views, likes, and comments) in a short period of time."
    },
    {
        question: "Can I customize my profile?",
        answer: "Absolutely. You can update your bio, profile picture, and social links from your profile settings page."
    }
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-[#002200] sm:text-5xl">
                        Frequently Asked Questions
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Everything you need to know about our platform.
                    </p>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-[#f0fdf0] rounded-xl p-6 border border-green-100 hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold text-[#006400] mb-2 cursor-pointer">
                                {faq.question}
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
