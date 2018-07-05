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
describe('User - Login | POST /user/login', () => {
    let tokenVerify, idUser;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        // Sign up a new User
        const user = yield user_services_1.UserServices.signUp('huuthong.mgd@gmail.com', '0908508136', 'Huuthong123', 'Staff', 'huuthong', '76/6 tbg', new Date(1996, 11, 12, 3, 30, 0, 0), 'empty');
        tokenVerify = user.tokenVerify;
        idUser = user._id;
        // Verify user
        yield user_services_1.UserServices.verifyUser(tokenVerify);
    }));
    it('Can login with email', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .post('/user/login')
            .send({
            infoLogin: 'huuthong.mgd@gmail.com',
            plainPassword: 'Huuthong123'
        });
        const { success, user } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(user.profile.name, 'huuthong');
        assert_1.equal(user.profile.address, '76/6 tbg');
        assert_1.equal(user.profile.imgProfile, 'empty');
        assert_1.equal(new Date(user.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(user.email, 'huuthong.mgd@gmail.com');
        assert_1.equal(user.phone, '0908508136');
        assert_1.equal(user.isActive, true);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb._id, user._id);
        assert_1.equal(userDb.profile.name, 'huuthong');
        assert_1.equal(userDb.profile.address, '76/6 tbg');
        assert_1.equal(userDb.profile.imgProfile, 'empty');
        assert_1.equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(userDb.email, 'huuthong.mgd@gmail.com');
        assert_1.equal(userDb.phone, '0908508136');
        assert_1.equal(userDb.isActive, true);
    }));
    it('Can login with phone', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .post('/user/login')
            .send({
            infoLogin: '0908508136',
            plainPassword: 'Huuthong123'
        });
        const { success, user } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(user.profile.name, 'huuthong');
        assert_1.equal(user.profile.address, '76/6 tbg');
        assert_1.equal(user.profile.imgProfile, 'empty');
        assert_1.equal(new Date(user.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(user.email, 'huuthong.mgd@gmail.com');
        assert_1.equal(user.phone, '0908508136');
        assert_1.equal(user.isActive, true);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb._id, user._id);
        assert_1.equal(userDb.profile.name, 'huuthong');
        assert_1.equal(userDb.profile.address, '76/6 tbg');
        assert_1.equal(userDb.profile.imgProfile, 'empty');
        assert_1.equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(userDb.email, 'huuthong.mgd@gmail.com');
        assert_1.equal(userDb.phone, '0908508136');
        assert_1.equal(userDb.isActive, true);
    }));
    it('Cannot login without infoLogin', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .post('/user/login')
            .send({
            // infoLogin: '0908508136',
            plainPassword: 'Huuthong123'
        });
        const { success, user, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(user, undefined);
        assert_1.equal(message, 'ID_LOGIN_MUST_BE_PROVIDED');
        assert_1.equal(response.status, 404);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb.profile.name, 'huuthong');
        assert_1.equal(userDb.profile.address, '76/6 tbg');
        assert_1.equal(userDb.profile.imgProfile, 'empty');
        assert_1.equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(userDb.email, 'huuthong.mgd@gmail.com');
        assert_1.equal(userDb.phone, '0908508136');
        assert_1.equal(userDb.isActive, true);
    }));
    it('Cannot login without plainPassword', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .post('/user/login')
            .send({
            infoLogin: '0908508136',
        });
        const { success, user, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(user, undefined);
        assert_1.equal(message, 'PASSWORD_MUST_BE_PROVIDED');
        assert_1.equal(response.status, 404);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb.profile.name, 'huuthong');
        assert_1.equal(userDb.profile.address, '76/6 tbg');
        assert_1.equal(userDb.profile.imgProfile, 'empty');
        assert_1.equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(userDb.email, 'huuthong.mgd@gmail.com');
        assert_1.equal(userDb.phone, '0908508136');
        assert_1.equal(userDb.isActive, true);
    }));
    it('Cannot login with wrong infoLogin', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .post('/user/login')
            .send({
            infoLogin: '090850813612314',
            plainPassword: 'Huuthong123'
        });
        const { success, user, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(user, undefined);
        assert_1.equal(message, 'USER_NOT_EXISTED');
        assert_1.equal(response.status, 400);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb.profile.name, 'huuthong');
        assert_1.equal(userDb.profile.address, '76/6 tbg');
        assert_1.equal(userDb.profile.imgProfile, 'empty');
        assert_1.equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(userDb.email, 'huuthong.mgd@gmail.com');
        assert_1.equal(userDb.phone, '0908508136');
        assert_1.equal(userDb.isActive, true);
    }));
    it('Cannot login with wrong password', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .post('/user/login')
            .send({
            infoLogin: '0908508136',
            plainPassword: 'Huuthong12314142'
        });
        const { success, user, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(user, undefined);
        assert_1.equal(message, 'ID_OR_PASSWORD_INCORRECT');
        assert_1.equal(response.status, 404);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb.profile.name, 'huuthong');
        assert_1.equal(userDb.profile.address, '76/6 tbg');
        assert_1.equal(userDb.profile.imgProfile, 'empty');
        assert_1.equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(userDb.email, 'huuthong.mgd@gmail.com');
        assert_1.equal(userDb.phone, '0908508136');
        assert_1.equal(userDb.isActive, true);
    }));
    it('Cannot login when user not verify email || disable account', () => __awaiter(this, void 0, void 0, function* () {
        yield user_model_1.User.findByIdAndUpdate(idUser, { isActive: false });
        const response = yield supertest_1.default(app_1.app)
            .post('/user/login')
            .send({
            infoLogin: '0908508136',
            plainPassword: 'Huuthong123'
        });
        const { success, user, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(user, undefined);
        assert_1.equal(message, 'USER_NOT_ACTIVE');
        assert_1.equal(response.status, 404);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb.profile.name, 'huuthong');
        assert_1.equal(userDb.profile.address, '76/6 tbg');
        assert_1.equal(userDb.profile.imgProfile, 'empty');
        assert_1.equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(userDb.email, 'huuthong.mgd@gmail.com');
        assert_1.equal(userDb.phone, '0908508136');
        assert_1.equal(userDb.isActive, false);
    }));
    it('Cannot login with a removed user', () => __awaiter(this, void 0, void 0, function* () {
        yield user_model_1.User.findByIdAndRemove(idUser);
        const response = yield supertest_1.default(app_1.app)
            .post('/user/login')
            .send({
            infoLogin: '0908508136',
            plainPassword: 'Huuthong123'
        });
        const { success, user, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(user, undefined);
        assert_1.equal(message, 'USER_NOT_EXISTED');
        assert_1.equal(response.status, 400);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb, undefined);
    }));
});
