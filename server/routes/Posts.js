import express from "express";
import { getPosts, savePosts,likePost} from "../controllers/Post.js";
const router = express();

router.get("/", getPosts);
router.post("/", savePosts);

router.put("/:id/like", likePost); 

export default router;
