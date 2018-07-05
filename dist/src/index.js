"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./helpers/connectDatabase");
const app_1 = require("./app");
app_1.app.listen(process.env.PORT || 4000, () => {
    if (process.env.PORT)
        console.log('Server started | Production');
    else
        console.log('Server started: http://localhost:4000');
});
