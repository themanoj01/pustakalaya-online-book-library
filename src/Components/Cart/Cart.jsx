import React from 'react'
import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ChevronRight, BookOpen, TrendingUp, Award } from 'lucide-react';
import './Cart.css';

function Cart() {
  
        const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      price: 18.99,
      originalPrice: 24.99,
      quantity: 1,
      cover: "/api/placeholder/180/260"
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      price: 15.99,
      originalPrice: 19.99,
      quantity: 2,
      cover: "/api/placeholder/180/260"
    },
    {
      id: 3,
      title: "The Psychology of Money",
      author: "Morgan Housel",
      price: 14.50,
      originalPrice: 17.99,
      quantity: 1,
      cover: "/api/placeholder/180/260"
    }
  ]);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
    
    setNotificationMessage('Cart updated');
    setShowNotification(true);
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    setNotificationMessage('Item removed from cart');
    setShowNotification(true);
  };

  const checkout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setNotificationMessage('Order placed successfully!');
      setShowNotification(true);
      setCartItems([]);
      setIsCheckingOut(false);
    }, 2000);
  };

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = cartItems.reduce((total, item) => total + ((item.originalPrice - item.price) * item.quantity), 0);
  const shipping = subtotal > 35 ? 0 : 4.99;
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      {/* Header */}
      

      {/* Main Content */}
      <main className="main-content container">
        <h2 className="page-title">Your Shopping Cart</h2>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <ShoppingCart size={64} />
            </div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any books to your cart yet.</p>
            <button className="browse-button">
              Browse Books
            </button>
          </div>
        ) : (
          <div className="cart-grid">
            {/* Cart Items */}
            <div className="cart-items-container">
              <div className="cart-card">
                <div className="card-header">
                  <h3>Cart Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</h3>
                </div>
                
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="item-image">
                        <img src={item.cover} alt={item.title} />
                      </div>
                      
                      <div className="item-details">
                        <h4>{item.title}</h4>
                        <p className="author">by {item.author}</p>
                        <div className="price-info">
                          <span className="current-price">RS. {item.price.toFixed(2)}</span>
                          {item.originalPrice > item.price && (
                            <>
                              <span className="original-price">RS. {item.originalPrice.toFixed(2)}</span>
                              <span className="discount">
                                {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="item-actions">
                        <div className="quantity-selector">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="quantity-btn"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="quantity-btn"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="remove-btn"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="order-summary-container">
              <div className="order-summary-card">
                <div className="card-header">
                  <h3>Order Summary</h3>
                </div>
                
                <div className="summary-content">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>RS. {subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="summary-row discount-row">
                      <span>Discount</span>
                      <span>-RS. {discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {/* <div className="summary-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `RS. ${shipping.toFixed(2)}`}</span>
                  </div> */}
                  
                  {shipping > 0 && (
                    <div className="shipping-note">
                      Free shipping on orders over RS. 35
                    </div>
                  )}
                  
                  <div className="total-row">
                    <span>Total</span>
                    <span>RS. {total.toFixed(2)}</span>
                  </div>
                  
                  <button 
                    onClick={checkout}
                    disabled={isCheckingOut}
                    className={`checkout-btn ${isCheckingOut ? 'disabled' : ''}`}
                  >
                    <span>{isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}</span>
                    {!isCheckingOut && <ChevronRight size={18} />}
                  </button>
                </div>
              </div>
              
              {/* Benefits Section */}
              <div className="benefits-card">
                <h4>Why shop with Pustakalaya?</h4>
                <ul className="benefits-list">
                  
                  <li>
                    <Award size={18} className="benefit-icon" />
                    <span>Genuine books, carefully curated</span>
                  </li>
                  <li>
                    <ShoppingCart size={18} className="benefit-icon" />
                    <span>Easy returns within 30 days</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
      
      
      {/* Notification */}
      <div className={`notification ${showNotification ? 'show' : ''}`}>
        {notificationMessage}
      </div>
    </div>
  );
}

export default Cart
