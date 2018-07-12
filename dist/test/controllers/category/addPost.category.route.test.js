"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const assert_1 = require("assert");
const app_1 = require("../../../src/app");
const user_services_1 = require("../../../src/services/user.services");
const category_model_1 = require("../../../src/models/category.model");
const category_services_1 = require("../../../src/services/category.services");
const post_services_1 = require("../../../src/services/post.services");
describe.only('Category - Add Post | PUT /category/:_id', () => {
    let idPost1, idPost2, idCategory, token, idUser;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        // Sign up a new User
        const user = yield user_services_1.UserServices.signUp('huuthong.mgd@gmail.com', '0908508136', 'Huuthong123', 'Staff', 'huuthong', '76/6 tbg', new Date(1996, 11, 12, 3, 30, 0, 0), 'empty');
        const tokenVerify = user.tokenVerify;
        idUser = user._id;
        // Verify user
        yield user_services_1.UserServices.verifyUser(tokenVerify);
        // Login User
        const userLogin = yield user_services_1.UserServices.login('0908508136', 'Huuthong123');
        token = userLogin.token;
        // Add new category
        const category = yield category_services_1.CategoryServices.addNew('tieude', 'mota', 'empty');
        idCategory = category._id;
        // Add new Post
        const post1 = yield post_services_1.PostServices.addNew(idUser, 'post1', 'mota1', 'content1', 'empty');
        idPost1 = post1._id;
        const post2 = yield post_services_1.PostServices.addNew(idUser, 'post2', 'mota2', 'content2', 'empty');
        idPost2 = post2._id;
    }));
    it('Can add Post', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .post('/category/addpost')
            .set({ token })
            .send({ idCategory, idPost: idPost1 });
        const { success, category, message } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(category._id, idCategory);
        assert_1.equal(category.posts[0], idPost1);
        // Check category inside database
        const categoryDb = yield category_model_1.Category.findOne({});
        assert_1.equal(categoryDb.posts[0].toString(), idPost1);
    }));
    it('Can add two Post', () => __awaiter(this, void 0, void 0, function* () {
        yield supertest_1.default(app_1.app)
            .post('/category/addpost')
            .set({ token })
            .send({ idCategory, idPost: idPost1 });
        yield supertest_1.default(app_1.app)
            .post('/category/addpost')
            .set({ token })
            .send({ idCategory, idPost: idPost2 });
        // Check category inside database
        const categoryDb = yield category_model_1.Category.findOne({});
        assert_1.equal(categoryDb.posts[0].toString(), idPost1);
        assert_1.equal(categoryDb.posts[1].toString(), idPost2);
    }));
});
