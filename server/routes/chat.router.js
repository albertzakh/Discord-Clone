import express from "express";
import { GetMessages, MessageAdd } from "../controller/chat.controller.js";

const router = express.Router();

router.post(`/message/:id`, MessageAdd);
router.get(`/:id`, GetMessages);


export default router;