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
describe('User - Sign Up | POST /user/signup ', () => {
    it('Can sign up new user', () => __awaiter(this, void 0, void 0, function* () {
        const bodyRequest = {
            email: 'huuthong.mgd@gmail.com',
            phone: '0908508136',
            plainPassword: 'Huuthong123',
            role: 'Staff',
            name: 'huuthong',
            address: '76/6 tbg',
            birthday: new Date(1996, 11, 12, 3, 30, 0, 0),
            imgProfile: 'empty'
        };
        const response = yield supertest_1.default(app_1.app)
            .post('/user/signup')
            .send(bodyRequest);
        const { success, user, message } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(user.profile.name, 'huuthong');
        assert_1.equal(user.profile.address, '76/6 tbg');
        assert_1.equal(user.profile.imgProfile, 'empty');
        assert_1.equal(new Date(user.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(user.email, 'huuthong.mgd@gmail.com');
        assert_1.equal(user.phone, '0908508136');
        assert_1.equal(user.role, 'Staff');
        assert_1.equal(user.isActive, false);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb._id, user._id);
        assert_1.equal(userDb.profile.name, 'huuthong');
        assert_1.equal(userDb.profile.address, '76/6 tbg');
        assert_1.equal(userDb.profile.imgProfile, 'empty');
        assert_1.equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(userDb.email, 'huuthong.mgd@gmail.com');
        assert_1.equal(userDb.phone, '0908508136');
        assert_1.equal(userDb.role, 'Staff');
        assert_1.equal(userDb.isActive, false);
    }));
    it('Cannot sign up without email', () => __awaiter(this, void 0, void 0, function* () {
        const bodyRequest = {
            // email: 'huuthong.mgd@gmail.com',
            phone: '0908508136',
            plainPassword: 'Huuthong123',
            role: 'Staff',
            name: 'huuthong',
            address: '76/6 tbg',
            birthday: new Date(1996, 11, 12, 3, 30, 0, 0),
            imgProfile: 'empty'
        };
        const response = yield supertest_1.default(app_1.app)
            .post('/user/signup')
            .send(bodyRequest);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(message, 'EMAIL_MUST_BE_PROVIDED');
        assert_1.equal(response.status, 404);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb, undefined);
    }));
    it('Cannot sign up with wrong email format', () => __awaiter(this, void 0, void 0, function* () {
        const bodyRequest = {
            email: 'huuthong.mgdgmail.com',
            phone: '0908508136',
            plainPassword: 'Huuthong123',
            role: 'Staff',
            name: 'huuthong',
            address: '76/6 tbg',
            birthday: new Date(1996, 11, 12, 3, 30, 0, 0),
            imgProfile: 'empty'
        };
        const response = yield supertest_1.default(app_1.app)
            .post('/user/signup')
            .send(bodyRequest);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(message, 'WRONG_EMAIL_FORMAT');
        assert_1.equal(response.status, 404);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb, undefined);
    }));
    it('Cannot sign up without plainPassword', () => __awaiter(this, void 0, void 0, function* () {
        const bodyRequest = {
            email: 'huuthong.mgd@gmail.com',
            phone: '0908508136',
            // plainPassword: 'Huuthong123',
            role: 'Staff',
            name: 'huuthong',
            address: '76/6 tbg',
            birthday: new Date(1996, 11, 12, 3, 30, 0, 0),
            imgProfile: 'empty'
        };
        const response = yield supertest_1.default(app_1.app)
            .post('/user/signup')
            .send(bodyRequest);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(message, 'PASSWORD_MUST_BE_PROVIDED');
        assert_1.equal(response.status, 404);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb, undefined);
    }));
    it('Cannot signup with lengh of password less than 7 characters', () => __awaiter(this, void 0, void 0, function* () {
        const bodyRequest = {
            email: 'huuthong.mgd@gmail.com',
            phone: '0908508136',
            plainPassword: 'Huu',
            role: 'Staff',
            name: 'huuthong',
            address: '76/6 tbg',
            birthday: new Date(1996, 11, 12, 3, 30, 0, 0),
            imgProfile: 'empty'
        };
        const response = yield supertest_1.default(app_1.app)
            .post('/user/signup')
            .send(bodyRequest);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(message, 'PASSWORD_LENGTH_MUST_BE_MORE_THAN_SEVEN_CHARACTERS');
        assert_1.equal(response.status, 404);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb, undefined);
    }));
    it('Cannot sign up without role', () => __awaiter(this, void 0, void 0, function* () {
        const bodyRequest = {
            email: 'huuthong.mgd@gmail.com',
            phone: '0908508136',
            plainPassword: 'Huuthong123',
            // role: 'Staff',
            name: 'huuthong',
            address: '76/6 tbg',
            birthday: new Date(1996, 11, 12, 3, 30, 0, 0),
            imgProfile: 'empty'
        };
        const response = yield supertest_1.default(app_1.app)
            .post('/user/signup')
            .send(bodyRequest);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(message, 'ROLE_MUST_BE_PROVIDED');
        assert_1.equal(response.status, 404);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb, undefined);
    }));
    it('Cannot sign up with invalid role || not Client/Staff/Marketing', () => __awaiter(this, void 0, void 0, function* () {
        const bodyRequest = {
            email: 'huuthong.mgd@gmail.com',
            phone: '0908508136',
            plainPassword: 'Huuthong123',
            role: 'Admins',
            name: 'huuthong',
            address: '76/6 tbg',
            birthday: new Date(1996, 11, 12, 3, 30, 0, 0),
            imgProfile: 'empty'
        };
        const response = yield supertest_1.default(app_1.app)
            .post('/user/signup')
            .send(bodyRequest);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(message, 'INVALID_ROLE_USER');
        assert_1.equal(response.status, 404);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb, undefined);
    }));
});
