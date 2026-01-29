import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";
import { IPost } from "@/types";
import { cache } from "react";

export interface PaginationResult {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
}

export interface PostsResult {
    posts: IPost[];
    pagination?: PaginationResult;
}

// Ensure database connection
async function ensureDb() {
    await connectToDatabase();
}

/**
 * Fetch posts with various filters
 */
export async function getPosts(options: {
    page?: number;
    limit?: number;
    featured?: boolean;
    category?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
} = {}): Promise<PostsResult> {
    await ensureDb();

    const {
        page = 1,
        limit = 9,
        featured,
        category,
        search,
        startDate,
        endDate
    } = options;

    const query: any = { published: true };

    if (featured) query.featured = true;
    if (category && category !== 'all') query.category = category;

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
        const regex = new RegExp(search, "i");
        query.$or = [
            { title: { $regex: regex } },
            { excerpt: { $regex: regex } },
        ];
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
        Post.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("author", "name")
            .lean(),
        Post.countDocuments(query)
    ]);

    // Serialize
    const serializedPosts = posts.map(serializePost);

    return {
        posts: serializedPosts,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total
        }
    };
}

/**
 * Get popular posts (sorted by likes)
 */
export async function getPopularPosts(limit: number = 5): Promise<IPost[]> {
    await ensureDb();

    const posts = await Post.find({ published: true })
        .sort({ likes: -1 })
        .limit(limit)
        .populate("author", "name")
        .lean();

    return posts.map(serializePost);
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts(limit: number = 5): Promise<IPost[]> {
    await ensureDb();

    const posts = await Post.find({ published: true, featured: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("author", "name")
        .lean();

    return posts.map(serializePost);
}

/**
 * Get a single post by slug
 */
export const getPostBySlug = cache(async (slug: string): Promise<IPost | null> => {
    await ensureDb();

    const post = await Post.findOne({ slug, published: true })
        .populate("author", "name")
        .lean();

    if (!post) return null;

    return serializePost(post);
});

/**
 * Helper to serialize MongoDB objects
 */
function serializePost(post: any): IPost {
    return {
        _id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        category: post.category,
        author: post.author ? {
            name: post.author.name || "Admin",
            _id: post.author._id ? post.author._id.toString() : undefined,
            image: post.author.image,
        } : { name: "Admin" },
        authorProfile: post.authorProfile ? post.authorProfile.toString() : undefined,
        featured: post.featured,
        published: post.published,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        keywords: post.keywords,
        likes: post.likes || 0,
        likedBy: post.likedBy ? post.likedBy.map((id: any) => id.toString()) : [],
        createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt,
        updatedAt: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : post.updatedAt,
        isFavorited: post.isFavorited
    };
}
