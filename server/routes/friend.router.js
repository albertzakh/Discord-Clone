import express from "express";
import User from "../models/user.model.js";
import { AcceptedFriends, PendingFriends, PendingAdd, PendingRemove, FriendAccept, SingleFriend } from "../controller/friend.router.js";

const router = express.Router();

router.get("/accepted-all", AcceptedFriends);
router.get("/pending-all", PendingFriends);
router.patch("/add", PendingAdd);
router.patch("/remove", PendingRemove)
router.patch("/accept", FriendAccept); 
router.get("/:id", SingleFriend);


export default router;