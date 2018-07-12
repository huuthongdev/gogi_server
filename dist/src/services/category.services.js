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
const category_model_1 = require("../models/category.model");
const my_error_model_1 = require("../models/my-error.model");
const checkObjectId_1 = require("../helpers/checkObjectId");
class CategoryServices {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield category_model_1.Category.find({});
        });
    }
    static addNew(name, description, thumbnail) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!name)
                throw new my_error_model_1.MyError('NAME_MUST_BE_PROVIDED', 404);
            const category = new category_model_1.Category({ name, description, thumbnail });
            try {
                yield category.save();
                return category;
            }
            catch (error) {
                throw new my_error_model_1.MyError("CATEGORY_IS_EXISTED", 400);
            }
        });
    }
    static update(_id, description, thumbnail) {
        return __awaiter(this, void 0, void 0, function* () {
            checkObjectId_1.checkObjectId(_id);
            const category = yield category_model_1.Category.findByIdAndUpdate(_id, { description, thumbnail }, { new: true });
            if (!category)
                throw new my_error_model_1.MyError('CATEGORY_NOT_EXISTED', 404);
            return category;
        });
    }
    static remove(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            checkObjectId_1.checkObjectId(_id);
            const category = yield category_model_1.Category.findByIdAndRemove(_id);
            if (!category)
                throw new my_error_model_1.MyError('CATEGORY_NOT_EXISTED', 400);
            return category;
        });
    }
    static addPost(idCategory, idPost) {
        return __awaiter(this, void 0, void 0, function* () {
            checkObjectId_1.checkObjectId(idCategory, idPost);
            const query = { _id: idCategory, posts: { $ne: idPost } };
            const category = yield category_model_1.Category.findOneAndUpdate(query, { $addToSet: { posts: idPost } }, { new: true });
            if (!category)
                throw new my_error_model_1.MyError('CATEGORY_NOT_EXISTED', 400);
            return category;
        });
    }
}
exports.CategoryServices = CategoryServices;
