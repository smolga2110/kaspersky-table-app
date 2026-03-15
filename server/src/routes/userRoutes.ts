import { Router } from "express";
import { addUser, deleteUser, getData } from "../controllers/userController";

const router = Router()

router.get("/", getData)
router.post("/", addUser)
router.delete("/:id", deleteUser)

export default router