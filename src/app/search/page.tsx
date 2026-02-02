import Link from "next/link";
import Image from "next/image";
import { FaCalendar, FaUser, FaSearch } from "react-icons/fa";
import { IPost, ICategory } from "@/types";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import "@/models/User";
import Category from "@/models/Category";

async function getData(q: string | undefined, category: string | undefined, startDate: string | undefined, endDate: string | undefined) {
    await connectToDatabase();

    // Fetch Categories and serialize matches
    // Fetch Categories and serialize matches
    const rawCategories = await Category.find({}).lean();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categories: ICategory[] = rawCategories.map((cat: any) => ({
        ...cat,
        _id: cat._id.toString()
    }));

    if (!q && !category && !startDate && !endDate) {
        return { posts: [], categories };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { published: true };
    if (category && category !== "all") {
        query.category = category;
    }

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (q) {
        const regex = new RegExp(q, "i");
        query.$or = [
            { title: { $regex: regex } },
            { excerpt: { $regex: regex } },
        ];
    }

    // Explicitly type and lean() query
    const posts = await Post.find(query).sort({ createdAt: -1 }).populate("author", "name").populate("authorProfile").lean();

    // Serialize for Server Component (Mongoose docs aren't plain objects otherwise)
    const serializedPosts = posts.map(post => ({
        ...post,
        _id: (post._id as { toString: () => string }).toString(),
        createdAt: new Date(post.createdAt).toISOString(),
        updatedAt: new Date(post.updatedAt).toISOString(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        author: post.author ? { name: (post.author as any).name } : undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        authorProfile: post.authorProfile ? { name: (post.authorProfile as any).name } : undefined
    }));

    return { posts: serializedPosts as unknown as IPost[], categories };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; startDate?: string; endDate?: string }> }) {
    const { q, category, startDate, endDate } = await searchParams;
    const { posts, categories } = await getData(q, category, startDate, endDate);

    return (
        <div className="min-h-screen bg-gray-50 pt-12 pb-24">
            <div className="container mx-auto px-4">

                {/* Search Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200 pb-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Search Results
                        </h1>
                        <p className="text-gray-500">
                            {q ? <>Showing results for <span className="text-primary font-semibold">&quot;{q}&quot;</span></> : "Browse articles by category"}
                        </p>
                    </div>

                    {/* Server-side form for filtering */}
                    <form className="flex flex-wrap gap-2 items-center">
                        <input
                            type="hidden"
                            name="q"
                            value={q || ""}
                        />
                        <div className="flex items-center gap-2 bg-white px-3 py-2 border border-gray-200 rounded-lg">
                            <span className="text-sm text-gray-500 font-medium">From:</span>
                            <input
                                type="date"
                                name="startDate"
                                defaultValue={startDate || ""}
                                className="text-sm text-gray-700 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-2 border border-gray-200 rounded-lg">
                            <span className="text-sm text-gray-500 font-medium">To:</span>
                            <input
                                type="date"
                                name="endDate"
                                defaultValue={endDate || ""}
                                className="text-sm text-gray-700 outline-none"
                            />
                        </div>

                        <select
                            name="category"
                            defaultValue={category || ""}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700 bg-white"
                        // Adding simple submit on change implementation requires client component wrapper, 
                        // or standard form submission button. Let's keep it simple with a button for now.
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors">
                            Filter
                        </button>
                    </form>
                </div>

                {!q && !category && !startDate && !endDate ? (
                    <div className="text-center py-20">
                        <FaSearch className="mx-auto text-6xl text-gray-200 mb-6" />
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Search GreenBlog</h1>
                        <p className="text-gray-500 text-lg">Enter a keyword or select a category to start.</p>

                        <form className="mt-8 max-w-md mx-auto flex gap-2">
                            <input
                                name="q"
                                placeholder="Search articles..."
                                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                required
                            />
                            <button type="submit" className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-green-700 transition-colors">
                                Search
                            </button>
                        </form>
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <article key={post._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                                <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                            {post.category}
                                        </span>
                                    </div>
                                </Link>

                                <div className="p-6">
                                    <Link href={`/blog/${post.slug}`}>
                                        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>
                                    </Link>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-2">
                                            <FaUser className="text-primary/60" />
                                            <span>{(typeof post.authorProfile === 'object' && (post.authorProfile as any).name) || (typeof post.author === 'object' && post.author?.name) || "Admin"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaCalendar className="text-primary/60" />
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg">No results found.</p>
                        <p className="text-gray-400 mt-2">Try checking your spelling or use different keywords.</p>
                        <Link href="/search" className="inline-block mt-4 text-primary hover:underline font-medium">Clear Filters</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
