"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mustBeUse_middleware_1 = require("./mustBeUse.middleware");
const post_services_1 = require("../services/post.services");
exports.postRouter = express_1.Router();
exports.postRouter.get('/', (req, res) => {
    post_services_1.PostServices.getAll()
        .then(posts => res.send({ success: true, posts }))
        .catch(res.onError);
});
exports.postRouter.use(mustBeUse_middleware_1.mustBeUseStaff);
exports.postRouter.post('/', (req, res) => {
    const { title, excerpt, content, thumbnail } = req.body;
    post_services_1.PostServices.addNew(req.idUser, title, excerpt, content, thumbnail)
        .then(post => res.send({ success: true, post }))
        .catch(res.onError);
});
exports.postRouter.put('/:_id', (req, res) => {
    const { title, excerpt, content, thumbnail } = req.body;
    post_services_1.PostServices.update(req.idUser, req.params._id, title, excerpt, content, thumbnail)
        .then(post => res.send({ success: true, post }))
        .catch(res.onError);
});
exports.postRouter.delete('/disable/:_id', (req, res) => {
    post_services_1.PostServices.disablePost(req.idUser, req.params._id)
        .then(post => res.send({ success: true, post }))
        .catch(res.onError);
});
exports.postRouter.delete('/:_id', (req, res) => {
    post_services_1.PostServices.remove(req.params._id)
        .then(post => res.send({ success: true, post }))
        .catch(res.onError);
});
