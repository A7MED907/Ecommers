# E-Commerce Application

A modern, full-featured e-commerce application built with React, TypeScript, and integrated with a real-world REST API.

## 🚀 Features

### ✅ Core Functionality
- **Product Catalog** - Browse products with real-time API integration
- **Search & Filter** - Search products and filter by categories
- **Product Details** - Detailed product pages with image galleries
- **Shopping Cart** - Add, remove, and update quantities
- **Wishlist System** - Save favorite products (requires authentication)
- **User Authentication** - Login and registration with JWT tokens
- **Dark/Light Mode** - Theme toggle with localStorage persistence

### 🎨 UI/UX Improvements
- Modern, responsive design using Tailwind CSS
- Smooth animations and transitions
- Loading states for better user feedback
- Error handling with retry functionality
- Toast notifications for user actions
- Mobile-friendly navigation

### 🏗️ Architecture & Code Quality
- Clean component structure (each component in its own folder)
- Proper TypeScript types and interfaces
- Context API for global state management
- Reusable API service layer
- Consistent code comments and organization
- No TypeScript `any` types

## 📁 Project Structure

```
/
├── app/                          # Route pages
│   ├── Home.tsx                 # Main shop page
│   ├── ProductDetails.tsx       # Product detail page
│   ├── Login.tsx                # Login page
│   ├── Register.tsx             # Registration page
│   └── NotFound.tsx             # 404 page
│
├── components/                   # Reusable components
│   ├── Navbar/
│   │   ├── Navbar.tsx
│   │   └── Navbar.css
│   ├── ProductCard/
│   │   ├── ProductCard.tsx
│   │   └── ProductCard.css
│   ├── ShoppingCart/
│   │   ├── ShoppingCart.tsx
│   │   └── ShoppingCart.css
│   ├── Footer/
│   │   ├── Footer.tsx
│   │   └── Footer.css
│   ├── Loading/
│   │   ├── Loading.tsx
│   │   └── Loading.css
│   ├── ErrorMessage/
│   │   ├── ErrorMessage.tsx
│   │   └── ErrorMessage.css
│   └── ui/                      # Shadcn UI components
│
├── context/                     # Global state management
│   ├── ThemeContext.tsx         # Dark/Light mode
│   ├── AuthContext.tsx          # Authentication
│   └── WishlistContext.tsx      # Wishlist management
│
├── services/                    # API integration
│   └── api.ts                   # All API calls
│
├── types/                       # TypeScript definitions
│   └── models.ts                # Type definitions
│
├── styles/                      # Global styles
│   └── globals.css              # Tailwind & theme variables
│
├── routes.tsx                   # React Router configuration
└── App.tsx                      # Root component
```

## 🔌 API Integration

**Base URL:** `https://ecommerce.routemisr.com/api/v1`

### Endpoints Used:
- **Products**
  - `GET /products` - Get all products (with pagination, filtering)
  - `GET /products/:id` - Get product by ID
  
- **Categories**
  - `GET /categories` - Get all categories
  
- **Brands**
  - `GET /brands` - Get all brands
  
- **Authentication**
  - `POST /auth/signup` - Register new user
  - `POST /auth/signin` - Login user
  - `GET /auth/verify-token` - Verify JWT token
  
- **Wishlist**
  - `GET /wishlist` - Get user wishlist
  - `POST /wishlist` - Add to wishlist
  - `DELETE /wishlist/:id` - Remove from wishlist

### Query Parameters Support:
- `page` - Page number for pagination
- `limit` - Number of items per page
- `category` - Filter by category ID
- `keyword` - Search products
- `sort` - Sort products

## 🔐 Authentication

The application uses JWT tokens for authentication:

1. **Register/Login** - User receives a JWT token
2. **Token Storage** - Token saved in `localStorage` as `userToken`
3. **Automatic Headers** - Token automatically added to protected API calls
4. **Logout** - Token removed from localStorage

## 🎨 Theme System

### Dark/Light Mode
- Toggle between dark and light themes
- Preference saved in `localStorage`
- Automatic theme application on load
- Smooth transitions between themes

### CSS Variables
All theme colors are defined as CSS variables in `/styles/globals.css`:
- `--background`, `--foreground`
- `--primary`, `--secondary`
- `--muted`, `--accent`
- `--border`, `--destructive`

## 🛠️ Technologies

- **React** - UI library
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS v4** - Styling
- **Context API** - State management
- **Lucide React** - Icons
- **Sonner** - Toast notifications

## 📱 Responsive Design

The application is fully responsive:
- **Mobile** - Single column layout, hamburger menu
- **Tablet** - 2-3 column grid
- **Desktop** - 4 column grid, full navigation

## 🚦 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📝 Code Quality

### TypeScript Best Practices
- ✅ All types properly defined in `/types/models.ts`
- ✅ No `any` types used
- ✅ Strict type checking enabled
- ✅ Proper interface definitions

### Component Structure
Each component follows this pattern:
```tsx
// ================ Component Name ================
import statements

// ================ Types ================
interface Props { ... }

// ================ Component ================
export function Component({ props }: Props) {
  // ================ State ================
  const [state, setState] = useState();
  
  // ================ Logic ================
  const handleAction = () => { ... };
  
  // ================ Render ================
  return ( ... );
}
```

### API Service Pattern
All API calls are centralized in `/services/api.ts`:
- Consistent error handling
- Automatic token injection
- Query parameter building
- Type-safe responses

## 🎯 Key Features Implemented

### ✅ Required Features
- [x] Clean project structure
- [x] TypeScript with proper types
- [x] API integration (Products, Categories, Brands, Auth, Wishlist)
- [x] Dark/Light mode with localStorage
- [x] Wishlist system (API-based)
- [x] Product details page
- [x] Loading states
- [x] Error handling
- [x] Login/Register
- [x] Token management
- [x] Logout functionality
- [x] Responsive design
- [x] Code comments
- [x] Developer credit in footer

### 🎨 UI Enhancements
- Modern product cards with hover effects
- Image galleries on product details
- Smooth transitions and animations
- Toast notifications
- Loading spinners
- Error messages with retry
- Empty state handling

## 👨‍💻 Developer

**Developed by [Ahmed Salem](https://ahmed-salem-resume.netlify.app/)**

## 📄 License

This project is open source and available for educational purposes.

---

Built with ❤️ using modern web technologies
