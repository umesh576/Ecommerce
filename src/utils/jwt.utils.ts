import jwt, { JwtPayload } from "jsonwebtoken";
import { IPayload } from "../@types/global.types";

const JWT_SECRET = process.env.JWT_SECRET || "";
const TOKEN_EXPIRES_IN = process.env.JWT_TOKEN_EXPIRES_IN || "1d";

export function generateToken(payload: IPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRES_IN as string,
  });
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
