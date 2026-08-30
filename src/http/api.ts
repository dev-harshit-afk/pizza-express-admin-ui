import type { CreateUser, loginCredentials } from "../types";
import { api } from "./client";

//authService

export const login = (credetials: loginCredentials) =>
  api.post("/auth/login", credetials);

export const self = () => api.get("/auth/self");

export const logout = () => api.post("/auth/logout");

export const getUsers = (userQueryString: string) =>
  api.get(`/users?${userQueryString}`);

export const getTenants = () => api.get("/tenants");

export const createUser = (user: CreateUser) => api.post("/users", user);

export const updateUser=(user:CreateUser,id:string)=>api.patch(`/users/${id}`,user);