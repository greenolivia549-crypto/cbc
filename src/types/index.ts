export interface IAuthor {
    _id: string;
    name: string;
    email?: string;
    image?: string;
    bio?: string; // Add bio
}

export interface ICategory {
    _id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface IPost {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    author: {
        _id?: string;
        name: string;
        image?: string;
    };
    authorProfile?: IAuthor | string; // Reference to Author model (populated or ID)
    featured: boolean;
    published: boolean;
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string;
    likes?: number; // Add likes count
    likedBy?: string[]; // Add array of user IDs who liked
    createdAt: string;
    updatedAt: string;
    isFavorited?: boolean;
}

export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin" | "developer";
    image?: string;
    favorites?: string[];
}

export interface IComment {
    _id: string;
    content: string;
    post: string; // Post ID
    user: {
        _id: string;
        name: string;
        image?: string;
    };
    createdAt: string;
}
