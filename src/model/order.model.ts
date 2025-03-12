import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      default: () => `ORD -${uuidv4().split("-")[0]}`,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "cancelled", "delivered", "processing"],
      default: "pending",
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Order = model("order", orderSchema);

export default Order;
