import express from "express";
import { getPosts, savePosts,handleReactPost} from "../controllers/Post.js";
const router = express();

router.get("/", getPosts);
router.post("/", savePosts);

router.put("/:id/like", handleReactPost); 

export default router;
