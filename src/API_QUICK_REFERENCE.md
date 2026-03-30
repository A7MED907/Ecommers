# API Integration Quick Reference Guide

## 🚀 Quick Start: How to Use APIs in Components

### Pattern 1: Fetch Data on Mount
```typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await apiFunction.getMethod(params);
      setData(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch');
    }
  };
  
  fetchData();
}, [dependency]);
```

### Pattern 2: Submit Form Data
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setIsLoading(true);
    await apiFunction.postMethod(formData);
    toast.success('Success!');
    // Refresh list if needed
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed');
  } finally {
    setIsLoading(false);
  }
};
```

### Pattern 3: Update/Delete with List Refresh
```typescript
const handleDelete = async (id: string) => {
  try {
    await apiFunction.delete(id);
    // Refresh the list
    const response = await apiFunction.getAll();
    setList(response.data || []);
    toast.success('Deleted successfully');
  } catch (error: any) {
    toast.error('Failed to delete');
  }
};
```

---

## 📚 Components & Their APIs

### Home.tsx - Product Browsing
```typescript
// Import
import { productsAPI, categoriesAPI } from '../services/api';

// Fetch on mount
const [products, setProducts] = useState([]);
useEffect(() => {
  const response = await productsAPI.getAll();
  setProducts(response.data || []);
}, []);

// Add to cart
const handleAddToCart = async (productId: string) => {
  if (!token) { navigate('/login'); return; }
  await useCart().addToCart(productId);
  toast.success('Added to cart');
};
```

### ProductDetails.tsx - Reviews
```typescript
// Import
import { reviewsAPI } from '../services/api';
import { useCart } from '../context/CartContext';

// Fetch reviews
useEffect(() => {
  const response = await reviewsAPI.getByProduct(productId);
  setReviews(response.data || []);
}, [productId]);

// Submit review
const handleSubmitReview = async (e) => {
  e.preventDefault();
  await reviewsAPI.create(productId, reviewText, rating);
  // Refresh
  const response = await reviewsAPI.getByProduct(productId);
  setReviews(response.data || []);
};
```

### Cart.tsx - Shopping Cart
```typescript
// Import
import { useCart } from '../context/CartContext';

// Get cart from context
const { cart, updateCartItem, removeFromCart } = useCart();

