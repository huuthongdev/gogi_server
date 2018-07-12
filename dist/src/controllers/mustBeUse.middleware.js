"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../helpers/jwt");
function mustBeUse(req, res, next) {
    jwt_1.verify(req.headers.token)
        .then((user) => {
        req.idUser = user._id;
        next();
    })
        .catch(res.onError);
}
exports.mustBeUse = mustBeUse;
;
function mustBeUseAdmin(req, res, next) {
    jwt_1.verifyAdmin(req.headers.token)
        .then((user) => {
        req.idUser = user._id;
        next();
    })
        .catch(res.onError);
}
exports.mustBeUseAdmin = mustBeUseAdmin;
;
function mustBeUseStaff(req, res, next) {
    jwt_1.verifyStaff(req.headers.token)
        .then((user) => {
        req.idUser = user._id;
        next();
    })
        .catch(res.onError);
}
exports.mustBeUseStaff = mustBeUseStaff;
;
