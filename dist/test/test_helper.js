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
process.env.NODE_ENV = 'test';
require("../src/helpers/connectDatabase");
// Collections
const user_model_1 = require("../src/models/user.model");
const post_model_1 = require("../src/models/post.model");
const category_model_1 = require("../src/models/category.model");
beforeEach('Clear all data for test', () => __awaiter(this, void 0, void 0, function* () {
    yield user_model_1.User.remove({});
    yield post_model_1.Post.remove({});
    yield category_model_1.Category.remove({});
}));
