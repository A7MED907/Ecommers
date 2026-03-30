import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, addressesAPI, couponsAPI } from '../services/api';
import { AlertCircle, Truck, CreditCard, CheckCircle2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function Checkout() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { cart, totalPrice, clearCart } = useCart();
  
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [isLoading, setIsLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [orderData, setOrderData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  // ================ Fetch Saved Addresses ================
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

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Please Login
          </h2>
          <p className="text-gray-600 mb-6">
            You need to login to checkout
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Cart is Empty
          </h2>
          <p className="text-gray-600 mb-6">
            Please add items to your cart before proceeding
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selected = savedAddresses.find(addr => addr._id === addressId);
    if (selected) {
      setOrderData(prev => ({
        ...prev,
        address: selected.details,
        city: selected.city,
        phone: selected.phone,
      }));
    }
  };

  const handleAddNewAddress = async () => {
    try {
      if (!orderData.address || !orderData.city || !orderData.phone) {
        toast.error('Please fill in address details');
        return;
      }
      
      const newAddress = {
        name: `${orderData.firstName} ${orderData.lastName}`,
        details: orderData.address,
        phone: orderData.phone,
        city: orderData.city,
        postalCode: orderData.zipCode,
      };
      
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

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAddressId && showAddressForm) {
      if (!orderData.firstName || !orderData.address || !orderData.city || !orderData.phone) {
        toast.error('Please fill in required fields');
        return;
      }
    } else if (!selectedAddressId) {
      toast.error('Please select or add an address');
      return;
    }

    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Create order with shipping address
      const shippingAddress = {
        details: orderData.address,
        phone: orderData.phone,
        city: orderData.city,
        postalCode: orderData.zipCode,
      };

      await ordersAPI.createOrder('dummy-cart-id', shippingAddress);
      await clearCart();
      
      toast.success('Order placed successfully!');
      setStep('confirmation');
      
      // Redirect after 3 seconds
      setTimeout(() => navigate('/orders'), 3000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  // ================ Handle Apply Coupon ================
  const handleApplyCoupon = async () => {
    try {
      if (!couponCode.trim()) {
        toast.error('Please enter a coupon code');
        return;
      }

      setIsApplyingCoupon(true);
      // In a real app, the API would validate the coupon
      // For now, we'll mock a successful response
      // const response = await couponsAPI.applyCoupon(couponCode);
      
      // Mock coupon validation - in production this would be from the backend
      const mockCouponData: any = {
        'SAVE10': { discount: 10 },
        'SAVE20': { discount: 20 },
        'SAVE50': { discount: 50 },
      };
      
      const couponUpper = couponCode.toUpperCase();
      const couponData = mockCouponData[couponUpper];
      
      if (!couponData) {
        toast.error('Invalid coupon code');
        setIsApplyingCoupon(false);
        return;
      }
      
      setAppliedCoupon({
        code: couponCode.toUpperCase(),
        discount: couponData.discount,
      });
      
      toast.success(`Coupon applied! ${couponData.discount}% discount`);
      setCouponCode('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  const tax = ((totalPrice || 0) * 0.1);
  const discountAmount = appliedCoupon ? ((totalPrice || 0) * (appliedCoupon.discount / 100)) : 0;
  const subtotal = (totalPrice || 0);
  const total = subtotal + tax - discountAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === 'shipping' || step === 'payment' || step === 'confirmation' ? 'text-blue-600' : 'text-gray-400'}`}>
            <Truck size={24} />
            <span className="font-medium">Shipping</span>
          </div>
          <div className={`h-1 flex-1 ${step === 'payment' || step === 'confirmation' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center gap-2 ${step === 'payment' || step === 'confirmation' ? 'text-blue-600' : 'text-gray-400'}`}>
            <CreditCard size={24} />
            <span className="font-medium">Payment</span>
          </div>
          <div className={`h-1 flex-1 ${step === 'confirmation' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center gap-2 ${step === 'confirmation' ? 'text-blue-600' : 'text-gray-400'}`}>
            <CheckCircle2 size={24} />
            <span className="font-medium">Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Form */}
            {step === 'shipping' && (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Shipping Address
                </h2>

                {/* Saved Addresses */}
                {savedAddresses.length > 0 && !showAddressForm && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Saved Addresses</h3>
                    <div className="space-y-3">
                      {savedAddresses.map((address) => (
                        <label key={address._id} className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer">
                          <input
                            type="radio"
                            name="savedAddress"
                            value={address._id}
                            checked={selectedAddressId === address._id}
                            onChange={() => handleAddressSelect(address._id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{address.name}</p>
                            <p className="text-sm text-gray-600">{address.details}, {address.city}</p>
                            <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(true)}
                      className="mt-4 w-full flex items-center justify-center gap-2 border border-dashed border-blue-400 text-blue-600 hover:border-blue-600 font-medium py-2 rounded-lg transition"
                    >
                      <Plus size={20} />
                      Add New Address
                    </button>
                  </div>
                )}

                {/* Add New Address Form */}
                {(showAddressForm || savedAddresses.length === 0) && (
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="mb-4 text-sm text-gray-600">
                      {showAddressForm && (
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="text-blue-600 hover:text-blue-700 underline"
                        >
                          ← Use Saved Address
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={orderData.firstName}
                          onChange={handleShippingChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={orderData.lastName}
                          onChange={handleShippingChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={orderData.email}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={orderData.phone}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={orderData.address}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={orderData.city}
                          onChange={handleShippingChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State/Province
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={orderData.state}
                          onChange={handleShippingChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={orderData.zipCode}
                          onChange={handleShippingChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={orderData.country}
                          onChange={handleShippingChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {showAddressForm && (
                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={handleAddNewAddress}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition"
                        >
                          Save Address
                        </button>
                      </div>
                    )}

                    <div className="flex gap-4 pt-6">
                      <button
                        type="button"
                        onClick={() => navigate('/cart')}
                        className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-900 font-medium py-3 rounded-lg transition"
                      >
                        Back to Cart
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Payment Form */}
            {step === 'payment' && (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Payment Method
                </h2>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border border-blue-600 rounded-lg bg-blue-50 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="credit-card"
                        checked={paymentMethod === 'credit-card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="font-medium text-gray-900">Credit Card</span>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="debit-card"
                        checked={paymentMethod === 'debit-card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="font-medium text-gray-900">Debit Card</span>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="bank-transfer"
                        checked={paymentMethod === 'bank-transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="font-medium text-gray-900">Bank Transfer</span>
                    </label>
                  </div>

                  {/* Coupon Section */}
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Apply Coupon</h3>
                    {!appliedCoupon ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon}
                          className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg transition text-sm"
                        >
                          {isApplyingCoupon ? 'Applying...' : 'Apply'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-lg">
                        <div>
                          <p className="font-medium text-green-900">{appliedCoupon.code}</p>
                          <p className="text-sm text-green-700">{appliedCoupon.discount}% discount applied</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Payment processing is handled by a secure third-party provider. 
                      Your card details are not stored on our servers.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-900 font-medium py-3 rounded-lg transition"
                    >
                      Back to Shipping
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition"
                    >
                      {isLoading ? 'Processing...' : 'Complete Order'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Confirmation */}
            {step === 'confirmation' && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <CheckCircle2 className="mx-auto mb-4 text-green-600" size={48} />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Order Placed Successfully!
                </h2>
                <p className="text-gray-600 mb-6">
                  Thank you for your purchase. You'll receive an order confirmation email shortly.
                </p>
                <button
                  onClick={() => navigate('/orders')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg"
                >
                  View Order History
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {cart.map(item => (
                  <div key={item._id || item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x {item.count}
                    </span>
                    <span className="font-medium">
                      ${(item.price! * item.count).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount ({appliedCoupon.discount}%)</span>
                    <span className="font-medium text-green-600">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-lg font-bold border-t mt-4 pt-4">
                <span>Total</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
