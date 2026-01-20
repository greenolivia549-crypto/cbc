import Image from "next/image";
import { FaLeaf, FaUsers, FaGlobe } from "react-icons/fa";

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Hero Section */}
            <div className="bg-primary text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">About GreenBlog</h1>
                    <p className="text-xl text-green-100 max-w-2xl mx-auto">
                        Inspiring sustainable living and eco-friendly choices for a better tomorrow.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center p-6 bg-gray-50 rounded-xl">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl mx-auto mb-6">
                            <FaLeaf />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Our Mission</h3>
                        <p className="text-gray-600">
                            To empower individuals with actionable knowledge on how to live a more sustainable and environmentally conscious life.
                        </p>
                    </div>
                    <div className="text-center p-6 bg-gray-50 rounded-xl">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl mx-auto mb-6">
                            <FaUsers />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Community</h3>
                        <p className="text-gray-600">
                            Building a global community of like-minded people who share tips, stories, and support for the green journey.
                        </p>
                    </div>
                    <div className="text-center p-6 bg-gray-50 rounded-xl">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl mx-auto mb-6">
                            <FaGlobe />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Impact</h3>
                        <p className="text-gray-600">
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                        <p className="text-gray-600 mb-4">
                            GreenBlog started in 2024 as a small personal project by a group of environmental enthusiasts. We noticed a lack of accessible, practical information on how to transition to a greener lifestyle without getting overwhelmed.
                        </p>
                        <p className="text-gray-600">
                            Today, we have grown into a diverse team of writers, researchers, and tech experts, all united by a single goal: to make sustainability the new normal.
                        </p>
                    </div>
                </div>
            </div>

            {/* Team Section Placeholder */}
            <div className="bg-gray-50 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">Meet the Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {['Sarah Green', 'David Chen', 'Anna Smith', 'Mike Ross'].map((name, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden relative">
                                    {/* Placeholder avatar */}
                                    <Image
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
                                        alt={name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h4 className="font-bold text-lg">{name}</h4>
                                <p className="text-sm text-primary">Editor</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
