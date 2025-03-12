import express, { Router } from "express";
import { create, getAll, update } from "../controller/review.controller";
import { Authenticate } from "../middleware/authentication.middleware";
import { onlyAdmin, onlyUser } from "../@types/global.types";

const router: Router = express.Router();

// create review
router.post("/", Authenticate(onlyUser), create);

router.put("/:id", Authenticate(onlyUser), update);

// get all reviews
router.get("/", Authenticate(onlyAdmin), getAll);
router.get("/:productId", getAll);

export default router;
