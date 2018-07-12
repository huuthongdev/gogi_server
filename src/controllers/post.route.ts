import { Router } from "express";
import { mustBeUseStaff } from "./mustBeUse.middleware";
import { PostServices } from "../services/post.services";

export const postRouter = Router();


postRouter.get('/', (req, res: any) => {
    PostServices.getAll()
    .then(posts => res.send({ success: true, posts }))
    .catch(res.onError);
});

postRouter.use(mustBeUseStaff);

postRouter.post('/', (req: any, res: any) => {
    const { title, excerpt, content, thumbnail } = req.body;
    PostServices.addNew(req.idUser, title, excerpt, content, thumbnail)
    .then(post => res.send({ success: true, post }))
    .catch(res.onError);
});
