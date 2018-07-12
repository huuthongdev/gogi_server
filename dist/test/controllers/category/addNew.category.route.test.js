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
describe('Category - Add New | POST /category', () => {
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
        const response = yield supertest_1.default(app_1.app)
            .post('/category')
            .set({ token })
            .send({
            name: 'category_name',
            description: 'mota',
            thumbnail: 'empty'
        });
        const { success, category, message } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(category.name, 'category_name');
        assert_1.equal(category.description, 'mota');
        assert_1.equal(category.thumbnail, 'empty');
        assert_1.equal(message, undefined);
        // Check category inside database 
        const categoryDb = yield category_model_1.Category.findOne({});
        assert_1.equal(categoryDb.name, 'category_name');
        assert_1.equal(categoryDb.description, 'mota');
        assert_1.equal(categoryDb.thumbnail, 'empty');
    }));
    it('Cannot add new without name', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .post('/category')
            .set({ token })
            .send({
            // name: 'category_name',
            description: 'mota',
            thumbnail: 'empty'
        });
        const { success, category, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(message, 'NAME_MUST_BE_PROVIDED');
        assert_1.equal(response.status, 404);
        assert_1.equal(category, undefined);
        // Check category inside database 
        const categoryDb = yield category_model_1.Category.findOne({});
        assert_1.equal(categoryDb, undefined);
    }));
    it('Cannot add new twice with a name', () => __awaiter(this, void 0, void 0, function* () {
        yield supertest_1.default(app_1.app)
            .post('/category')
            .set({ token })
            .send({
            name: 'category_name',
            description: 'mota',
            thumbnail: 'empty'
        });
        const response = yield supertest_1.default(app_1.app)
            .post('/category')
            .set({ token })
            .send({
            name: 'category_name',
            description: 'mota',
            thumbnail: 'empty'
        });
        const { success, category, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(message, 'CATEGORY_IS_EXISTED');
        assert_1.equal(response.status, 400);
        assert_1.equal(category, undefined);
        // Check category inside database 
        const categoryDb = yield category_model_1.Category.findOne({});
        assert_1.equal(categoryDb.name, 'category_name');
        assert_1.equal(categoryDb.description, 'mota');
        assert_1.equal(categoryDb.thumbnail, 'empty');
    }));
    it('Cannot add new with invalid token || empty token', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .post('/category')
            // .set({ token })
            .send({
            name: 'category_name',
            description: 'mota',
            thumbnail: 'empty'
        });
        const { success, category, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(message, 'INVALID_TOKEN');
        assert_1.equal(response.status, 400);
        assert_1.equal(category, undefined);
        // Check category inside database 
        const categoryDb = yield category_model_1.Category.findOne({});
        assert_1.equal(categoryDb, undefined);
    }));
});
