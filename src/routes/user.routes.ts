import express from "express";
import { register, update, login, getAll } from "../controller/usercontroller";
import { Authenticate } from "../middleware/authentication.middleware";
import { onlyAdmin } from "../@types/global.types";

const router = express.Router();

// register user
router.post("/", register);

// get all users
router.get("/", Authenticate(onlyAdmin), getAll);

// update user profile
router.put("/:id", Authenticate(), update);

// login
router.post("/login", login);

export default router;
