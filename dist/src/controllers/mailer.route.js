"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mailer_services_1 = require("../services/mailer.services");
// import { mustBeUse } from "./mustBeUse.middleware";
exports.mailerRouter = express_1.Router();
exports.mailerRouter.get('/', (req, res) => {
    mailer_services_1.mailer('huuthong.mgd@gmail.com', 'test', '<h1>Test h1</h1>')
        .then(info => res.send({ success: true, info }))
        .catch(res.onError);
});
