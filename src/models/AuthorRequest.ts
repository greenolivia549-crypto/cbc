import mongoose from "mongoose";

const AuthorRequestSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: [true, "Please provide a name"],
            maxlength: [100, "Name cannot be more than 100 characters"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email",
            ],
        },
        bio: {
            type: String,
            required: [true, "Please provide a bio"],
            maxlength: [500, "Bio cannot be more than 500 characters"],
        },
        portfolio: {
            type: String,
            maxlength: [200, "Portfolio URL cannot be more than 200 characters"],
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// Prevent mongoose from creating a new model if it already exists (Hot Reload fix)
if (process.env.NODE_ENV === "development" && mongoose.models.AuthorRequest) {
    delete mongoose.models.AuthorRequest;
}

export default mongoose.models.AuthorRequest || mongoose.model("AuthorRequest", AuthorRequestSchema);
