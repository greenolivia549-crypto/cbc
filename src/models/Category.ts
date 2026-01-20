import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a category name"],
            unique: true,
            maxlength: [50, "Name cannot be more than 50 characters"],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
