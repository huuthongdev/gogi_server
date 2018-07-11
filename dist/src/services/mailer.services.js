"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const validateEmail_1 = require("../helpers/validateEmail");
const my_error_model_1 = require("../models/my-error.model");
function mailer(to, subject, html) {
    return new Promise((resolve, reject) => {
        if (validateEmail_1.validateEmail(to) === false)
            return reject(new my_error_model_1.MyError('WRONG_EMAIL_FORMAT', 404));
        if (!subject)
            return reject(new my_error_model_1.MyError('SUBJECT_MUST_BE_PROVIDED', 404));
        if (!html)
            return reject(new my_error_model_1.MyError('HTML_MUST_BE_PROVIDED', 404));
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'huuthong.mgd@gmail.com',
                pass: 'nkdzbqagxcqznacq' // generated ethereal password
            }
        });
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Gogi" <huuthong.mgd@gmail.com>',
            to: to,
            subject,
            html: html // html body
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error)
                return reject(new my_error_model_1.MyError(error.message, 404));
            resolve(info);
        });
    });
}
exports.mailer = mailer;
