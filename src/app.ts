import express from 'express';
import { json } from 'body-parser';
import { userRouter } from './controllers/user.route';

export const app = express();

app.use(json());
app.use((req: any, res: any, next) => {
    res.onError = function (error: any) {
        if (!error.statusCode) console.log(error.message);
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    };
    next();
});

app.use('/user', userRouter);
