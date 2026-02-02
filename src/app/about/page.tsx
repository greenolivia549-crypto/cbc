import Image from "next/image";
import { FaLeaf, FaUsers, FaGlobe } from "react-icons/fa";

export default function AboutPage() {
    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <div className="bg-primary text-primary-foreground py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">About GreenBlog</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        Inspiring sustainable living and eco-friendly choices for a better tomorrow.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center p-6 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-transparent dark:border-white/5">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl mx-auto mb-6">
                            <FaLeaf />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-foreground">Our Mission</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            To empower individuals with actionable knowledge on how to live a more sustainable and environmentally conscious life.
                        </p>
                    </div>
                    <div className="text-center p-6 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-transparent dark:border-white/5">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl mx-auto mb-6">
                            <FaUsers />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-foreground">Community</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Building a global community of like-minded people who share tips, stories, and support for the green journey.
                        </p>
                    </div>
                    <div className="text-center p-6 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-transparent dark:border-white/5">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl mx-auto mb-6">
                            <FaGlobe />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-foreground">Impact</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Focusing on real-world impact through awareness, advocacy, and promoting innovative green technologies.
                        </p>
                    </div>
                </div>
            </div>

            {/* Story Section */}
            <div className="container mx-auto px-4 mb-20">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2 relative h-64 md:h-auto">
                        <Image
                            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2613&auto=format&fit=crop"
                            alt="Our Story"
                            width={600}
                            height={400}
                            className="rounded-2xl shadow-lg object-cover"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-foreground mb-6 font-serif">Our Story</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                            GreenBlog started in 2024 as a small personal project by a group of environmental enthusiasts. We noticed a lack of accessible, practical information on how to transition to a greener lifestyle without getting overwhelmed.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Today, we have grown into a diverse team of writers, researchers, and tech experts, all united by a single goal: to make sustainability the new normal.
                        </p>
                    </div>
                </div>
            </div>

            {/* Team Section Placeholder */}
            <div className="bg-gray-50 dark:bg-zinc-900/30 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-12 font-serif">Meet the Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {['Sarah Green', 'David Chen', 'Anna Smith', 'Mike Ross'].map((name, i) => (
                            <div key={i} className="glass p-6 rounded-2xl shadow-sm">
                                <div className="w-24 h-24 bg-gray-200 dark:bg-zinc-800 rounded-full mx-auto mb-4 overflow-hidden relative">
                                    {/* Placeholder avatar */}
                                    <Image
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
                                        alt={name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h4 className="font-bold text-lg text-foreground">{name}</h4>
                                <p className="text-sm text-primary">Editor</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
