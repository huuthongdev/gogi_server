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
const user_model_1 = require("../models/user.model");
const my_error_model_1 = require("../models/my-error.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = require("bcryptjs");
// Helpers
const validateEmail_1 = require("../helpers/validateEmail");
const checkObjectId_1 = require("../helpers/checkObjectId");
const jwt_1 = require("../helpers/jwt");
const secrectKey = '120sadjaoczxklcj0912asidjdasijsadadszx12312';
class UserServices {
    static signUp(email, phone, plainPassword, role, name, address, birthday, imgProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check data request
            if (!email)
                throw new my_error_model_1.MyError('EMAIL_MUST_BE_PROVIDED', 404);
            if (validateEmail_1.validateEmail(email) === false)
                throw new my_error_model_1.MyError('WRONG_EMAIL_FORMAT', 404);
            if (!plainPassword)
                throw new my_error_model_1.MyError('PASSWORD_MUST_BE_PROVIDED', 404);
            if (plainPassword.length < 7)
                throw new my_error_model_1.MyError('PASSWORD_LENGTH_MUST_BE_MORE_THAN_SEVEN_CHARACTERS', 404);
            if (!role)
                throw new my_error_model_1.MyError('ROLE_MUST_BE_PROVIDED', 404);
            var checkRole = false;
            const roleArr = ['Client', 'Staff', 'Marketing'];
            for (let i = 0; i < roleArr.length; i++) {
                if (roleArr[i] === role)
                    checkRole = true;
            }
            ;
            if (checkRole === false)
                throw new my_error_model_1.MyError('INVALID_ROLE_USER', 404);
            // Actions
            const password = yield bcryptjs_1.hash(plainPassword, 8);
            const profile = {
                name, address, birthday, imgProfile
            };
            const user = new user_model_1.User({ email, phone, password, role, profile });
            yield user.save();
            const userInfo = user.toObject();
            userInfo.tokenVerify = jsonwebtoken_1.default.sign({ _id: user._id }, secrectKey, { expiresIn: '7 days' });
            delete userInfo.password;
            return userInfo;
        });
    }
    static signUpAdmin(secrectKeyAdmin, email, plainPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check Secrect key
            if (secrectKeyAdmin !== '120sadjaoczxklcj0912asidjdasijsadadszx12312')
                throw new my_error_model_1.MyError('ACCESS_IS_DENIDED', 400);
            // Check data request
            if (!email)
                throw new my_error_model_1.MyError('EMAIL_MUST_BE_PROVIDED', 404);
            if (validateEmail_1.validateEmail(email) === false)
                throw new my_error_model_1.MyError('WRONG_EMAIL_FORMAT', 404);
            if (!plainPassword)
                throw new my_error_model_1.MyError('PASSWORD_MUST_BE_PROVIDED', 404);
            if (plainPassword.length < 7)
                throw new my_error_model_1.MyError('PASSWORD_LENGTH_MUST_BE_MORE_THAN_SEVEN_CHARACTERS', 404);
            // Actions
            const password = yield bcryptjs_1.hash(plainPassword, 8);
            const user = new user_model_1.User({ email, password, role: 'Admin' });
            yield user.save();
            const userInfo = user.toObject();
            userInfo.tokenVerify = jsonwebtoken_1.default.sign({ _id: user._id }, secrectKey, { expiresIn: '7 days' });
            delete userInfo.password;
            return userInfo;
        });
    }
    static verifyUser(tokenVerify) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tokenVerify)
                throw new my_error_model_1.MyError('TOKEN_VERIFY_MUST_BE_PROVIDED', 404);
            return jsonwebtoken_1.default.verify(tokenVerify, secrectKey, (error, obj) => __awaiter(this, void 0, void 0, function* () {
                if (error)
                    throw new my_error_model_1.MyError('INVALID_TOKEN', 400);
                const user = yield user_model_1.User.findOneAndUpdate({ _id: obj._id, isActive: false }, { isActive: true }, { new: true });
                if (!user)
                    throw new my_error_model_1.MyError('INVALID_TOKEN_VERIFY', 400);
                const userInfo = user.toObject();
                delete userInfo.password;
                return userInfo;
            }));
        });
    }
    static login(infoLogin, plainPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!infoLogin)
                throw new my_error_model_1.MyError('ID_LOGIN_MUST_BE_PROVIDED', 404);
            if (!plainPassword)
                throw new my_error_model_1.MyError('PASSWORD_MUST_BE_PROVIDED', 404);
            let user;
            if (validateEmail_1.validateEmail(infoLogin) === true) {
                // Login with email
                user = yield user_model_1.User.findOne({ email: infoLogin });
            }
            else if (validateEmail_1.validateEmail(infoLogin) === false) {
                // Login with phone
                user = yield user_model_1.User.findOne({ phone: infoLogin });
            }
            ;
            if (!user)
                throw new my_error_model_1.MyError('USER_NOT_EXISTED', 400);
            if (user.isActive === false)
                throw new my_error_model_1.MyError('USER_NOT_ACTIVE', 404);
            const same = yield bcryptjs_1.compare(plainPassword, user.password);
            if (!same)
                throw new my_error_model_1.MyError('ID_OR_PASSWORD_INCORRECT', 404);
            const userInfo = user.toObject();
            delete userInfo.password;
            userInfo.token = yield jwt_1.sign({ _id: user._id });
            return userInfo;
        });
    }
    static changeRole(_id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check info request
            checkObjectId_1.checkObjectId(_id);
            if (!role)
                throw new my_error_model_1.MyError('ROLE_MUST_BE_PROVIDED', 404);
            var checkRole = false;
            const roleArr = ['Client', 'Staff', 'Marketing'];
            for (let i = 0; i < roleArr.length; i++) {
                if (roleArr[i] === role)
                    checkRole = true;
            }
            ;
            if (checkRole === false)
                throw new my_error_model_1.MyError('INVALID_ROLE_USER', 404);
            // Actions
            const user = yield user_model_1.User.findByIdAndUpdate(_id, { role }, { new: true });
            if (!user)
                throw new my_error_model_1.MyError('USER_NOT_EXISTED', 404);
            const userInfo = user.toObject();
            delete userInfo.password;
            return userInfo;
        });
    }
    static forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                throw new my_error_model_1.MyError('EMAIL_MUST_BE_PROVIDED', 404);
            if (validateEmail_1.validateEmail(email) === false)
                throw new my_error_model_1.MyError('WRONG_EMAIL_FORMAT', 404);
            const user = yield user_model_1.User.findOne({ email });
            if (!user)
                throw new my_error_model_1.MyError('USER_NOT_EXISTED', 404);
            if (user.isActive === false)
                throw new my_error_model_1.MyError('USER_NOT_ACTIVE', 404);
            const tokenResetPass = yield jwt_1.signForgotPassword({ _id: user._id });
            return tokenResetPass;
        });
    }
    static changePasswordForgot(tokenResetPass, plainPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!plainPassword)
                throw new my_error_model_1.MyError('PASSWORD_MUST_BE_PROVIDED', 404);
            if (plainPassword.length < 7)
                throw new my_error_model_1.MyError('PASSWORD_LENGTH_MUST_BE_MORE_THAN_SEVEN_CHARACTERS', 404);
            const obj = yield jwt_1.verify(tokenResetPass);
            const password = yield bcryptjs_1.hash(plainPassword, 8);
            const user = yield user_model_1.User.findByIdAndUpdate(obj._id, { password }, { new: true });
            if (!user)
                throw new my_error_model_1.MyError('USER_NOT_EXISTED', 404);
            const userInfo = user.toObject();
            delete userInfo.password;
            return userInfo;
        });
    }
    static editProfile(idUser, name, address, birthday, imgProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            checkObjectId_1.checkObjectId(idUser);
            const profile = {
                name, address, birthday, imgProfile
            };
            const user = yield user_model_1.User.findByIdAndUpdate(idUser, { profile }, { new: true });
            if (!user)
                throw new my_error_model_1.MyError('USER_NOT_EXISTED', 400);
            const userInfo = user.toObject();
            delete userInfo.password;
            return userInfo;
        });
    }
}
exports.UserServices = UserServices;
