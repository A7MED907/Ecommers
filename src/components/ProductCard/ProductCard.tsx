// ================ Product Card Component ================

import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Product } from '../../types/models';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner@2.0.3';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { token } = useAuth();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  
  const isInList = isInWishlist(product._id || product.id);

  // ================ Wishlist Toggle ================
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!token) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    setIsWishlistLoading(true);
    try {
      if (isInList) {
        await removeFromWishlist(product._id || product.id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product._id || product.id);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // ================ Add to Cart ================
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
    toast.success('Added to cart');
  };

  return (
    <Link to={`/product/${product._id || product.id}`} className="product-card">
      {/* ================ Image ================ */}
      <div className="product-image-wrapper">
        <img 
          src={product.imageCover} 
          alt={product.title}
          className="product-image"
          loading="lazy"
        />
        
        {/* Discount Badge */}
        {product.priceAfterDiscount && (
          <Badge variant="destructive" className="discount-badge">
            {Math.round((1 - product.priceAfterDiscount / product.price) * 100)}% OFF
          </Badge>
        )}
        
        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
          className={`wishlist-btn ${isInList ? 'active' : ''}`}
          title={isInList ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={isInList ? 'filled' : ''} />
        </Button>
      </div>

      {/* ================ Content ================ */}
      <div className="product-content">
        {/* Category & Brand */}
        <div className="product-meta">
          <span className="category">{product.category?.name}</span>
          {product.brand && <span className="brand">{product.brand.name}</span>}
        </div>

        {/* Title */}
        <h3 className="product-title">{product.title}</h3>

        {/* Rating */}
        <div className="product-rating">
          <Star className="star-icon filled" />
          <span className="rating-value">{product.ratingsAverage.toFixed(1)}</span>
          <span className="rating-count">({product.ratingsQuantity})</span>
        </div>

        {/* Price */}
        <div className="product-price">
          {product.priceAfterDiscount ? (
            <>
              <span className="price-original">${product.price}</span>
              <span className="price-discounted">${product.priceAfterDiscount}</span>
            </>
          ) : (
            <span className="price-current">${product.price}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={product.quantity === 0}
          className="add-to-cart-btn"
          size="sm"
        >
          <ShoppingCart className="btn-icon" />
          {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </Link>
  );
}