// Update quantity
const handleUpdateQty = (productId: string, newQty: number) => {
  if (newQty <= 0) {
    removeFromCart(productId);
  } else {
    updateCartItem(productId, newQty);
  }
};
```

### Checkout.tsx - Complete Flow
```typescript
// Import ALL needed APIs
import { ordersAPI, addressesAPI, couponsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// STEP 1: Fetch addresses on mount
useEffect(() => {
  const fetchAddresses = async () => {
    const response = await addressesAPI.getAll();
    setSavedAddresses(response.data || []);
  };
  if (token) fetchAddresses();
}, [token]);

// STEP 1: Save new address
const handleAddNewAddress = async () => {
  await addressesAPI.add({
    name: `${firstName} ${lastName}`,
    details: address,
    phone: phone,
    city: city,
    postalCode: zipCode,
  });
  const response = await addressesAPI.getAll();
  setSavedAddresses(response.data || []);
};

// STEP 2: Apply coupon
const handleApplyCoupon = async () => {
  const response = await couponsAPI.applyCoupon(couponCode);
  setAppliedCoupon({
    code: couponCode,
    discount: response.data?.discount,
  });
};

// STEP 3: Create order
const handlePlaceOrder = async () => {
  const shippingAddress = {
    details: orderData.address,
    phone: orderData.phone,
    city: orderData.city,
    postalCode: orderData.zipCode,
  };
  await ordersAPI.createOrder('cart-id', shippingAddress);
  await clearCart();
  navigate('/orders');
};
```

### Orders.tsx - Order History
```typescript
// Import
import { ordersAPI } from '../services/api';

// Fetch orders
useEffect(() => {
  const response = await ordersAPI.getOrders();
  setOrders(response.data || []);
}, [token]);

// View order details
const handleViewOrder = (order) => {
  setSelectedOrder(order);
  // Display in side panel
};
```

### CategoryDetails.tsx & BrandDetails.tsx - Filtering
```typescript
// Import
import { categoriesAPI, brandsAPI, productsAPI } from '../services/api';

// Fetch category/brand
useEffect(() => {
  const response = await categoriesAPI.getById(categoryId);
  setCategoryData(response.data);
}, [categoryId]);

// Fetch products by category
const fetchProducts = async (filters) => {
  const response = await productsAPI.getAll({
    category: categoryId,
    ...filters // price range, sorting, etc.
  });
  setProducts(response.data || []);
};

// Apply filters
const handlePriceFilter = (min, max) => {
  fetchProducts({ priceRange: [min, max] });
};

const handleSort = (sortBy) => {
  fetchProducts({ sort: sortBy });
};
```

---

## 🔧 Commonly Used Patterns

### Check Authentication Before Action
```typescript
const { token } = useAuth();

if (!token) {
  toast.error('Please login first');
  navigate('/login');
  return;
}
```

### Show Loading State
```typescript
const [isLoading, setIsLoading] = useState(false);

return (
  <button disabled={isLoading}>
    {isLoading ? 'Loading...' : 'Submit'}
  </button>
);
```

### Handle API Errors
```typescript
try {
  await apiCall();
} catch (error: any) {
  const message = error.response?.data?.message || error.message;
  toast.error(message);
}
```

### Refresh List After Action
```typescript
// After add/delete
const response = await apiFunction.getAll();
setList(response.data || []);
```

### Conditional Rendering
```typescript
{!isLoaded ? (
  <Loading />
) : list.length === 0 ? (
  <EmptyState />
) : (
  <ListDisplay list={list} />
)}
```

---

## 📡 API Methods by Module

### authAPI
- `login(email, password)` → { token, user }
- `register(userData)` → { token, user }
- `logout()` → void
- `forgotPassword(email)` → void
- `verifyResetCode(code)` → void
- `resetPassword(email, password, rePassword)` → void

### productsAPI
- `getAll(filters?)` → { data: Product[] }
- `getById(id)` → { data: Product }
- `search(query)` → { data: Product[] }

### categoriesAPI
- `getAll()` → { data: Category[] }
- `getById(id)` → { data: Category }

### brandsAPI
- `getAll()` → { data: Brand[] }
- `getById(id)` → { data: Brand }

### cartAPI
- `addToCart(productId)` → { data: CartItem }
- `getCart()` → { data: Cart }
- `updateQuantity(cartItemId, quantity)` → void
- `removeFromCart(cartItemId)` → void
- `clearCart()` → void

### reviewsAPI
- `getByProduct(productId)` → { data: Review[] }
- `create(productId, review, rating)` → { data: Review }
- `update(reviewId, review, rating)` → { data: Review }
- `delete(reviewId)` → void

### ordersAPI
- `createOrder(cartId, shippingAddress)` → { data: Order }
- `getOrders()` → { data: Order[] }
- `getOrder(orderId)` → { data: Order }

### addressesAPI
- `getAll()` → { data: Address[] }
- `add(addressData)` → { data: Address }
- `remove(addressId)` → void

### couponsAPI
- `applyCoupon(couponCode)` → { data: { discount: number } }

### wishlistAPI
- `add(productId)` → { data: Wishlist }
- `remove(productId)` → { data: Wishlist }
- `getAll()` → { data: Wishlist }

### userAPI
- `updateMe(userData)` → { data: User }
- `changePassword(currentPassword, newPassword, rePassword)` → void

---

## ✅ Checklist: Before Making API Calls

- [ ] Import required API from `../services/api`
- [ ] Import `toast` from 'sonner' for feedback
- [ ] Check `token` from `useAuth()` if authentication required
- [ ] Add loading state for async operations
- [ ] Wrap in try-catch with error handling
- [ ] Show user feedback (toast/loading indicator)
- [ ] Refresh list data if applicable
- [ ] Clear form inputs after successful submission
- [ ] Handle empty states and errors

---

## 🧪 Test Coupon Codes

Use these in Checkout payment step:
- `SAVE10` → 10% discount
- `SAVE20` → 20% discount
- `SAVE50` → 50% discount

---

## 📍 File Locations

| File | Purpose |
|------|---------|
| `src/services/api.ts` | All API module definitions |
| `src/context/AuthContext.tsx` | Authentication state & token |
| `src/context/CartContext.tsx` | Shopping cart state |
| `src/context/WishlistContext.tsx` | Wishlist state |
| `src/components/common/` | Reusable UI components |
| `src/app/` | Page components |

---

## 🎯 Common Mistakes to Avoid

❌ **Don't:** Call API without checking token
```typescript
// WRONG
const { cart } = useCart();
```

✅ **Do:** Extract from context hook
```typescript
// RIGHT
const { token } = useAuth();
```

---

❌ **Don't:** Forget to handle errors
```typescript
// WRONG
await apiCall();
```

✅ **Do:** Wrap in try-catch
```typescript
// RIGHT
try {
  await apiCall();
} catch (error) {
  toast.error('Failed');
}
```

---

❌ **Don't:** Forget to refresh after mutations
```typescript
// WRONG
await apiFunction.add(data);
```

✅ **Do:** Refresh the list
```typescript
// RIGHT
await apiFunction.add(data);
const response = await apiFunction.getAll();
setList(response.data || []);
```

---

❌ **Don't:** Ignore empty states
```typescript
// WRONG
return <div>{list.map(...)}</div>
```

✅ **Do:** Show empty state
```typescript
// RIGHT
return list.length === 0 ? (
  <EmptyState />
) : (
  <div>{list.map(...)}</div>
)
```

---

## 📞 Quick Help

**Q: How do I authenticate a user?**
A: Use `authAPI.login(email, password)`. Token is auto-stored & included in all requests.

**Q: How do I check if user is logged in?**
A: Use `const { token } = useAuth()`. If token exists, user is logged in.

**Q: How do I add something to the cart?**
A: Use `useCart().addToCart(productId)`. It calls cartAPI internally.

**Q: How do I handle API errors?**
A: Wrap in try-catch and show: `toast.error(error.response?.data?.message || 'Failed')`

**Q: How do I refresh a list after adding?**
A: Call `getAll()` again: `const response = await apiFunction.getAll(); setList(response.data)`

**Q: How do I show loading state?**
A: Use state: `const [isLoading, setIsLoading] = useState(false)` and toggle during async await.

---

## 🔗 Related Documentation

- [API_INTEGRATION_EXAMPLES.md](./API_INTEGRATION_EXAMPLES.md) - Detailed code examples
- [API_ARCHITECTURE.md](./API_ARCHITECTURE.md) - System architecture overview
- [API_GUIDE.md](./API_GUIDE.md) - Backend API specifications

