// ================ Navbar Component ================

import { Search, ShoppingCart, Heart, Sun, Moon, User, LogOut, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: Array<{ _id: string; name: string; slug: string }>;
}

export function Navbar({ 
  searchQuery, 
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories 
}: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // ================ Handlers ================
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        {/* ================ Top Row ================ */}
        <div className="navbar-top">
          <Link to="/" className="navbar-brand">
            <ShoppingCart className="brand-icon" />
            <h1>E-Shop</h1>
          </Link>

          {/* ================ Search Bar ================ */}
          <div className="navbar-search">
            <Search className="search-icon" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
          </div>

          {/* ================ Actions ================ */}
          <div className="navbar-actions">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="action-btn"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="icon" /> : <Sun className="icon" />}
            </Button>

            {/* Wishlist */}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/wishlist')}
                className="action-btn wishlist-btn"
                title="Wishlist"
              >
                <Heart className="icon" />
                {wishlist.length > 0 && (
                  <Badge variant="destructive" className="badge">
                    {wishlist.length}
                  </Badge>
                )}
              </Button>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/cart')}
              className="action-btn cart-btn"
              title="Shopping Cart"
            >
              <ShoppingCart className="icon" />
              {getCartItemCount() > 0 && (
                <Badge variant="destructive" className="badge">
                  {getCartItemCount()}
                </Badge>
              )}
            </Button>

            {/* Orders */}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/orders')}
                className="action-btn"
                title="My Orders"
              >
                <Package className="icon" />
              </Button>
            )}

            {/* User Menu */}
            {user ? (
              <div className="user-menu">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="action-btn"
                >
                  <User className="icon" />
                </Button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <p className="user-name">{user.name}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="logout-btn"
                    >
                      <LogOut className="icon" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ================ Categories ================ */}
        <div className="navbar-categories">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onCategoryChange('all')}
          >
            All Products
          </Button>
          {categories.map((category) => (
            <Button
              key={category._id}
              variant={selectedCategory === category._id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onCategoryChange(category._id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
