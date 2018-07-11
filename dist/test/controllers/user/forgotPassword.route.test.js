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
const jwt_1 = require("../../../src/helpers/jwt");
describe('User - Forgot Password | POST /user/forgotpassword', () => {
    let tokenVerify, idUser;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        // Sign up a new User
        const user = yield user_services_1.UserServices.signUp('huuthong.mgd@gmail.com', '0908508136', 'Huuthong123', 'Staff', 'huuthong', '76/6 tbg', new Date(1996, 11, 12, 3, 30, 0, 0), 'empty');
        tokenVerify = user.tokenVerify;
        idUser = user._id;
        // Verify user
        yield user_services_1.UserServices.verifyUser(tokenVerify);
    }));
    it('Can request forgot pass', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .post('/user/forgotpassword')
            .send({ email: 'huuthong.mgd@gmail.com' });
        const { success, tokenReset } = response.body;
        assert_1.equal(success, true);
        const obj = yield jwt_1.verify(tokenReset);
        assert_1.equal(obj._id, idUser);
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb._id, obj._id);
        assert_1.equal(userDb.profile.name, 'huuthong');
        assert_1.equal(userDb.profile.address, '76/6 tbg');
        assert_1.equal(userDb.profile.imgProfile, 'empty');
        assert_1.equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(userDb.email, 'huuthong.mgd@gmail.com');
        assert_1.equal(userDb.phone, '0908508136');
        assert_1.equal(userDb.isActive, true);
    }));
    it('Cannot request forgot pass without email', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .post('/user/forgotpassword')
            .send({ email: '' });
        const { success, tokenReset, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(tokenReset, undefined);
        assert_1.equal(message, 'EMAIL_MUST_BE_PROVIDED');
        assert_1.equal(response.status, 404);
    }));
    it('Cannot request forgot pass with wrong email format', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .post('/user/forgotpassword')
            .send({ email: 'huuthonggmail.com' });
        const { success, tokenReset, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(tokenReset, undefined);
        assert_1.equal(message, 'WRONG_EMAIL_FORMAT');
        assert_1.equal(response.status, 404);
    }));
    it('Cannot request forgot pass with a user not existed', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app)
            .post('/user/forgotpassword')
            .send({ email: 'huu@gmail.com' });
        const { success, tokenReset, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(tokenReset, undefined);
        assert_1.equal(message, 'USER_NOT_EXISTED');
        assert_1.equal(response.status, 404);
    }));
});
