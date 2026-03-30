# API Integration Examples

This document shows how various APIs are integrated into the application components.

---

## 1. **ProductDetails Component - Reviews API**

### API Methods Used:
- `reviewsAPI.getByProduct(productId)` - Fetch reviews for a product
- `reviewsAPI.create(productId, review, rating)` - Submit a new review

### Integration Pattern:

```typescript
// Fetch reviews on component mount
useEffect(() => {
  const response = await reviewsAPI.getByProduct(id);
  setReviews(response.data || []);
}, [id]);

// Submit new review
const handleSubmitReview = async (e) => {
  e.preventDefault();
  
  // Call API to create review
  await reviewsAPI.create(product._id, reviewText, reviewRating);
  
  // Refresh reviews list
  const response = await reviewsAPI.getByProduct(product._id);
  setReviews(response.data || []);
  
  // Clear form and show feedback
  setReviewText('');
  setReviewRating(5);
  toast.success('Review posted successfully!');
};
```

### Display Reviews:

```typescript
{reviews.map(review => (
  <div key={review._id} className="p-4 border rounded">
    <div className="flex justify-between">
      <span className="font-bold">{review.user?.name}</span>
      <span className="text-yellow-500">★ {review.rating}</span>
    </div>
    <p className="text-gray-600 mt-2">{review.review}</p>
    <p className="text-sm text-gray-400 mt-2">
      {new Date(review.createdAt).toLocaleDateString()}
    </p>
  </div>
))}
```

### Key Points:
✅ Reviews require authentication (checked before form display)
✅ Form only shows if user is logged in
✅ List refreshes after each submission
✅ Star ratings displayed with review content
✅ Real-time feedback via toast notifications

---

## 2. **Checkout Component - Addresses API**

### API Methods Used:
- `addressesAPI.getAll()` - Fetch all saved addresses for user
- `addressesAPI.add(addressData)` - Save a new address

### Integration Pattern:

#### Fetch Saved Addresses on Mount:

```typescript
useEffect(() => {
  const fetchAddresses = async () => {
    try {
      const response = await addressesAPI.getAll();
      setSavedAddresses(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedAddressId(response.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  if (token) {
    fetchAddresses();
  }
}, [token]);
```

#### Display Saved Addresses:

```typescript
{savedAddresses.length > 0 && !showAddressForm && (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4">Saved Addresses</h3>
    <div className="space-y-3">
      {savedAddresses.map((address) => (
        <label key={address._id} className="flex items-start gap-3 p-4 border rounded-lg">
          <input
            type="radio"
            name="savedAddress"
            checked={selectedAddressId === address._id}
            onChange={() => handleAddressSelect(address._id)}
          />
          <div>
            <p className="font-bold">{address.name}</p>
            <p className="text-sm text-gray-600">{address.details}, {address.city}</p>
            <p className="text-sm text-gray-600">Phone: {address.phone}</p>
          </div>
        </label>
      ))}
    </div>
    <button onClick={() => setShowAddressForm(true)}>
      + Add New Address
    </button>
  </div>
)}
```

#### Add New Address:

```typescript
const handleAddNewAddress = async () => {
  try {
    // Validate form fields
    if (!orderData.address || !orderData.city || !orderData.phone) {
      toast.error('Please fill in address details');
      return;
    }
    
    // Prepare address data
    const newAddress = {
      name: `${orderData.firstName} ${orderData.lastName}`,
      details: orderData.address,
      phone: orderData.phone,
      city: orderData.city,
      postalCode: orderData.zipCode,
    };
    
    // Call API to save address
    await addressesAPI.add(newAddress);
    toast.success('Address added successfully');
    
    // Refresh addresses list
    const response = await addressesAPI.getAll();
    setSavedAddresses(response.data || []);
    setShowAddressForm(false);
    setSelectedAddressId(response.data[response.data.length - 1]._id);
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to add address');
  }
};
```

### Key Points:
✅ Addresses fetched on component mount
✅ First saved address selected by default
✅ Radio buttons for address selection
✅ Users can add new address inline
✅ List refreshes after adding new address
✅ Requires authentication (token check)

---

## 3. **Checkout Component - Coupons Integration**

### API Methods Used:
- `couponsAPI.applyCoupon(couponCode)` - Validate and apply coupon

### Integration Pattern:

#### Apply Coupon:

```typescript
const handleApplyCoupon = async () => {
  try {
    // Validate input
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    
    // Call API to validate coupon
    const response = await couponsAPI.applyCoupon(couponCode);
    
    // Store coupon data
    setAppliedCoupon({
      code: couponCode.toUpperCase(),
      discount: response.data?.discount || 0,
    });
    
    // Show success feedback
    toast.success(`Coupon applied! ${response.data?.discount || 0}% discount`);
    setCouponCode('');
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Invalid coupon code');
  } finally {
    setIsApplyingCoupon(false);
  }
};
```

#### Display Coupon Input:

```typescript
{!appliedCoupon ? (
  <div className="flex gap-2">
    <input
      type="text"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
      placeholder="Enter coupon code"
      className="flex-1 px-3 py-2 border rounded-lg"
    />
    <button
      onClick={handleApplyCoupon}
      disabled={isApplyingCoupon}
    >
      {isApplyingCoupon ? 'Applying...' : 'Apply'}
    </button>
  </div>
) : (
  <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
    <div>
      <p className="font-bold">{appliedCoupon.code}</p>
      <p className="text-sm">{appliedCoupon.discount}% discount applied</p>
    </div>
    <button onClick={handleRemoveCoupon}>Remove</button>
  </div>
)}
```

#### Update Price Calculation:

