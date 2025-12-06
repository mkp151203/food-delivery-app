import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Restaurant from './pages/Restaurant';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Login from './pages/Login';
import MyOrders from './pages/MyOrders';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AddRestaurant from './pages/admin/AddRestaurant';
import AddMenuItem from './pages/admin/AddMenuItem';
import ManageOrders from './pages/admin/ManageOrders';

import './index.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/restaurant/:id" element={<Restaurant />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes (require login) */}
                <Route path="/checkout" element={
                  <ProtectedRoute><Checkout /></ProtectedRoute>
                } />
                <Route path="/order/:orderId" element={
                  <ProtectedRoute><OrderTracking /></ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute><MyOrders /></ProtectedRoute>
                } />

                {/* Admin Routes (require admin role) */}
                <Route path="/admin" element={
                  <AdminRoute><AdminDashboard /></AdminRoute>
                } />
                <Route path="/admin/restaurant" element={
                  <AdminRoute><AddRestaurant /></AdminRoute>
                } />
                <Route path="/admin/menu" element={
                  <AdminRoute><AddMenuItem /></AdminRoute>
                } />
                <Route path="/admin/orders" element={
                  <AdminRoute><ManageOrders /></AdminRoute>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
