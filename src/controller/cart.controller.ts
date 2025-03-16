import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import CustomError from "../middleware/errorhandler.middleware";
import { Cart } from "../model/cart.model";
import Product from "../model/product.model";
import { getPagination } from "../utils/pagenation.utils";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { userId, productId, quantity } = req.body;
  let cart;
  console.log(userId);
  if (!userId) {
    throw new CustomError("userId is required", 400);
  }

  if (!productId) {
    throw new CustomError("productId is required", 400);
  }

  cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError("product not found", 404);
  }

  const existingProduct = cart.items.find(
    (item) => item.product.toString() === productId
  );
  if (existingProduct) {
    existingProduct.quantity += quantity;

    cart.items.push(existingProduct);
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();

  res.status(201).json({
    status: "success",
    success: true,
    message: "Product added to cart",
  });
});

export const getCartByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, page } = req.query;

    const currentPage = parseInt(page as string) || 1;
    const queryLimit = parseInt(limit as string) || 10;
    const skip = (currentPage - 1) * queryLimit;

    const userId = req.params.id;

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price description",
    });

    if (!cart) {
      throw new CustomError("Cart not found", 404);
    }

    const totalCount = cart.items.length;

    const paginatedItems = cart.items.slice(skip, skip + queryLimit);

    const paginatedCart = {
      ...cart.toObject(),
      items: paginatedItems,
    };

    const pagination = getPagination(currentPage, queryLimit, totalCount);

    // Send the response with the paginated cart
    res.status(200).json({
      status: "success",
      success: true,
      message: "Cart fetched successfully",
      data: {
        data: paginatedCart, // Paginated cart data
        pagination, // Pagination metadata
      },
    });
  }
);

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new CustomError("Cart does not created yet.", 400);
  }

  await Cart.findOneAndDelete({ user: userId });

  res.status(200).json({
    status: "success",
    success: true,
    message: "Cart cleared successfully",
    data: null,
  });
});

export const removeItemFromCart = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.productId;
    const userId = req.user._id;
    if (!productId) {
      throw new CustomError("productId is required", 400);
    }
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new CustomError("Cart does not created yet.", 400);
    }

    cart.items.pull({ product: productId });

    const updatedCart = await cart.save();

    res.status(200).json({
      status: "success",
      success: true,
      message: "Cart updated successfully",
      data: updatedCart,
    });
  }
);
