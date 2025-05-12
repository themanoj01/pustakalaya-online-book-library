import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import RealTimeBroadcast from "./components/common/RealTimeBroadcast";

// Pages
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import AddReviewForm from "./components/books/AddReviewForm";
import StaffPortal from "./pages/StaffPortal.jsx";

import AuthContext, { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import CartPage from "./pages/CartPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard/MemberDashboard";
import OrderConfirmationPage from "./pages/OrderConfirmationPage/OrderConfirmationPage";
import { Toaster } from "react-hot-toast";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <div className="app">
                <Header />

                <main className="main-content">
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
                    <Route
                      path="/member-dashboard"
                      element={<MemberDashboard />}
                    />
                    <Route path="/review-book" element={<AddReviewForm />} />
                    <Route
                      path="/member-dashboard"
                      element={<MemberDashboard />}
                    />
                    <Route
                      path="/order-confirmation/:orderId"
                      element={<OrderConfirmationPage />}
                    />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Routes>
                </main>

                <RealTimeBroadcast />
                <Footer />
              </div>
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
