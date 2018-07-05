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
const user_services_1 = require("../../../src/services/user.services");
describe('User - Change Role | POST /user/login', () => {
    let idUser, token, idUserAd, tokenAd;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        // Create new user normal
        const u = yield user_services_1.UserServices.signUp('teo@gmail.com', '01672716602', 'teo2018', 'Client', 'teo', '76/6 tbg', new Date(1996, 11, 12, 3, 30, 0, 0), 'empty');
        yield user_services_1.UserServices.verifyUser(u.tokenVerify);
        const user = yield user_services_1.UserServices.login('01672716602', 'teo2018');
        idUser = user._id;
        token = user.token;
        // Create admin user
        const uAd = yield user_services_1.UserServices.signUpAdmin('120sadjaoczxklcj0912asidjdasijsadadszx12312', 'ad@gmail.com', 'ad12345');
        yield user_services_1.UserServices.verifyUser(uAd.tokenVerify);
        const userAd = yield user_services_1.UserServices.login('ad@gmail.com', 'ad12345');
        idUserAd = userAd._id;
        tokenAd = userAd.token;
    }));
    it('Can change role', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .post('/user/role/' + idUser)
            .set({ token: tokenAd })
            .send({ role: 'Marketing' });
        const { success, user } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(user.profile.name, 'teo');
        assert_1.equal(user.profile.address, '76/6 tbg');
        assert_1.equal(user.profile.imgProfile, 'empty');
        assert_1.equal(new Date(user.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(user.email, 'teo@gmail.com');
        assert_1.equal(user.phone, '01672716602');
        assert_1.equal(user.isActive, true);
        assert_1.equal(user.role, 'Marketing');
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({ email: 'teo@gmail.com' });
        assert_1.equal(userDb._id, user._id);
        assert_1.equal(userDb.profile.name, 'teo');
        assert_1.equal(userDb.profile.address, '76/6 tbg');
        assert_1.equal(userDb.profile.imgProfile, 'empty');
        assert_1.equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(userDb.email, 'teo@gmail.com');
        assert_1.equal(userDb.phone, '01672716602');
        assert_1.equal(userDb.isActive, true);
        assert_1.equal(userDb.role, 'Marketing');
    }));
    it('Cannot change role without role', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .post('/user/role/' + idUser)
            .set({ token: tokenAd })
            .send({ role: '' });
        const { success, user, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(user, undefined);
        assert_1.equal(message, 'ROLE_MUST_BE_PROVIDED');
        assert_1.equal(response.status, 404);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({ email: 'teo@gmail.com' });
        assert_1.equal(userDb.profile.name, 'teo');
        assert_1.equal(userDb.profile.address, '76/6 tbg');
        assert_1.equal(userDb.profile.imgProfile, 'empty');
        assert_1.equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(userDb.email, 'teo@gmail.com');
        assert_1.equal(userDb.phone, '01672716602');
        assert_1.equal(userDb.isActive, true);
        assert_1.equal(userDb.role, 'Client');
    }));
    it('Cannot change role with invalid role', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .post('/user/role/' + idUser)
            .set({ token: tokenAd })
            .send({ role: 'Marketings' });
        const { success, user, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(user, undefined);
        assert_1.equal(message, 'INVALID_ROLE_USER');
        assert_1.equal(response.status, 404);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({ email: 'teo@gmail.com' });
        assert_1.equal(userDb.profile.name, 'teo');
        assert_1.equal(userDb.profile.address, '76/6 tbg');
        assert_1.equal(userDb.profile.imgProfile, 'empty');
        assert_1.equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(userDb.email, 'teo@gmail.com');
        assert_1.equal(userDb.phone, '01672716602');
        assert_1.equal(userDb.isActive, true);
        assert_1.equal(userDb.role, 'Client');
    }));
    it('Cannot change role with invalid id', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .post('/user/role/' + 'idUser')
            .set({ token: tokenAd })
            .send({ role: 'Marketing' });
        const { success, user, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(user, undefined);
        assert_1.equal(message, 'INVALID_ID');
        assert_1.equal(response.status, 400);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({ email: 'teo@gmail.com' });
        assert_1.equal(userDb.profile.name, 'teo');
        assert_1.equal(userDb.profile.address, '76/6 tbg');
        assert_1.equal(userDb.profile.imgProfile, 'empty');
        assert_1.equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(userDb.email, 'teo@gmail.com');
        assert_1.equal(userDb.phone, '01672716602');
        assert_1.equal(userDb.isActive, true);
        assert_1.equal(userDb.role, 'Client');
    }));
    it('Cannot change role with user not admin role', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .post('/user/role/' + 'idUser')
            .set({ token })
            .send({ role: 'Marketing' });
        const { success, user, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(user, undefined);
        assert_1.equal(message, 'ACCESS_IS_DENIDED');
        assert_1.equal(response.status, 400);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({ email: 'teo@gmail.com' });
        assert_1.equal(userDb.profile.name, 'teo');
        assert_1.equal(userDb.profile.address, '76/6 tbg');
        assert_1.equal(userDb.profile.imgProfile, 'empty');
        assert_1.equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(userDb.email, 'teo@gmail.com');
        assert_1.equal(userDb.phone, '01672716602');
        assert_1.equal(userDb.isActive, true);
        assert_1.equal(userDb.role, 'Client');
    }));
    it('Cannot change role a removed user', () => __awaiter(this, void 0, void 0, function* () {
        yield user_model_1.User.findByIdAndRemove(idUser);
        const response = yield supertest_1.default(app_1.app)
            .post('/user/role/' + 'idUser')
            .set({ token })
            .send({ role: 'Marketing' });
        const { success, user, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(user, undefined);
        assert_1.equal(message, 'USER_NOT_EXISTED');
        assert_1.equal(response.status, 400);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({ email: 'teo@gmail.com' });
        assert_1.equal(userDb, undefined);
    }));
});
