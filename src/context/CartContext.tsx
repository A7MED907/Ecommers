// ================ Cart Context ================

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface CartItem {
  _id?: string;
  id?: string;
  productId: string;
  name: string;
  price: number;
  count: number;
  image?: string;
  total?: number;
}

interface CartContextType {
  cart: CartItem[];
  totalPrice: number;
  isLoading: boolean;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartItem: (productId: string, count: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  // ================ Fetch Cart ================
  const fetchCart = async () => {
    if (!token) {
      setCart([]);
      setTotalPrice(0);
      return;
    }

    try {
      setIsLoading(true);
      const response = await cartAPI.getCart();
      const cartData = response.data || {};
      
      if (cartData.products && Array.isArray(cartData.products)) {
        setCart(cartData.products);
        setTotalPrice(cartData.totalCartPrice || 0);
      } else {
        setCart([]);
        setTotalPrice(0);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
      setTotalPrice(0);
    } finally {
      setIsLoading(false);
    }
  };

  // ================ Load Cart on Auth Change ================
  useEffect(() => {
    fetchCart();
  }, [token]);

  // ================ Add to Cart ================
  const addToCart = async (productId: string) => {
    if (!token) {
      throw new Error('Please login to add items to cart');
    }

    try {
      await cartAPI.addToCart(productId);
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  // ================ Remove from Cart ================
  const removeFromCart = async (productId: string) => {
    if (!token) {
      throw new Error('Please login to manage cart');
    }

    try {
      await cartAPI.removeFromCart(productId);
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  // ================ Update Cart Item ================
  const updateCartItem = async (productId: string, count: number) => {
    if (!token) {
      throw new Error('Please login to update cart');
    }

    if (count <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      await cartAPI.updateCartItem(productId, count);
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  // ================ Clear Cart ================
  const clearCart = async () => {
    if (!token) {
      throw new Error('Please login to manage cart');
    }

    try {
      await cartAPI.clearCart();
      setCart([]);
      setTotalPrice(0);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  // ================ Get Cart Item Count ================
  const getCartItemCount = (): number => {
    return cart.reduce((total: number, item: CartItem) => total + item.count, 0);
  };

  const refreshCart = fetchCart;

  return (
    <CartContext.Provider 
      value={{ 
        cart,
        totalPrice,
        isLoading,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        refreshCart,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
