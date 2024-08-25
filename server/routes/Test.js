import express from 'express';
import { get, sent } from '../controllers/Test.js';

const router = express();


router.post("/",sent)
router.get("/",get)

export default router;