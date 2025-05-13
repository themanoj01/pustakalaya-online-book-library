import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout Components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import RealTimeBroadcast from "./components/common/RealTimeBroadcast";

// Pages
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import StaffPortal from "./pages/StaffPortal.jsx";

import AuthContext, { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import CartPage from './pages/CartPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard/MemberDashboard';
import OrderConfirmationPage from './pages/OrderConfirmationPage/OrderConfirmationPage';
import { Toaster } from 'react-hot-toast';
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import { jwtDecode } from "jwt-decode";
import { Navigate, useLocation } from "react-router-dom";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {

  const location = useLocation();

  const shouldHideHeader = () => {
    const hideHeaderPaths = ['/admin', '/staff-portal'];
    return hideHeaderPaths.some(path => location.pathname.endsWith(path));
  };
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <div className="app">
              {!shouldHideHeader() && <Header />}
              <main className="main-content">
                <RoutingWithRoleRedirect />
              </main>
              <RealTimeBroadcast />
              <Footer />
            </div>
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

function RoutingWithRoleRedirect() {
  const location = useLocation();

  const token = localStorage.getItem("JwtToken")?.replace(/^"(.*)"$/, "$1");
  let role = null;

  if (token) {
    try {
      role = jwtDecode(token).Role;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  // Redirect based on role
  if (role === "ADMIN" && location.pathname !== "/admin") {
    return <Navigate to="/admin" replace />;
  }

  if (role === "STAFF" && location.pathname !== "/staff-portal") {
    return <Navigate to="/staff-portal" replace />;
  }

  if ( role === "MEMBER" && (location.pathname === "/admin" || location.pathname === "/staff-portal")) 
  {
    return <Navigate to="/home" replace />;
  }



  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/book/:id" element={<BookDetailsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/staff-portal" element={<StaffPortal />} />
      <Route path="/member-dashboard" element={<MemberDashboard />} />
      <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default AppWrapper;