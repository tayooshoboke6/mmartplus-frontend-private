import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import CategoryProductsPage from './pages/CategoryProductsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'
import ErrorBoundary from './components/common/ErrorBoundary'
import './App.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Admin pages
import DashboardPage from './pages/admin/DashboardPage'
import ProductsPage from './pages/admin/ProductsPage'
import ProductFormPage from './pages/admin/ProductFormPage'
import CategoriesPage from './pages/admin/CategoriesPage'
import CategoryManager from './pages/admin/CategoryManager'
import OrdersPage from './pages/admin/OrdersPage'
import SettingsPage from './pages/admin/SettingsPage'
import UsersPage from './pages/admin/UsersPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import PromotionsPage from './pages/admin/PromotionsPage'
import ProductSectionsPage from './pages/admin/ProductSectionsPage'
import AdminVouchersPage from './pages/admin/VouchersPage'
import StoreAddressesPage from './pages/admin/StoreAddressesPage'

// Account pages
import AccountPage from './pages/account/AccountPage'
import AccountOrdersPage from './pages/account/OrdersPage'
import OrderDetailPage from './pages/account/OrderDetailPage'
import InboxPage from './pages/account/InboxPage'
import ReviewsPage from './pages/account/ReviewsPage'
import VouchersPage from './pages/account/VouchersPage'
import WishlistPage from './pages/account/WishlistPage'
import RecentlyViewedPage from './pages/account/RecentlyViewedPage'
import WalletPage from './pages/account/WalletPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            {/* Customer routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={
              <ErrorBoundary>
                <ProductDetailPage />
              </ErrorBoundary>
            } />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
            <Route path="/category/:slug" element={<CategoryProductsPage />} />
            
            {/* Account routes - protected */}
            <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
            <Route path="/account/orders" element={<ProtectedRoute><AccountOrdersPage /></ProtectedRoute>} />
            <Route path="/account/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
            <Route path="/account/inbox" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
            <Route path="/account/reviews" element={<ProtectedRoute><ReviewsPage /></ProtectedRoute>} />
            <Route path="/account/vouchers" element={<ProtectedRoute><VouchersPage /></ProtectedRoute>} />
            <Route path="/account/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/account/recently-viewed" element={<ProtectedRoute><RecentlyViewedPage /></ProtectedRoute>} />
            <Route path="/account/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
            
            {/* Redirects - for compatibility */}
            <Route path="/orders" element={<Navigate to="/account/orders" replace />} />
            
            {/* Protected Admin routes */}
            <Route path="/admin" element={<AdminRoute><DashboardPage /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><ProductsPage /></AdminRoute>} />
            <Route path="/admin/products/new" element={<AdminRoute><ProductFormPage /></AdminRoute>} />
            <Route path="/admin/products/add" element={<AdminRoute><ProductFormPage /></AdminRoute>} />
            <Route path="/admin/products/edit/:id" element={<AdminRoute><ProductFormPage /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><CategoriesPage /></AdminRoute>} />
            <Route path="/admin/categories/manage" element={<AdminRoute><CategoryManager /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><OrdersPage /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UsersPage /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />
            <Route path="/admin/promotions" element={<AdminRoute><PromotionsPage /></AdminRoute>} />
            <Route path="/admin/product-sections" element={<AdminRoute><ProductSectionsPage /></AdminRoute>} />
            <Route path="/admin/vouchers" element={<AdminRoute><AdminVouchersPage /></AdminRoute>} />
            <Route path="/admin/store-addresses" element={<AdminRoute><StoreAddressesPage /></AdminRoute>} />
          </Routes>
          <ToastContainer position="bottom-right" autoClose={3000} />
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
