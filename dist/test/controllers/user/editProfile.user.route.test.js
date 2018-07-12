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
describe('User - Edit Profile | POST /user/edit', () => {
    let token, idUser;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        // Sign up a new User
        const user = yield user_services_1.UserServices.signUp('huuthong.mgd@gmail.com', '0908508136', 'Huuthong123', 'Staff', 'huuthong', '76/6 tbg', new Date(1996, 11, 12, 3, 30, 0, 0), 'empty');
        const tokenVerify = user.tokenVerify;
        idUser = user._id;
        // Verify user
        yield user_services_1.UserServices.verifyUser(tokenVerify);
        // Login user
        const userLogin = yield user_services_1.UserServices.login('0908508136', 'Huuthong123');
        token = userLogin.token;
    }));
    it('Can edit profile', () => __awaiter(this, void 0, void 0, function* () {
        const bodyRequest = {
            name: 'thong_updated',
            address: 'address_updated',
            birthday: new Date(2018, 11, 12, 3, 30, 0, 0),
            imgProfile: 'imgProfile_updated'
        };
        const response = yield supertest_1.default(app_1.app)
            .post('/user/edit')
            .set({ token })
            .send(bodyRequest);
        const { success, user, message } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(user.profile.name, 'thong_updated');
        assert_1.equal(user.profile.address, 'address_updated');
        assert_1.equal(user.profile.imgProfile, 'imgProfile_updated');
        assert_1.equal(new Date(user.profile.birthday.toString()), new Date(2018, 11, 12, 3, 30, 0, 0).toString());
        // Check user inside database 
        const userDb = yield user_model_1.User.findOne({});
        assert_1.equal(userDb._id, user._id);
        assert_1.equal(userDb.profile.name, 'thong_updated');
        assert_1.equal(userDb.profile.address, 'address_updated');
        assert_1.equal(userDb.profile.imgProfile, 'imgProfile_updated');
        assert_1.equal(new Date(userDb.profile.birthday.toString()), new Date(2018, 11, 12, 3, 30, 0, 0).toString());
        assert_1.equal(userDb.email, 'huuthong.mgd@gmail.com');
        assert_1.equal(userDb.phone, '0908508136');
        assert_1.equal(userDb.isActive, true);
    }));
});
