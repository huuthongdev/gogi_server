"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: { type: String, trim: true, required: true, unique: true },
    description: { type: String, trim: true },
    thumbnail: { type: String, trim: true },
    posts: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Post' }]
});
exports.Category = mongoose_1.model('Category', categorySchema);
