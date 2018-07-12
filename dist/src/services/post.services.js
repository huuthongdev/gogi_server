"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = require("../models/post.model");
const checkObjectId_1 = require("../helpers/checkObjectId");
const my_error_model_1 = require("../models/my-error.model");
class PostServices {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return post_model_1.Post.find({ isActive: true });
        });
    }
    static getPostById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            checkObjectId_1.checkObjectId(_id);
            const post = yield post_model_1.Post.findById(_id);
            if (!post)
                throw new my_error_model_1.MyError('POST_NOT_EXISTED', 404);
            return post;
        });
    }
    static addNew(idUser, title, excerpt, content, thumbnail) {
        return __awaiter(this, void 0, void 0, function* () {
            checkObjectId_1.checkObjectId(idUser);
            if (!title)
                throw new my_error_model_1.MyError('TITLE_MUST_BE_PROVIDED', 404);
            if (!content)
                throw new my_error_model_1.MyError('CONTENT_MUST_BE_PROVIDED', 404);
            const post = new post_model_1.Post({ title, excerpt, content, thumbnail, create_by: idUser });
            yield post.save();
            return post;
        });
    }
    static update(idUser, _id, title, excerpt, content, thumbnail) {
        return __awaiter(this, void 0, void 0, function* () {
            checkObjectId_1.checkObjectId(idUser, _id);
            if (!title)
                throw new my_error_model_1.MyError('TITLE_MUST_BE_PROVIDED', 404);
            if (!content)
                throw new my_error_model_1.MyError('CONTENT_MUST_BE_PROVIDED', 404);
            const postOld = yield post_model_1.Post.findById(_id);
            if (!postOld)
                throw new my_error_model_1.MyError('POST_NOT_EXISTED', 404);
            const postOldInfo = postOld.toObject();
            delete postOldInfo.modified;
            const timeStamp = {
                update_at: Date.now(),
                update_by: idUser
            };
            const post = yield post_model_1.Post.findByIdAndUpdate(_id, { title, excerpt, content, thumbnail, timeStamp, $push: { modified: postOldInfo } }, { new: true });
            return post;
        });
    }
    static disablePost(idUser, _id) {
        return __awaiter(this, void 0, void 0, function* () {
            checkObjectId_1.checkObjectId(idUser, _id);
            const post = yield post_model_1.Post.findByIdAndUpdate(_id, { isActive: false }, { new: true });
            if (!post)
                throw new my_error_model_1.MyError('POST_NOT_EXISTED', 404);
            return post;
        });
    }
    static remove(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            checkObjectId_1.checkObjectId(_id);
            const post = yield post_model_1.Post.findByIdAndRemove(_id);
            if (!post)
                throw new my_error_model_1.MyError('POST_NOT_EXISTED', 404);
            return post;
        });
    }
}
exports.PostServices = PostServices;
