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
const post_model_1 = require("../../../src/models/post.model");
describe('Post - Add New | POST /post', () => {
    let token, idUser;
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
    }));
    it('Can add new', () => __awaiter(this, void 0, void 0, function* () {
        const bodyRequest = {
            title: 'tieude',
            excerpt: 'mota',
            content: 'noidung',
            thumbnail: 'empty'
        };
        const response = yield supertest_1.default(app_1.app)
            .post('/post')
            .set({ token })
            .send(bodyRequest);
        const { success, post } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(post.title, 'tieude');
        assert_1.equal(post.excerpt, 'mota');
        assert_1.equal(post.content, 'noidung');
        assert_1.equal(post.thumbnail, 'empty');
        assert_1.equal(post.create_by, idUser);
        assert_1.equal(post.modified.length, 0);
        // Check post inside database
        const postDb = yield post_model_1.Post.findOne({});
        assert_1.equal(postDb.title, 'tieude');
        assert_1.equal(postDb.excerpt, 'mota');
        assert_1.equal(postDb.content, 'noidung');
        assert_1.equal(postDb.thumbnail, 'empty');
        assert_1.equal(postDb.create_by.toString(), idUser);
        assert_1.equal(postDb.modified.length, 0);
    }));
    it('Cannot add new without title', () => __awaiter(this, void 0, void 0, function* () {
        const bodyRequest = {
            // title: 'tieude',
            excerpt: 'mota',
            content: 'noidung'
        };
        const response = yield supertest_1.default(app_1.app)
            .post('/post')
            .set({ token })
            .send(bodyRequest);
        const { success, post, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(post, undefined);
        assert_1.equal(message, 'TITLE_MUST_BE_PROVIDED');
        assert_1.equal(response.status, 404);
        // Check post inside database
        const postDb = yield post_model_1.Post.findOne({});
        assert_1.equal(postDb, undefined);
    }));
    it('Cannot add new without content', () => __awaiter(this, void 0, void 0, function* () {
        const bodyRequest = {
            title: 'tieude',
            excerpt: 'mota',
        };
        const response = yield supertest_1.default(app_1.app)
            .post('/post')
            .set({ token })
            .send(bodyRequest);
        const { success, post, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(post, undefined);
        assert_1.equal(message, 'CONTENT_MUST_BE_PROVIDED');
        assert_1.equal(response.status, 404);
        // Check post inside database
        const postDb = yield post_model_1.Post.findOne({});
        assert_1.equal(postDb, undefined);
    }));
    it('Cannot add new without token', () => __awaiter(this, void 0, void 0, function* () {
        const bodyRequest = {
            title: 'tieude',
            excerpt: 'mota',
            content: 'noidung'
        };
        const response = yield supertest_1.default(app_1.app)
            .post('/post')
            // .set({ token })
            .send(bodyRequest);
        const { success, post, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(post, undefined);
        assert_1.equal(message, 'INVALID_TOKEN');
        assert_1.equal(response.status, 400);
        // Check post inside database
        const postDb = yield post_model_1.Post.findOne({});
        assert_1.equal(postDb, undefined);
    }));
    it('Cannot add new twice with a title', () => __awaiter(this, void 0, void 0, function* () {
        const bodyRequest = {
            title: 'tieude',
            excerpt: 'mota',
            content: 'noidung',
            thumbnail: 'empty'
        };
        yield supertest_1.default(app_1.app)
            .post('/post')
            .set({ token })
            .send(bodyRequest);
        const response = yield supertest_1.default(app_1.app)
            .post('/post')
            .set({ token })
            .send(bodyRequest);
        const { success, post, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(message, 'POST_IS_EXISTED');
        assert_1.equal(response.status, 400);
        // Check post inside database
        const postDb = yield post_model_1.Post.findOne({});
        assert_1.equal(postDb.title, 'tieude');
        assert_1.equal(postDb.excerpt, 'mota');
        assert_1.equal(postDb.content, 'noidung');
        assert_1.equal(postDb.thumbnail, 'empty');
        assert_1.equal(postDb.create_by.toString(), idUser);
        assert_1.equal(postDb.modified.length, 0);
    }));
});
