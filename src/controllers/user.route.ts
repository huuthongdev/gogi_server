import { Router } from "express";
import { UserServices } from "../services/user.services";
import { mustBeUseAdmin } from "./mustBeUse.middleware";

export const userRouter = Router();

userRouter.post('/signup', (req, res: any) => {
    const { email, phone, plainPassword, role, name, address, birthday, imgProfile } = req.body;
    UserServices.signUp(email, phone, plainPassword, role, name, address, birthday, imgProfile)
        .then(user => res.send({ success: true, user }))
        .catch(res.onError);
});

userRouter.get('/verify/:token', (req, res: any) => {
    UserServices.verifyUser(req.params.token)
        .then(user => res.send({ success: true, user }))
        .catch(res.onError);
});

userRouter.post('/login', (req, res: any) => {
    const { infoLogin, plainPassword } = req.body;
    UserServices.login(infoLogin, plainPassword)
        .then(user => res.send({ success: true, user }))
        .catch(res.onError);
});

userRouter.post('/role/:_id', mustBeUseAdmin, (req, res: any) => {
    const { role } = req.body;
    UserServices.changeRole(req.params._id, role)
        .then(user => res.send({ success: true, user }))
        .catch(res.onError);
});

userRouter.get('/signup/admin/:secrectKeyAdmin/:email/:plainPassword', (req, res: any) => {
    const { secrectKeyAdmin, email, plainPassword } = req.params;
    UserServices.signUpAdmin(secrectKeyAdmin, email, plainPassword)
        .then(user => res.send({ success: true, user }))
        .catch(res.onError);
});