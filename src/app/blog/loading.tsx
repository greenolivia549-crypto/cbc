export default function BlogLoading() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="h-56 bg-gray-200 animate-pulse"></div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                                <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                            </div>
                            <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                            <div className="h-20 bg-gray-200 rounded w-full animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
