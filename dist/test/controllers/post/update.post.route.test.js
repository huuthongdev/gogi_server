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
const post_services_1 = require("../../../src/services/post.services");
describe('Post - Update | PUT /post/:_id', () => {
    let idPost, token, idUser;
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
        // Add new Post
        const post = yield post_services_1.PostServices.addNew(userLogin._id, 'tieude', 'tomtat', 'noidung', 'empty');
        idPost = post._id;
    }));
    it('Can update', () => __awaiter(this, void 0, void 0, function* () {
        const bodyRequest = {
            title: 'tieude_updated',
            excerpt: 'mota_updated',
            content: 'noidung_updated',
            thumbnail: 'thumbnail_updated'
        };
        const response = yield supertest_1.default(app_1.app)
            .put('/post/' + idPost)
            .set({ token })
            .send(bodyRequest);
        const { success, post } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(post._id, idPost);
        assert_1.equal(post.title, 'tieude_updated');
        assert_1.equal(post.excerpt, 'mota_updated');
        assert_1.equal(post.content, 'noidung_updated');
        assert_1.equal(post.thumbnail, 'thumbnail_updated');
        // Check post modified
        assert_1.equal(post.modified[0].title, 'tieude');
        assert_1.equal(post.modified[0].excerpt, 'tomtat');
        assert_1.equal(post.modified[0].thumbnail, 'empty');
        // Check post inside database
        const postDb = yield post_model_1.Post.findOne({});
        assert_1.equal(postDb.title, 'tieude_updated');
        assert_1.equal(postDb.excerpt, 'mota_updated');
        assert_1.equal(postDb.content, 'noidung_updated');
        assert_1.equal(postDb.thumbnail, 'thumbnail_updated');
        assert_1.equal(postDb.create_by.toString(), idUser);
        assert_1.equal(postDb.modified.length, 1);
        assert_1.equal(postDb.modified[0].title, 'tieude');
        assert_1.equal(postDb.modified[0].excerpt, 'tomtat');
        assert_1.equal(postDb.modified[0].thumbnail, 'empty');
    }));
    it('Cannot update without title', () => __awaiter(this, void 0, void 0, function* () {
        const bodyRequest = {
            // title: 'tieude_updated',
            excerpt: 'mota_updated',
            content: 'noidung_updated',
            thumbnail: 'thumbnail_updated'
        };
        const response = yield supertest_1.default(app_1.app)
            .put('/post/' + idPost)
            .set({ token })
            .send(bodyRequest);
        const { success, post, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(post, undefined);
        assert_1.equal(message, 'TITLE_MUST_BE_PROVIDED');
        assert_1.equal(response.status, 404);
        // Check post inside database
        const postDb = yield post_model_1.Post.findOne({});
        assert_1.equal(postDb.title, 'tieude');
        assert_1.equal(postDb.excerpt, 'tomtat');
        assert_1.equal(postDb.content, 'noidung');
        assert_1.equal(postDb.thumbnail, 'empty');
        assert_1.equal(postDb.create_by.toString(), idUser);
        assert_1.equal(postDb.modified.length, 0);
    }));
    it('Cannot update without content', () => __awaiter(this, void 0, void 0, function* () {
        const bodyRequest = {
            title: 'tieude_updated',
            excerpt: 'mota_updated',
            // content: 'noidung_updated',
            thumbnail: 'thumbnail_updated'
        };
        const response = yield supertest_1.default(app_1.app)
            .put('/post/' + idPost)
            .set({ token })
            .send(bodyRequest);
        const { success, post, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(post, undefined);
        assert_1.equal(message, 'CONTENT_MUST_BE_PROVIDED');
        assert_1.equal(response.status, 404);
        // Check post inside database
        const postDb = yield post_model_1.Post.findOne({});
        assert_1.equal(postDb.title, 'tieude');
        assert_1.equal(postDb.excerpt, 'tomtat');
        assert_1.equal(postDb.content, 'noidung');
        assert_1.equal(postDb.thumbnail, 'empty');
        assert_1.equal(postDb.create_by.toString(), idUser);
        assert_1.equal(postDb.modified.length, 0);
    }));
    it('Cannot update a removed post', () => __awaiter(this, void 0, void 0, function* () {
        yield post_model_1.Post.findByIdAndRemove(idPost);
        const bodyRequest = {
            title: 'tieude_updated',
            excerpt: 'mota_updated',
            content: 'noidung_updated',
            thumbnail: 'thumbnail_updated'
        };
        const response = yield supertest_1.default(app_1.app)
            .put('/post/' + idPost)
            .set({ token })
            .send(bodyRequest);
        const { success, post, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(post, undefined);
        assert_1.equal(message, 'POST_NOT_EXISTED');
        assert_1.equal(response.status, 404);
        // Check post inside database
        const postDb = yield post_model_1.Post.findOne({});
        assert_1.equal(postDb, undefined);
    }));
    it('Cannot update with invalid id', () => __awaiter(this, void 0, void 0, function* () {
        const bodyRequest = {
            title: 'tieude_updated',
            excerpt: 'mota_updated',
            content: 'noidung_updated',
            thumbnail: 'thumbnail_updated'
        };
        const response = yield supertest_1.default(app_1.app)
            .put('/post/' + 'idPost')
            .set({ token })
            .send(bodyRequest);
        const { success, post, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(post, undefined);
        assert_1.equal(message, 'INVALID_ID');
        assert_1.equal(response.status, 400);
        // Check post inside database
        const postDb = yield post_model_1.Post.findOne({});
        assert_1.equal(postDb.title, 'tieude');
        assert_1.equal(postDb.excerpt, 'tomtat');
        assert_1.equal(postDb.content, 'noidung');
        assert_1.equal(postDb.thumbnail, 'empty');
        assert_1.equal(postDb.create_by.toString(), idUser);
        assert_1.equal(postDb.modified.length, 0);
    }));
});
