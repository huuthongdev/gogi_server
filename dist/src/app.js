"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const user_route_1 = require("./controllers/user.route");
const mailer_route_1 = require("./controllers/mailer.route");
exports.app = express_1.default();
exports.app.use(body_parser_1.json());
exports.app.use((req, res, next) => {
    res.onError = function (error) {
        if (!error.statusCode)
            console.log(error.message);
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    };
    next();
});
exports.app.use('/user', user_route_1.userRouter);
exports.app.use('/mailer', mailer_route_1.mailerRouter);
