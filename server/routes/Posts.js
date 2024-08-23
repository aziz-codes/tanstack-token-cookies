import express from "express";
import { getPosts, savePosts } from "../controllers/Post.js";
const router = express();

router.get("/", getPosts);
router.post("/", savePosts);

export default router;
