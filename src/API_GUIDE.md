# API Integration Guide

## 🌐 Base URL
```
https://ecommerce.routemisr.com/api/v1
```

---

## 📋 Endpoints Reference

### 🛍️ Products

#### Get All Products
```typescript
GET /products?page=1&limit=12

// Example usage in code:
const response = await productsAPI.getAll({ page: 1, limit: 12 });
```

**Query Parameters:**
- `page` (number) - Page number for pagination
- `limit` (number) - Number of items per page
- `category` (string) - Filter by category ID
- `keyword` (string) - Search products by keyword
- `sort` (string) - Sort order

**Response:**
```json
{
  "results": 12,
  "metadata": {
    "currentPage": 1,
    "numberOfPages": 5,
    "limit": 12
  },
  "data": [
    {
      "_id": "product_id",
      "title": "Product Name",
      "price": 99.99,
      "priceAfterDiscount": 79.99,
      "imageCover": "image_url",
      "images": ["url1", "url2"],
      "category": { ... },
      "brand": { ... },
      "ratingsAverage": 4.5,
      "ratingsQuantity": 150,
      "quantity": 100,
      "sold": 50
    }
  ]
}
```

#### Get Product by ID
```typescript
GET /products/:id

// Example:
const response = await productsAPI.getById('product_id');
```

---

### 📂 Categories

#### Get All Categories
```typescript
GET /categories

// Example:
const response = await categoriesAPI.getAll();
```

**Response:**
```json
{
  "results": 10,
  "data": [
    {
      "_id": "category_id",
      "name": "Electronics",
      "slug": "electronics",
      "image": "image_url"
    }
  ]
}
```

---

### 🏷️ Brands

#### Get All Brands
```typescript
GET /brands?page=1&limit=20

// Example:
const response = await brandsAPI.getAll({ page: 1, limit: 20 });
```

---

### 🔐 Authentication

#### Register
```typescript
POST /auth/signup

// Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "rePassword": "password123",
  "phone": "+1234567890"
}

// Example:
await authAPI.register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  rePassword: "password123",
  phone: "+1234567890"
});
```

**Response:**
```json
{
  "message": "success",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

#### Login
```typescript
POST /auth/signin

// Body:
{
  "email": "john@example.com",
  "password": "password123"
}

// Example:
await authAPI.login({
  email: "john@example.com",
  password: "password123"
});
```

#### Verify Token
```typescript
GET /auth/verify-token

// Headers:
{
  "token": "your_jwt_token"
}

// Example:
await authAPI.verifyToken();
```

---

### ❤️ Wishlist

**Note:** All wishlist endpoints require authentication (token in headers)

#### Get Wishlist
```typescript
GET /wishlist

// Headers:
{
  "token": "your_jwt_token"
}

// Example:
const response = await wishlistAPI.getWishlist();
```

**Response:**
```json
{
  "status": "success",
  "count": 3,
  "data": [
    {
      "_id": "product_id",
      "title": "Product Name",
      // ... full product data
    }
  ]
}
```

#### Add to Wishlist
```typescript
POST /wishlist

// Headers:
{
  "token": "your_jwt_token"
}

// Body:
{
  "productId": "product_id"
}

// Example:
await wishlistAPI.addToWishlist('product_id');
```

**Response:**
```json
{
  "status": "success",
  "message": "Product added successfully to your wishlist",
  "data": ["product_id_1", "product_id_2"]
}
```

#### Remove from Wishlist
```typescript
DELETE /wishlist/:productId

// Headers:
{
  "token": "your_jwt_token"
}

// Example:
await wishlistAPI.removeFromWishlist('product_id');
```

---

### 🛒 Cart

**Note:** All cart endpoints require authentication

#### Get Cart
```typescript
GET /cart

// Example:
const response = await cartAPI.getCart();
```

#### Add to Cart
```typescript
POST /cart

// Body:
{
  "productId": "product_id"
}

