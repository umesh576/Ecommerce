import express from "express";
import { placeOrder } from "../controller/order.controller";
import { Authenticate } from "../middleware/authentication.middleware";

import { onlyUser } from "../@types/global.types";

const router = express.Router();

router.post("/", Authenticate(onlyUser), placeOrder);

export default router;
