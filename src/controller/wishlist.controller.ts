import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import CustomError from "../middleware/errorhandler.middleware";
import Product from "../model/product.model";
import User from "../model/user.model";
import mongoose from "mongoose";

//add to wishlist

export const addToWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.productID;

    const user = req.user;

    if (!productId) {
      throw new CustomError("Product Id is required", 404);
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new CustomError("Product not found", 404);
    }

    const userDocument = await User.findById(user._id);

    if (!userDocument) {
      throw new CustomError("user not found", 404);
    }

    //if product exists already in watchlist

    if (
      userDocument.wishList.some(
        (item: mongoose.Types.ObjectId) => item.toString() === productId
      )
    ) {
      throw new CustomError("Product already in wishlist", 400);
    }

    userDocument.wishList.push(new mongoose.Types.ObjectId(productId));

    await userDocument.save();

    res.status(201).json({
      status: "success",
      success: true,
      message: "Product added to wishlist successfully!",
      data: userDocument.wishList,
    });
  }
);

// Remove product from wisilist

export const removeFromWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.id;
    const user = req.user;

    if (!productId) {
      throw new CustomError("Product Id is required", 400);
    }

    const userDocument = await User.findById(user._id);

    if (!userDocument) {
      throw new CustomError("User not found", 404);
    }

    // Check if product exists in wishlist

    if (
      !userDocument.wishList.some(
        (item: mongoose.Types.ObjectId) => item.toString() === productId
      )
    ) {
      throw new CustomError("Product not in wishlist", 404);
    }

    // Remove product from wishlist

    userDocument.wishList = userDocument.wishList.filter(
      (item: mongoose.Types.ObjectId) => item.toString() !== productId
    );

    await userDocument.save();

    res.status(200).json({
      status: "success",
      success: true,
      message: "Product removed from wishlist successfully!",
    });
  }
);

// Get user's wishlist

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  const userDocument = await User.findById(user._id).populate("wishList");

  if (!userDocument) {
    throw new CustomError("User not found", 404);
  }

  res.status(200).json({
    status: "success",
    success: true,
    data: userDocument,
    message: "Wishlist fetched successfully!",
  });
});

// Clear entire wishlist

export const clearWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    const userDocument = await User.findById(user._id);

    if (!userDocument) {
      throw new CustomError("User not found", 404);
    }

    userDocument.wishList = [];
    await userDocument.save();

    res.status(200).json({
      status: "success",
      success: true,
      message: "Wishlist cleared successfully!",
    });
  }
);
