// ================ Product Details Page ================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ShoppingCart, Heart, Star, ArrowLeft, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Loading } from '../components/Loading/Loading';
import { ErrorMessage } from '../components/ErrorMessage/ErrorMessage';
import { Footer } from '../components/Footer/Footer';
import { productsAPI, reviewsAPI } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { Product } from '../types/models';
import { toast } from 'sonner@2.0.3';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { token } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // ================ Fetch Product ================
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const response = await productsAPI.getById(id);
        setProduct(response.data);
        setSelectedImage(response.data.imageCover);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ================ Fetch Reviews ================
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      
      try {
        setIsReviewsLoading(true);
        const response = await reviewsAPI.getByProduct(id);
        setReviews(response.data || []);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setIsReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  if (isLoading) {
    return <Loading fullScreen message="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <ErrorMessage 
          message={error || 'Product not found'} 
          onRetry={() => navigate('/')} 
        />
      </div>
    );
  }

  const isInList = isInWishlist(product._id || product.id);

  // ================ Wishlist Toggle ================
  const handleWishlistToggle = async () => {
    if (!token) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

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
    }
  };

  // ================ Add to Cart ================
  const handleAddToCart = async () => {
    if (!token) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await addToCart(product._id || product.id);
      toast.success(`Added ${quantity} item(s) to cart`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart');
    }
  };

  // ================ Submit Review ================
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login to submit a review');
      navigate('/login');
      return;
    }

    if (!reviewText.trim()) {
      toast.error('Please enter a review');
      return;
    }

    try {
      setIsSubmittingReview(true);
      await reviewsAPI.create(product._id || product.id, reviewText, reviewRating);
      toast.success('Review submitted successfully!');
      setReviewText('');
      setReviewRating(5);
      
      // Refresh reviews
      const response = await reviewsAPI.getByProduct(product._id || product.id);
      setReviews(response.data || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ================ Header ================ */}
      <header className="border-b bg-white sticky top-0 z-50 px-4 py-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
        </div>
      </header>

      {/* ================ Main Content ================ */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ================ Images ================ */}
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img 
                  src={selectedImage} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {product.images && product.images.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  <button
                    onClick={() => setSelectedImage(product.imageCover)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === product.imageCover ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={product.imageCover} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        selectedImage === image ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ================ Details ================ */}
            <div className="space-y-6">
              {/* Category & Brand */}
              <div className="flex items-center gap-2">
                {product.category && (
                  <Badge variant="secondary">{product.category.name}</Badge>
                )}
                {product.brand && (
                  <Badge variant="outline">{product.brand.name}</Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold">{product.title}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-semibold">{product.ratingsAverage.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground">
                  ({product.ratingsQuantity} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                {product.priceAfterDiscount ? (
                  <>
                    <span className="text-4xl font-bold text-destructive">
                      ${product.priceAfterDiscount}
                    </span>
                    <span className="text-2xl text-muted-foreground line-through">
                      ${product.price}
                    </span>
                    <Badge variant="destructive">
                      {Math.round((1 - product.priceAfterDiscount / product.price) * 100)}% OFF
                    </Badge>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-primary">${product.price}</span>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Stock Status */}
              <div>
                {product.quantity > 0 ? (
                  <Badge variant="default" className="bg-green-500">
                    In Stock ({product.quantity} available)
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <label className="font-semibold">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    disabled={quantity >= product.quantity}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0}
                  className="flex-1"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleWishlistToggle}
                  variant={isInList ? "default" : "outline"}
                  size="lg"
                >
                  <Heart className={isInList ? 'fill-current' : ''} />
                </Button>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-6 space-y-2 text-sm">
                <p>
                  <span className="font-semibold">SKU:</span> {product._id}
                </p>
                <p>
                  <span className="font-semibold">Sold:</span> {product.sold} units
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================ Reviews Section ================ */}
        <section className="border-t py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-8">Reviews ({reviews.length})</h2>

            {/* Review Form */}
            {token && (
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="font-semibold mb-4">Write a Review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <select 
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Good</option>
                      <option value={3}>3 - Average</option>
                      <option value={2}>2 - Poor</option>
                      <option value={1}>1 - Terrible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Review</label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience with this product..."
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmittingReview}
                    className="w-full"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </div>
            )}

            {!token && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8 text-center">
                <p className="text-sm mb-2">Please <Link to="/login" className="text-blue-600 font-semibold">login</Link> to write a review</p>
              </div>
            )}

            {/* Reviews List */}
            {isReviewsLoading ? (
              <p className="text-center text-gray-500">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-center text-gray-500">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review: any, idx: number) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-2">({review.rating})</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                    <p className="text-gray-700">{review.review}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
