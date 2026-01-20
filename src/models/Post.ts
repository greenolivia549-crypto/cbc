import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title"],
            maxlength: [100, "Title cannot be more than 100 characters"],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        content: {
            type: String,
            required: [true, "Please provide content"],
        },
        excerpt: {
            type: String,
            required: [true, "Please provide an excerpt"],
            maxlength: [200, "Excerpt cannot be more than 200 characters"],
        },
        image: {
            type: String,
            required: [true, "Please provide an image URL"],
        },
        category: {
            type: String,
            required: [true, "Please provide a category"],
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        published: {
            type: Boolean,
            default: true,
        },
        seoTitle: {
            type: String,
            maxlength: [60, "SEO Title cannot exceed 60 characters"],
        },
        seoDescription: {
            type: String,
            maxlength: [160, "SEO Description cannot exceed 160 characters"],
        },
        keywords: {
            type: String, // Comma separated
        },
        likes: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Prevent mongoose from creating a new model if it already exists (Hot Reload fix)
// Delete to force recompile if schema changed
if (process.env.NODE_ENV === "development" && mongoose.models.Post) {
    delete mongoose.models.Post;
}

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
