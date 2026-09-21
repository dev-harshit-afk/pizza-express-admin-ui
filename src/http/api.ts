import type { CreateTenant, CreateUser, loginCredentials } from "../types";
import { api } from "./client";

//authService

const authService = "/api/auth";
const catalogService = "/api/catalog";

export const login = (credetials: loginCredentials) =>
  api.post(`${authService}/auth/login`, credetials);

export const self = () => api.get(`${authService}/auth/self`);

export const logout = () => api.post(`${authService}/auth/logout`);

export const getUsers = (userQueryString: string) =>
  api.get(`${authService}/users?${userQueryString}`);

export const getTenants = (tenantQueryString: string) =>
  api.get(`${authService}/tenants?${tenantQueryString}`);

export const createUser = (user: CreateUser) =>
  api.post(`${authService}/users`, user);

export const updateUser = (user: CreateUser, id: string) =>
  api.patch(`${authService}/users/${id}`, user);

export const createTenant = (tenant: CreateTenant) =>
  api.post(`${authService}/tenants`, tenant);

export const updateTenant = (tenant: CreateTenant, id: string) =>
  api.patch(`${authService}/tenants/${id}`, tenant);

export const getCategories = (categoryQueryString: string) =>
  api.get(`${catalogService}/categories?${categoryQueryString}`);

export const getProducts = (productQueryString: string) =>
  api.get(`${catalogService}/products?${productQueryString}`);
