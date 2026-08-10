import type { loginCredentials } from "../types";
import { api } from "./client";

//authService

export const login = (credetials: loginCredentials) =>
  api.post("/auth/login", credetials);

export const self = () => api.get("/auth/self");

export const logout = () => api.post("/auth/logout");
