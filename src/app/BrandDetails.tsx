import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { productsAPI, brandsAPI } from '../services/api';
import type { Product, Brand } from '../types/models';
import { ProductCard } from '../components/ProductCard/ProductCard';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';

export default function BrandDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  useEffect(() => {
    const fetchBrandAndProducts = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch brand details
        const brandResponse = await brandsAPI.getById(id);
        setBrand(brandResponse.data);
        
        // Fetch products for this brand
        const productsResponse = await productsAPI.getAll({
          brand: id,
        });
        setProducts(productsResponse.data || []);
      } catch (error) {
        console.error('Error fetching brand:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandAndProducts();
  }, [id]);

  const filteredProducts = products.filter((product: Product) => {
    const price = product.price || 0;
    return price >= priceRange.min && price <= priceRange.max;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'rating') return (b.ratingsAverage || 0) - (a.ratingsAverage || 0);
    if (sortBy === 'newest') return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          <span className="text-gray-600">/</span>
          <h1 className="text-xl font-semibold text-gray-900">
            {brand?.name || 'Brand'}
          </h1>
        </div>
      </div>

      {/* Brand Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-8">
            {brand?.image && (
              <img 
                src={brand.image} 
                alt={brand.name} 
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {brand?.name}
              </h1>
              <p className="text-gray-600">
                Brand ID: {brand?._id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Products */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-48 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="number"
                    min="0"
                    value={priceRange.min}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded text-sm"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    max="10000"
                    value={priceRange.max}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-medium mb-3">Sort By</h3>
                <select 
                  value={sortBy}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-sm"
                >
                  <option value="">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Products ({sortedProducts.length})
              </h2>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found from this brand</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map(product => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
