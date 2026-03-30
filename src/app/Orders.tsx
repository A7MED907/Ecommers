import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { AlertCircle, Package, ChevronRight } from 'lucide-react';

interface Order {
  _id: string;
  id?: string;
  totalOrderPrice?: number;
  totalPrice?: number;
  paymentMethodType?: string;
  isPaid?: boolean;
  isDelivered?: boolean;
  createdAt?: string;
  cartItems?: any[];
  shippingAddress?: {
    details: string;
    city: string;
    postalCode: string;
  };
}

export default function OrderHistory() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;

      try {
        setIsLoading(true);
        const response = await ordersAPI.getOrders();
        setOrders(response.data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
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
            You need to login to view your orders
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto mb-4 text-gray-400" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Orders Yet
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Start shopping!
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id || order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-white rounded-lg shadow p-6 cursor-pointer border-2 transition ${
                    selectedOrder?._id === order._id
                      ? 'border-blue-600'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Order {order._id?.slice(-8) || order.id?.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : 'Date unavailable'}
                      </p>
                    </div>
                    <ChevronRight
                      className={`transition ${
                        selectedOrder?._id === order._id ? 'rotate-90' : ''
                      }`}
                      size={24}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        Total: <span className="font-semibold text-gray-900">
                          ${(order.totalOrderPrice || order.totalPrice || 0).toFixed(2)}
                        </span>
                      </p>
                      <div className="flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          order.isPaid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          order.isDelivered
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {order.isDelivered ? 'Delivered' : 'Processing'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Order Details
                </h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-mono text-sm">
                      {selectedOrder._id || selectedOrder.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">
                      {selectedOrder.createdAt
                        ? new Date(selectedOrder.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p className={`font-medium ${
                      selectedOrder.isPaid ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {selectedOrder.isPaid ? 'Paid' : 'Pending'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Delivery Status</p>
                    <p className={`font-medium ${
                      selectedOrder.isDelivered ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {selectedOrder.isDelivered ? 'Delivered' : 'In Transit'}
                    </p>
                  </div>

                  {selectedOrder.shippingAddress && (
                    <div>
                      <p className="text-sm text-gray-600">Shipping Address</p>
                      <p className="text-sm font-medium">
                        {selectedOrder.shippingAddress.details}
                      </p>
                      <p className="text-sm font-medium">
                        {selectedOrder.shippingAddress.city} {selectedOrder.shippingAddress.postalCode}
                      </p>
                    </div>
                  )}
                </div>

                {/* Items */}
                {selectedOrder.cartItems && selectedOrder.cartItems.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedOrder.cartItems.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.product?.title || item.title} x {item.quantity || item.count}
                          </span>
                          <span className="font-medium">
                            ${(item.price || 0).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total Amount</span>
                    <span className="font-bold text-blue-600 text-lg">
                      ${(selectedOrder.totalOrderPrice || selectedOrder.totalPrice || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/')}
                  className="w-full mt-6 border border-gray-300 hover:border-gray-400 text-gray-900 font-medium py-2 rounded-lg transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
                <p>Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
