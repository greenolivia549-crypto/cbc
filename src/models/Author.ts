import mongoose from "mongoose";

const AuthorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            maxlength: [100, "Name cannot be more than 100 characters"],
        },
        email: {
            type: String,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email",
            ],
        },
        bio: {
            type: String,
            maxlength: [500, "Bio cannot be more than 500 characters"],
        },
        image: {
            type: String,
            default: "/images/authors/default-author.png",
        },
        instagram: {
            type: String,
        },
        twitter: {
            type: String,
        },
        linkedin: {
            type: String,
        },
    },
    { timestamps: true }
);

// Prevent mongoose from creating a new model if it already exists (Hot Reload fix)
if (process.env.NODE_ENV === "development" && mongoose.models.Author) {
    delete mongoose.models.Author;
}

export default mongoose.models.Author || mongoose.model("Author", AuthorSchema);
