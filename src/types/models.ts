// ================ Type Definitions ================

export interface Product {
  _id: string;
  id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  sold: number;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images: string[];
  category: Category;
  subcategories?: Subcategory[];
  brand?: Brand;
  ratingsAverage: number;
  ratingsQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface CartItem {
  product: Product;
  count: number;
  price: number;
}

export interface WishlistItem {
  _id: string;
  product: Product;
}

export interface ApiResponse<T> {
  results?: number;
  metadata?: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
  };
  data: T;
  message?: string;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  brand?: string;
  keyword?: string;
  [key: string]: string | number | undefined;
}
