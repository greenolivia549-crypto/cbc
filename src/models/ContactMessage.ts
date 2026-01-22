import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
    },
    subject: {
        type: String,
        required: [true, "Please provide a subject"],
    },
    message: {
        type: String,
        required: [true, "Please provide a message"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    read: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.models.ContactMessage || mongoose.model("ContactMessage", ContactMessageSchema);
