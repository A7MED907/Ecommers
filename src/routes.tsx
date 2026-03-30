// ================ Routes Configuration ================

import { createBrowserRouter } from 'react-router';
import Home from './app/Home';
import ProductDetails from './app/ProductDetails';
import Login from './app/Login';
import Register from './app/Register';
import NotFound from './app/NotFound';
import CategoryDetails from './app/CategoryDetails';
import BrandDetails from './app/BrandDetails';
import ForgotPassword from './app/ForgotPassword';
import Cart from './app/Cart';
import Checkout from './app/Checkout';
import Orders from './app/Orders';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/product/:id',
    Component: ProductDetails,
  },
  {
    path: '/category/:id',
    Component: CategoryDetails,
  },
  {
    path: '/brand/:id',
    Component: BrandDetails,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/register',
    Component: Register,
  },
  {
    path: '/forgot-password',
    Component: ForgotPassword,
  },
  {
    path: '/cart',
    Component: Cart,
  },
  {
    path: '/checkout',
    Component: Checkout,
  },
  {
    path: '/orders',
    Component: Orders,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
