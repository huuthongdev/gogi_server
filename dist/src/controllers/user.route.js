"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_services_1 = require("../services/user.services");
const mustBeUse_middleware_1 = require("./mustBeUse.middleware");
exports.userRouter = express_1.Router();
exports.userRouter.post('/signup', (req, res) => {
    const { email, phone, plainPassword, role, name, address, birthday, imgProfile } = req.body;
    user_services_1.UserServices.signUp(email, phone, plainPassword, role, name, address, birthday, imgProfile)
        .then(user => res.send({ success: true, user }))
        .catch(res.onError);
});
exports.userRouter.get('/verify/:token', (req, res) => {
    user_services_1.UserServices.verifyUser(req.params.token)
        .then(user => res.send({ success: true, user }))
        .catch(res.onError);
});
exports.userRouter.post('/login', (req, res) => {
    const { infoLogin, plainPassword } = req.body;
    user_services_1.UserServices.login(infoLogin, plainPassword)
        .then(user => res.send({ success: true, user }))
        .catch(res.onError);
});
exports.userRouter.post('/role/:_id', mustBeUse_middleware_1.mustBeUseAdmin, (req, res) => {
    const { role } = req.body;
    user_services_1.UserServices.changeRole(req.params._id, role)
        .then(user => res.send({ success: true, user }))
        .catch(res.onError);
});
exports.userRouter.get('/signup/admin/:secrectKeyAdmin/:email/:plainPassword', (req, res) => {
    const { secrectKeyAdmin, email, plainPassword } = req.params;
    user_services_1.UserServices.signUpAdmin(secrectKeyAdmin, email, plainPassword)
        .then(user => res.send({ success: true, user }))
        .catch(res.onError);
});
exports.userRouter.post('/forgotpassword', (req, res) => {
    const { email } = req.body;
    user_services_1.UserServices.forgotPassword(email)
        .then(tokenReset => res.send({ success: true, tokenReset }))
        .catch(res.onError);
});
exports.userRouter.post('/forgotpassword/changepass', (req, res) => {
    const { tokenReset, plainPassword } = req.body;
    user_services_1.UserServices.changePasswordForgot(tokenReset, plainPassword)
        .then(user => res.send({ success: true, user }))
        .catch(res.onError);
});
exports.userRouter.post('/edit', mustBeUse_middleware_1.mustBeUse, (req, res) => {
    const { phone, name, address, birthday, imgProfile } = req.body;
    user_services_1.UserServices.editProfile(req.idUser, name, address, birthday, imgProfile)
        .then(user => res.send({ success: true, user }))
        .catch(res.onError);
});
