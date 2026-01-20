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

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
