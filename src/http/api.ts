import type { loginCredentials } from "../types";
import { api } from "./client";

//authService

export const login = (credetials: loginCredentials) =>
  api.post("/auth/login", credetials);
