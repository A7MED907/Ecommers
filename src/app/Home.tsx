// ================ Home Page ================

import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { ProductCard } from '../components/ProductCard/ProductCard';
import { Footer } from '../components/Footer/Footer';
import { Loading } from '../components/Loading/Loading';
import { ErrorMessage } from '../components/ErrorMessage/ErrorMessage';
import { productsAPI, categoriesAPI } from '../services/api';
import type { Product, Category } from '../types/models';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner@2.0.3';

export default function Home() {
  // ================ State ================
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ================ Contexts ================
  const { addToCart } = useCart();
  const { token } = useAuth();

  // ================ Fetch Categories ================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        setCategories(response.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // ================ Fetch Products ================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const params: any = {
          page: currentPage,
          limit: 12,
        };
        
        if (selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        
        if (searchQuery) {
          params.keyword = searchQuery;
        }
        
        const response = await productsAPI.getAll(params);
        setProducts(response.data || []);
        
        if (response.metadata) {
          setTotalPages(response.metadata.numberOfPages);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, currentPage]);

  // ================ Handlers ================
  const handleAddToCart = async (product: Product) => {
    if (!token) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(product._id || product.id);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart');
    }
  };

  const handleRetry = () => {
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      <main className="flex-1">
        {/* ================ Hero Section ================ */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4">Welcome to E-Shop</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover amazing products from top brands at unbeatable prices.
            </p>
          </div>
        </section>

        {/* ================ Products Section ================ */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <Loading message="Loading products..." />
            ) : error ? (
              <ErrorMessage message={error} onRetry={handleRetry} />
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2>
                    {selectedCategory === 'all' 
                      ? 'All Products' 
                      : categories.find(c => c._id === selectedCategory)?.name || 'Products'}
                  </h2>
                  <p className="text-muted-foreground">
                    {products.length} product{products.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id || product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}