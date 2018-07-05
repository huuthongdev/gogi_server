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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const my_error_model_1 = require("../models/my-error.model");
const user_model_1 = require("../models/user.model");
const secrectKey = '120sadjaoczxklcj0912asidjdasijsadadszx12312';
function sign(obj) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(obj, secrectKey, { expiresIn: '2 days' }, (error, token) => {
            if (error)
                return reject(error);
            resolve(token);
        });
    });
}
exports.sign = sign;
function verify(token) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secrectKey, (error, obj) => __awaiter(this, void 0, void 0, function* () {
            if (error)
                return reject(new my_error_model_1.MyError('INVALID_TOKEN', 400));
            const user = yield user_model_1.User.findById(obj._id);
            if (!user)
                return reject(new my_error_model_1.MyError('USER_NOT_EXISTED', 400));
            delete obj.iat;
            delete obj.exp;
            resolve(obj);
        }));
    });
}
exports.verify = verify;
function verifyAdmin(token) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secrectKey, (error, obj) => __awaiter(this, void 0, void 0, function* () {
            if (error)
                return reject(new my_error_model_1.MyError('INVALID_TOKEN', 400));
            const user = yield user_model_1.User.findById(obj._id);
            if (!user)
                return reject(new my_error_model_1.MyError('USER_NOT_EXISTED', 400));
            if (user.role !== 'Admin')
                return reject(new my_error_model_1.MyError('ACCESS_IS_DENIDED', 400));
            delete obj.iat;
            delete obj.exp;
            resolve(obj);
        }));
    });
}
exports.verifyAdmin = verifyAdmin;
