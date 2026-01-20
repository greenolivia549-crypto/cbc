import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Comment cannot be empty"],
            maxlength: [500, "Comment cannot be more than 500 characters"],
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
