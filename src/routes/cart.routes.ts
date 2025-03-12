import express from "express";
import {
  clearCart,
  create,
  getCartByUserId,
  removeItemFromCart,
} from "../controller/cart.controller";
import { Authenticate } from "../middleware/authentication.middleware";
import { onlyUser } from "../@types/global.types";

const router = express.Router();

router.post("/add", Authenticate(onlyUser), create);
router.delete("/clear", Authenticate(onlyUser), clearCart);
router.get("/:userId", Authenticate(onlyUser), getCartByUserId);
router.get("/remove/:productId", Authenticate(onlyUser), removeItemFromCart);

export default router;
