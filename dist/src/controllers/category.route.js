"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mustBeUse_middleware_1 = require("./mustBeUse.middleware");
const category_services_1 = require("../services/category.services");
exports.categoryRouter = express_1.Router();
exports.categoryRouter.use(mustBeUse_middleware_1.mustBeUseStaff);
exports.categoryRouter.get('/', (req, res) => {
    category_services_1.CategoryServices.getAll()
        .then(categories => res.send({ success: true, categories }))
        .catch(res.onError);
});
exports.categoryRouter.post('/', (req, res) => {
    const { name, description, thumbnail } = req.body;
    category_services_1.CategoryServices.addNew(name, description, thumbnail)
        .then(category => res.send({ success: true, category }))
        .catch(res.onError);
});
exports.categoryRouter.put('/:_id', (req, res) => {
    const { description, thumbnail } = req.body;
    category_services_1.CategoryServices.update(req.params._id, description, thumbnail)
        .then(category => res.send({ success: true, category }))
        .catch(res.onError);
});
exports.categoryRouter.delete('/:_id', (req, res) => {
    category_services_1.CategoryServices.remove(req.params._id)
        .then(category => res.send({ success: true, category }))
        .catch(res.onError);
});
exports.categoryRouter.post('/addpost', (req, res) => {
    const { idPost, idCategory } = req.body;
    category_services_1.CategoryServices.addPost(idCategory, idPost)
        .then(category => res.send({ success: true, category }))
        .catch(res.onError);
});