```typescript
// Calculate discount amount
const discountAmount = appliedCoupon 
  ? ((totalPrice || 0) * (appliedCoupon.discount / 100)) 
  : 0;

// Final total with discount
const subtotal = (totalPrice || 0);
const tax = subtotal * 0.1;
const total = subtotal + tax - discountAmount;
```

#### Display in Order Summary:

```typescript
{appliedCoupon && (
  <div className="flex justify-between">
    <span className="text-gray-600">Discount ({appliedCoupon.discount}%)</span>
    <span className="text-green-600 font-bold">-${discountAmount.toFixed(2)}</span>
  </div>
)}
```

### Key Points:
✅ Real-time coupon validation
✅ Shows discount percentage and applied code
✅ Can remove coupon to recalculate
✅ Discount immediately reflects in order total
✅ Visual feedback for applied coupon
✅ Error handling for invalid codes

---

## 4. **Checkout Component - Orders API**

### API Methods Used:
- `ordersAPI.createOrder(cartId, shippingAddress)` - Create new order

### Integration Pattern:

```typescript
const handlePaymentSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    setIsLoading(true);
    
    // Prepare shipping address
    const shippingAddress = {
      details: orderData.address,
      phone: orderData.phone,
      city: orderData.city,
      postalCode: orderData.zipCode,
    };

    // Call API to create order
    await ordersAPI.createOrder('dummy-cart-id', shippingAddress);
    
    // Clear cart after successful order
    await clearCart();
    
    // Show success message
    toast.success('Order placed successfully!');
    
    // Move to confirmation step
    setStep('confirmation');
    
    // Redirect to orders page after 3 seconds
    setTimeout(() => navigate('/orders'), 3000);
  } catch (error: any) {
    toast.error(error.message || 'Failed to place order');
  } finally {
    setIsLoading(false);
  }
};
```

### Key Points:
✅ Validates form before order creation
✅ Sends shipping address with order
✅ Clears cart on successful order
✅ Shows confirmation page before redirect
✅ Auto-redirects to orders after 3 seconds
✅ Error handling with user feedback

---

## 5. **Home Component - Cart Context (Internal API)**

### Methods Used:
- `useCart()` - Access cart operations
- `addToCart(productId)` - Add product to cart
- `updateCartItem(productId, count)` - Update quantity
- `removeFromCart(productId)` - Remove from cart

### Integration Pattern:

```typescript
const { cart, addToCart, removeFromCart } = useCart();

const handleAddToCart = async (product: Product) => {
  const { token } = useAuth();
  
  // Check if user is logged in
  if (!token) {
    toast.error('Please login to add items to cart');
    navigate('/login');
    return;
  }
  
  try {
    // Add to cart
    await addToCart(product._id || product.id);
    toast.success(`${product.name} added to cart`);
  } catch (error: any) {
    toast.error(error.message || 'Failed to add to cart');
  }
};
```

### Key Points:
✅ Requires authentication check
✅ Real-time cart update
✅ Toast feedback for user
✅ Error handling
✅ Persists across navigation via context

---

## 6. **Orders Component - Orders API**

### API Methods Used:
- `ordersAPI.getOrders()` - Fetch user's order history

### Integration Pattern:

```typescript
useEffect(() => {
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await ordersAPI.getOrders();
      setOrders(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  if (token) {
    fetchOrders();
  }
}, [token]);
```

### Display Orders:

```typescript
{orders.map(order => (
  <div key={order._id} className="p-4 border rounded-lg cursor-pointer"
       onClick={() => setSelectedOrder(order)}>
    <div className="flex justify-between">
      <span className="font-bold">Order #{order._id}</span>
      <span className={order.isPaid ? 'text-green-600' : 'text-red-600'}>
        {order.isPaid ? '✓ Paid' : '✗ Pending'}
      </span>
    </div>
    <p className="text-sm text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
    <p className="text-sm font-bold mt-2">Total: ${order.totalOrderPrice}</p>
  </div>
))}

{selectedOrder && (
  <div className="p-6 bg-gray-50 rounded-lg">
    <h3 className="text-lg font-bold mb-4">Order Details</h3>
    {/* Display shipping, items, status */}
  </div>
)}
```

### Key Points:
✅ Fetches on component mount
✅ Shows order status (paid/pending, delivered/pending)
✅ Click to view full order details
✅ Displays shipping address and items
✅ Real-time order status tracking

---

## Summary of API Usage Patterns

| Component | API | Method | Purpose |
|-----------|-----|--------|---------|
| ProductDetails | Reviews | getByProduct, create | Display and submit reviews |
| Checkout | Addresses | getAll, add | Manage shipping addresses |
| Checkout | Coupons | applyCoupon | Apply discount codes |
| Checkout | Orders | createOrder | Place orders |
| Cart | Cart (Context) | addToCart, removeFromCart | Manage cart items |
| Orders | Orders | getOrders | Fetch order history |

## Authentication Notes

All APIs require authentication token:
- Token stored in localStorage as `userToken`
- Token automatically included in headers via `fetchAPI` wrapper in api.ts
- Components check `token` from useAuth() before operations
- Unauthorized requests return 401 error

## Best Practices Applied

✅ **Error Handling**: Try-catch blocks with user-friendly toast messages
✅ **Loading States**: Disabled buttons and loading indicators during async operations
✅ **Validation**: Form validation before API calls
✅ **State Management**: Context API for shared state (Cart, Auth, Wishlist)
✅ **Data Refresh**: Refetch lists after mutations (add/delete operations)
✅ **User Feedback**: Toast notifications for success/error states
✅ **Type Safety**: TypeScript interfaces for API responses
