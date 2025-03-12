import express from "express";
import {
  addToWishlist,
  clearWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controller/wishlist.controller";
import { Authenticate } from "../middleware/authentication.middleware";
import { onlyUser } from "../@types/global.types";

const router = express.Router();

//add to wishlist
router.post("/", Authenticate(onlyUser), addToWishlist);

//clear wishlist
router.delete("/", Authenticate(onlyUser), clearWishlist);

//get users wishlist
router.get("/", Authenticate(onlyUser), getWishlist);

//remove product from wishlist
router.delete("/remove/:productId", Authenticate(onlyUser), removeFromWishlist);

export default router;
