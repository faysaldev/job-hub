import { Request } from "express";
import { ProtectedUser } from "./types";

export interface ProtectedRequest extends Request {
  user?: ProtectedUser;
}
