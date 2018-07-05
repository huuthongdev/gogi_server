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
const user_model_1 = require("../../../src/models/user.model");
describe('User - Sign Up Admin | GET /signup/admin/:secrectKeyAdmin/:email/:plainPassword', () => {
    it('Can sign up admin user', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .get('/user/signup/admin/120sadjaoczxklcj0912asidjdasijsadadszx12312/huuthong.mgd@gmail.com/Huuthong123');
        const { success, user } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(user.email, 'huuthong.mgd@gmail.com');
        assert_1.equal(user.password, undefined);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb._id, user._id);
        assert_1.equal(userDb.email, 'huuthong.mgd@gmail.com');
        assert_1.equal(userDb.role, 'Admin');
        assert_1.equal(userDb.isActive, false);
    }));
    it('Cannot sign up admin user with wrong secrectKeyAdmin', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .get('/user/signup/admin/asdzxc/huuthong.mgd@gmail.com/Huuthong123');
        const { success, user, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(user, undefined);
        assert_1.equal(message, 'ACCESS_IS_DENIDED');
        assert_1.equal(response.status, 400);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb, undefined);
    }));
});
