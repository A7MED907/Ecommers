// ================ API Service ================

import type { 
  Product, 
  Category, 
  Brand, 
  AuthResponse, 
  ApiResponse, 
  QueryParams 
} from '../types/models';

const BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

// ================ Helper Functions ================

const getAuthToken = (): string | null => {
  return localStorage.getItem('userToken');
};

const buildQueryString = (params: QueryParams): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

// ================ Fetch Wrapper ================

async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['token'] = token;
  }
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP Error: ${response.status}`);
  }
  
  return response.json();
}

// ================ Products API ================

export const productsAPI = {
  getAll: (params: QueryParams = {}): Promise<ApiResponse<Product[]>> => {
    const queryString = buildQueryString(params);
    return fetchAPI<ApiResponse<Product[]>>(`/products${queryString}`);
  },
  
  getById: (id: string): Promise<ApiResponse<Product>> => {
    return fetchAPI<ApiResponse<Product>>(`/products/${id}`);
  },
  
  search: (keyword: string, params: QueryParams = {}): Promise<ApiResponse<Product[]>> => {
    const queryString = buildQueryString({ ...params, keyword });
    return fetchAPI<ApiResponse<Product[]>>(`/products${queryString}`);
  },
};

// ================ Categories API ================

export const categoriesAPI = {
  getAll: (): Promise<ApiResponse<Category[]>> => {
    return fetchAPI<ApiResponse<Category[]>>('/categories');
  },
  
  getById: (id: string): Promise<ApiResponse<Category>> => {
    return fetchAPI<ApiResponse<Category>>(`/categories/${id}`);
  },
};

// ================ Brands API ================

export const brandsAPI = {
  getAll: (params: QueryParams = {}): Promise<ApiResponse<Brand[]>> => {
    const queryString = buildQueryString(params);
    return fetchAPI<ApiResponse<Brand[]>>(`/brands${queryString}`);
  },
  
  getById: (id: string): Promise<ApiResponse<Brand>> => {
    return fetchAPI<ApiResponse<Brand>>(`/brands/${id}`);
  },
};

// ================ Auth API ================

export const authAPI = {
  register: (data: { 
    name: string; 
    email: string; 
    password: string; 
    rePassword: string;
    phone: string;
  }): Promise<AuthResponse> => {
    return fetchAPI<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  login: (data: { 
    email: string; 
    password: string; 
  }): Promise<AuthResponse> => {
    return fetchAPI<AuthResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  verifyToken: (): Promise<{ message: string }> => {
    return fetchAPI<{ message: string }>('/auth/verify-token');
  },

  forgotPassword: (email: string): Promise<{ status: string; message: string }> => {
    return fetchAPI('/auth/forgotPassword', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyResetCode: (resetCode: string): Promise<{ status: string; message: string }> => {
    return fetchAPI('/auth/verifyResetCode', {
      method: 'POST',
      body: JSON.stringify({ resetCode }),
    });
  },

  resetPassword: (email: string, newPassword: string): Promise<AuthResponse> => {
    return fetchAPI<AuthResponse>('/auth/resetPassword', {
      method: 'PUT',
      body: JSON.stringify({ email, newPassword }),
    });
  },
};

// ================ Wishlist API ================

export const wishlistAPI = {
  getWishlist: (): Promise<ApiResponse<Product[]>> => {
    return fetchAPI<ApiResponse<Product[]>>('/wishlist');
  },
  
  addToWishlist: (productId: string): Promise<{ 
    status: string; 
    message: string; 
    data: string[] 
  }> => {
    return fetchAPI('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },
  
  removeFromWishlist: (productId: string): Promise<{ 
    status: string; 
    message: string; 
    data: string[] 
  }> => {
    return fetchAPI(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  },
};

// ================ Cart API ================

export const cartAPI = {
  getCart: (): Promise<ApiResponse<any>> => {
    return fetchAPI<ApiResponse<any>>('/cart');
  },
  
  addToCart: (productId: string): Promise<any> => {
    return fetchAPI('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },
  
  updateCartItem: (productId: string, count: number): Promise<any> => {
    return fetchAPI(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ count }),
    });
  },
  
  removeFromCart: (productId: string): Promise<any> => {
    return fetchAPI(`/cart/${productId}`, {
      method: 'DELETE',
    });
  },
  
  clearCart: (): Promise<any> => {
    return fetchAPI('/cart', {
      method: 'DELETE',
    });
  },
};

// ================ Orders API ================

export const ordersAPI = {
  createOrder: (cartId: string, shippingAddress: any): Promise<any> => {
    return fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify({ cartId, shippingAddress }),
    });
  },

  getOrders: (): Promise<any> => {
    return fetchAPI('/orders');
  },

  getOrderById: (orderId: string): Promise<any> => {
    return fetchAPI(`/orders/${orderId}`);
  },

  getUserOrders: (userId: string): Promise<any> => {
    return fetchAPI(`/orders/user/${userId}`);
  },

  checkoutSession: (cartId: string, url: string, shippingAddress: any): Promise<any> => {
    return fetchAPI(`/orders/checkout-session/${cartId}?url=${url}`, {
      method: 'POST',
      body: JSON.stringify({ shippingAddress }),
    });
  },
};

// ================ SubCategories API ================

export const subCategoriesAPI = {
  getAll: (params: QueryParams = {}): Promise<ApiResponse<any[]>> => {
    const queryString = buildQueryString(params);
    return fetchAPI<ApiResponse<any[]>>(`/subcategories${queryString}`);
  },

  getById: (id: string): Promise<ApiResponse<any>> => {
    return fetchAPI<ApiResponse<any>>(`/subcategories/${id}`);
  },

  getByCategory: (categoryId: string): Promise<ApiResponse<any[]>> => {
    return fetchAPI<ApiResponse<any[]>>(`/categories/${categoryId}/subcategories`);
  },
};

// ================ Reviews API ================

export const reviewsAPI = {
  getAll: (params: QueryParams = {}): Promise<ApiResponse<any[]>> => {
    const queryString = buildQueryString(params);
    return fetchAPI<ApiResponse<any[]>>(`/reviews${queryString}`);
  },

  getById: (id: string): Promise<ApiResponse<any>> => {
    return fetchAPI<ApiResponse<any>>(`/reviews/${id}`);
  },

  getByProduct: (productId: string, params: QueryParams = {}): Promise<ApiResponse<any[]>> => {
    const queryString = buildQueryString(params);
    return fetchAPI<ApiResponse<any[]>>(`/products/${productId}/reviews${queryString}`);
  },

  create: (productId: string, review: string, rating: number): Promise<any> => {
    return fetchAPI(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ review, rating }),
    });
  },

  update: (reviewId: string, review: string, rating: number): Promise<any> => {
    return fetchAPI(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify({ review, rating }),
    });
  },

  delete: (reviewId: string): Promise<any> => {
    return fetchAPI(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  },
};

// ================ User API ================

export const userAPI = {
  getAll: (params: QueryParams = {}): Promise<ApiResponse<any[]>> => {
    const queryString = buildQueryString(params);
    return fetchAPI<ApiResponse<any[]>>(`/users${queryString}`);
  },

  updateMe: (data: { name?: string; email?: string; phone?: string }): Promise<any> => {
    return fetchAPI('/users/updateMe', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  changePassword: (currentPassword: string, password: string, rePassword: string): Promise<any> => {
    return fetchAPI('/users/changeMyPassword', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, password, rePassword }),
    });
  },
};

// ================ Addresses API ================

export const addressesAPI = {
  getAll: (): Promise<ApiResponse<any[]>> => {
    return fetchAPI<ApiResponse<any[]>>('/addresses');
  },

  getById: (id: string): Promise<ApiResponse<any>> => {
    return fetchAPI<ApiResponse<any>>(`/addresses/${id}`);
  },

  add: (address: { name: string; details: string; phone: string; city: string; postalCode?: string }): Promise<any> => {
    return fetchAPI('/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    });
  },

  remove: (id: string): Promise<any> => {
    return fetchAPI(`/addresses/${id}`, {
      method: 'DELETE',
    });
  },
};

// ================ Coupons API ================

export const couponsAPI = {
  applyCoupon: (couponName: string): Promise<any> => {
    return fetchAPI('/cart/applyCoupon', {
      method: 'PUT',
      body: JSON.stringify({ couponName }),
    });
  },
};
