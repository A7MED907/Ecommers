// ================ Wishlist Context ================

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { wishlistAPI } from '../services/api';
import type { Product } from '../types/models';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Product[];
  wishlistIds: Set<string>;
  isLoading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  // ================ Fetch Wishlist ================
  const fetchWishlist = async () => {
    if (!token) {
      setWishlist([]);
      setWishlistIds(new Set());
      return;
    }

    try {
      setIsLoading(true);
      const response = await wishlistAPI.getWishlist();
      const products = response.data || [];
      setWishlist(products);
      setWishlistIds(new Set(products.map(p => p._id || p.id)));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist([]);
      setWishlistIds(new Set());
    } finally {
      setIsLoading(false);
    }
  };

  // ================ Load Wishlist on Auth Change ================
  useEffect(() => {
    fetchWishlist();
  }, [token]);

  // ================ Add to Wishlist ================
  const addToWishlist = async (productId: string) => {
    if (!token) {
      throw new Error('Please login to add items to wishlist');
    }

    try {
      await wishlistAPI.addToWishlist(productId);
      await fetchWishlist();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  // ================ Remove from Wishlist ================
  const removeFromWishlist = async (productId: string) => {
    if (!token) {
      throw new Error('Please login to manage wishlist');
    }

    try {
      await wishlistAPI.removeFromWishlist(productId);
      await fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };

  // ================ Check if Product is in Wishlist ================
  const isInWishlist = (productId: string): boolean => {
    return wishlistIds.has(productId);
  };

  const refreshWishlist = fetchWishlist;

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlist, 
        wishlistIds, 
        isLoading, 
        addToWishlist, 
        removeFromWishlist, 
        isInWishlist,
        refreshWishlist 
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
