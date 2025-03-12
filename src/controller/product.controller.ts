import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import Product from "../model/product.model";
import CustomError from "../middleware/errorhandler.middleware";
import { deleteFiles } from "../utils/deleteFiles";
import Category from "../model/category.model";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const product = await Product.create(body);
  const { coverImage, images } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  if (!coverImage) {
    throw new CustomError("Cover image is required", 400);
  }

  product.coverImage = coverImage[0]?.path;

  if (images && images.length > 0) {
    const imagePath: string[] = images.map(
      (image: any, index: number) => image.path
    );
    product.images = imagePath;
  }

  await product.save();

  res.status(201).json({
    status: "success",
    success: true,
    data: product,
    message: "Product created successfully!",
  });
});

// update product

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { deletedImages, name, description, price, categoryId } = req.body;
  const id = req.params.id;
  const { coverImage, images } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const product = await Product.findByIdAndUpdate(
    id,
    { name, description, price },
    { new: true }
  );

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  if (categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new CustomError("Category not found", 404);
    }

    product.category = categoryId;
  }

  if (coverImage) {
    await deleteFiles([product.coverImage as string]);
    product.coverImage = coverImage[0]?.path;
  }

  if (deletedImages && deletedImages.length > 0) {
    await deleteFiles(deletedImages as string[]);
    product.images = product.images.filter(
      (image) => !deletedImages.includes(image)
    );
  }

  if (images && images.length > 0) {
    const imagePath: string[] = images.map(
      (image: any, index: number) => image.path
    );
    product.images = [...product.images, ...imagePath];
  }

  await product.save();

  res.status(201).json({
    status: "success",
    success: true,
    data: product,
    message: "Product updated successfully!",
  });
});

// delete product

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const product = await Product.findById(id);

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  if (product.images && product.images.length > 0) {
    await deleteFiles(product.images as string[]);
  }

  await Product.findByIdAndDelete(product._id);

  res.status(201).json({
    status: "success",
    success: true,
    data: product,
    message: "Product deleted successfully!",
  });
});

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find({}).populate("createdBy");

  res.status(200).json({
    success: true,
    status: "success",
    data: products,
    message: "Products fetched successfully!",
  });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate("createdBy");

  res.status(200).json({
    success: true,
    status: "success",
    data: product,
    message: "Product fetched successfully!",
  });
});
