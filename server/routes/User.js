import express from "express";
import { fetchUsers, saveUser, handleLogin } from "../controllers/User.js";

const router = express();

router.get("/", fetchUsers);
router.post("/", saveUser);
router.post("/login", handleLogin);

export default router;
