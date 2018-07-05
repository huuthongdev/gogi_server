"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const my_error_model_1 = require("../models/my-error.model");
function checkObjectId(...ids) {
    try {
        ids.forEach(id => new mongoose_1.default.Types.ObjectId(id.toString()));
    }
    catch (error) {
        throw new my_error_model_1.MyError('INVALID_ID', 400);
    }
}
exports.checkObjectId = checkObjectId;
