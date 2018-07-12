"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true, unique: true },
    excerpt: { type: String, trim: true },
    content: { type: String, trim: true, required: true },
    thumbnail: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    // Author
    create_at: { type: Date, default: Date.now() },
    create_by: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    // Time Stamp
    timeStamp: {
        udpate_at: { type: Date },
        update_by: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    },
    // Modified history
    modified: [{
            timeStamp: {
                udpate_at: { type: Date },
                update_by: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            },
            title: { type: String, required: true, trim: true },
            excerpt: { type: String, trim: true, required: true },
            content: { type: String, trim: true, required: true },
            thumbnail: { type: String, trim: true },
            isActive: { type: Boolean, default: true }
        }]
});
exports.Post = mongoose_1.model('Post', postSchema);
