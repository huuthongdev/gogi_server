"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, trim: true, required: true, unique: true },
    phone: { type: String, trim: true, unique: true },
    password: { type: String, trim: true, required: true },
    register_at: { type: Date, default: Date.now() },
    isActive: { type: Boolean, default: false },
    role: { type: String, trim: true, default: 'Client' },
    profile: {
        name: { type: String, trim: true },
        address: { type: String, trim: true },
        birthday: { type: Date },
        imgProfile: { type: String, trim: true }
    }
});
exports.User = mongoose_1.model("User", userSchema);
