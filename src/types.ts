export type loginCredentials = {
  email: string;
  password: string;
};

export type Tenant = {
  name: string;
  address: string;
  id: number;
};

export type CreateUser = {
  firstName: string;
  email: string;
  lastName: string;
  password: string;
  role: string;
  tenantId: number;
};
