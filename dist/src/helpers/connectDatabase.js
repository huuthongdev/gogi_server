"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function getDatabaseUri() {
    if (process.env.NODE_ENV === 'production')
        return '';
    if (process.env.NODE_ENV === 'test')
        return 'mongodb://localhost/test';
    return 'mongodb://localhost/gogi_mongo';
}
mongoose_1.default.connect(getDatabaseUri())
    .then(() => console.log('Database connected'))
    .catch(error => {
    console.log(error.message);
    process.exit(1);
});
