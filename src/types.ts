export type loginCredentials = {
  email: string;
  password: string;
};

export type Tenant = {
  name: string;
  address: string;
  id: number;
};
export type CreateTenant = {
  name: string;
  address: string;
};

export type CreateUser = {
  firstName: string;
  email: string;
  lastName: string;
  password?: string;
  role: string;
  tenantId: number;
};

export type FieldData = {
  name: string[];
  value?: string;
};

//need update it , currently it is temp
export type Category = {
  name: string;
  _id: string;
  attributes: {
    name: string;
    widgetType: string;
    defaultValue: string;
  }[];
  priceConfiguration: {
    name: string;
    defaultValue: number;
  };
};

export type Product = {
  name: string;
  _id: string;
  category: Category;
  description: string;
  isPublish: boolean;
  price: number;
  imageUrl: string;
  createdAt: string;
};
