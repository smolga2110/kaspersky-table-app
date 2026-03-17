import { Router } from "express";
import { addUser, deleteUser, getData } from "../controllers/userController";

const router = Router()

router.get("/", getData)
router.post("/", addUser)
router.post("/delete", deleteUser)

export default router