// Example:
await cartAPI.addToCart('product_id');
```

#### Update Cart Item
```typescript
PUT /cart/:productId

// Body:
{
  "count": 3
}

// Example:
await cartAPI.updateCartItem('product_id', 3);
```

#### Remove from Cart
```typescript
DELETE /cart/:productId

// Example:
await cartAPI.removeFromCart('product_id');
```

#### Clear Cart
```typescript
DELETE /cart

// Example:
await cartAPI.clearCart();
```

---

## 🔧 How It Works in the App

### 1. **Automatic Token Management**

The API service automatically handles tokens:

```typescript
// In services/api.ts
const token = localStorage.getItem('userToken');

if (token) {
  headers['token'] = token;
}
```

### 2. **Error Handling**

All API calls have built-in error handling:

```typescript
try {
  const response = await productsAPI.getAll();
  setProducts(response.data);
} catch (error) {
  setError(error.message);
}
```

### 3. **Type Safety**

All responses are typed:

```typescript
const response: ApiResponse<Product[]> = await productsAPI.getAll();
```

---

## 📝 Usage Examples

### Example 1: Search Products
```typescript
const searchProducts = async (keyword: string) => {
  const response = await productsAPI.getAll({
    keyword,
    page: 1,
    limit: 20
  });
  return response.data;
};
```

### Example 2: Filter by Category
```typescript
const getProductsByCategory = async (categoryId: string) => {
  const response = await productsAPI.getAll({
    category: categoryId,
    page: 1,
    limit: 12
  });
  return response.data;
};
```

### Example 3: Complete Auth Flow
```typescript
// Register
const user = await authAPI.register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  rePassword: "password123",
  phone: "+1234567890"
});

// Token is automatically stored
localStorage.setItem('userToken', user.token);

// Now can access protected endpoints
const wishlist = await wishlistAPI.getWishlist();
```

### Example 4: Manage Wishlist
```typescript
// Add to wishlist
await wishlistAPI.addToWishlist('product_id');

// Get updated wishlist
const { data } = await wishlistAPI.getWishlist();

// Remove from wishlist
await wishlistAPI.removeFromWishlist('product_id');
```

---

## 🚨 Common Issues & Solutions

### Issue: "Unauthorized" Error
**Solution:** Ensure you're logged in and token is in localStorage
```typescript
const token = localStorage.getItem('userToken');
console.log('Token:', token);
```

### Issue: Products Not Loading
**Solution:** Check network connection and API status
```typescript
try {
  const response = await productsAPI.getAll();
  console.log('Products loaded:', response.data.length);
} catch (error) {
  console.error('API Error:', error);
}
```

### Issue: Wishlist Not Updating
**Solution:** Ensure user is authenticated
```typescript
const { token } = useAuth();
if (!token) {
  console.error('User not logged in');
  return;
}
```

---

## 📊 Response Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Server Error

---

## 💡 Best Practices

### 1. Always Handle Errors
```typescript
try {
  const data = await productsAPI.getAll();
  // Handle success
} catch (error) {
  // Handle error
  toast.error(error.message);
}
```

### 2. Use Loading States
```typescript
const [isLoading, setIsLoading] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  try {
    const data = await productsAPI.getAll();
    setProducts(data);
  } finally {
    setIsLoading(false);
  }
};
```

### 3. Implement Retry Logic
```typescript
const retry = async (fn: Function, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
};
```

### 4. Cache Responses When Appropriate
```typescript
const [cachedCategories, setCachedCategories] = useState(null);

const getCategories = async () => {
  if (cachedCategories) return cachedCategories;
  
  const response = await categoriesAPI.getAll();
  setCachedCategories(response.data);
  return response.data;
};
```

---

## 🔗 Additional Resources

- API Base URL: `https://ecommerce.routemisr.com/api/v1`
- Service File: `/services/api.ts`
- Type Definitions: `/types/models.ts`
- Usage Examples: Check components in `/app/` directory

---

**Last Updated:** March 30, 2026
