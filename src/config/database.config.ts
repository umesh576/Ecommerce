import mongoose from "mongoose";

export const connectDatabase = (url: string) => {
  mongoose
    .connect(url)
    .then(() => console.log("Database connected"))
    .catch((err: any) => console.log("db connection err", err));
};
