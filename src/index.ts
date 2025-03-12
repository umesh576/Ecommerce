import "dotenv/config";
// import "./@types/express"
import express, { NextFunction, Request, Response } from "express";
import { connectDatabase } from "./config/database.config";
import path from "path";
import CustomError from "./middleware/errorhandler.middleware";

// importing routes
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import reviewRoutes from "./routes/review.routes";
import cartRoutes from "./routes/cart.routes";
import orderRouter from "./routes/order.routes";

import wishlist from "./routes/wshlist.routes";

const app = express();
const PORT = process.env.PORT || 8000;
const DB_URI = process.env.DB_URI || "";

connectDatabase(DB_URI);

// using middlewares
app.use(express.urlencoded({ extended: false }));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// serving static files
app.use("/api/uploads", express.static(path.join(__dirname, "../", "uploads")));

console.log("👊 ~ index.ts:23 ~ __dirname:", __dirname);

// using routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlist);
app.use("/api/order", orderRouter);

// handle not found path
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const message = `can not ${req.method} on ${req.originalUrl}`;

  const error = new CustomError(message, 404);
  next(error);
});

// error handler

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message || "Something went wrong";

  res.status(statusCode).json({
    status,
    success: false,
    message,
  });
});

app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);
