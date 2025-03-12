import { IPayload } from "./global.types";

declare global {
  namespace Express {
    interface Request {
      user: IPayload;
    }
  }
}
