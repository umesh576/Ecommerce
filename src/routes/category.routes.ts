import express from "express";
import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controller/category.controller";
import { onlyAdmin } from "../@types/global.types";
import { Authenticate } from "../middleware/authentication.middleware";

const router = express.Router();

// private routes

// create category
router.post("/", Authenticate(onlyAdmin), create);

// update category
router.put("/:id", Authenticate(onlyAdmin), update);

// delete category
router.delete("/:id", Authenticate(onlyAdmin), remove);

// public routes

// get all category
router.get("/", getAll);
// get category by id
router.get("/:id", getById);

export default router;
