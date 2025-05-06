// MemberDashboard.js
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ShoppingCart, 
  Clock, 
  Tag, 
  ChevronRight, 
  Heart, 
  Trash2, 
  Plus, 
  Minus,
  Book
} from 'lucide-react';
import './MemberDashboard.css';

// Sample data
const bookmarkedBooks = [
  { id: 1, title: 'The Design of Everyday Things', author: 'Don Norman', image: '/api/placeholder/60/80', price: 24.99 },
  { id: 2, title: 'Atomic Habits', author: 'James Clear', image: '/api/placeholder/60/80', price: 19.99 },
  { id: 3, title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', image: '/api/placeholder/60/80', price: 39.99 },
];

const cartItems = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin', image: '/api/placeholder/60/80', price: 29.99, quantity: 1 },
  { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', image: '/api/placeholder/60/80', price: 34.99, quantity: 1 },
];

const orderHistory = [
  { id: 'ORD-2025041', date: '2025-05-01', total: 54.98, status: 'Delivered', items: 2, claimCode: 'XDG-4532-FGH' },
  { id: 'ORD-2025035', date: '2025-04-15', total: 29.99, status: 'Processing', items: 1, claimCode: 'TRP-7823-KLM' },
  { id: 'ORD-2025029', date: '2025-04-02', total: 74.97, status: 'Processing', items: 3, claimCode: 'QWE-1234-ASD' },
];

const discounts = [
  { id: 1, code: 'SPRING25', discount: '25% off', validUntil: '2025-06-30', category: 'Fiction' },
  { id: 2, code: 'TECH15', discount: '15% off', validUntil: '2025-05-15', category: 'Technical' },
  { id: 3, code: 'FREESHIP', discount: 'Free Shipping', validUntil: '2025-05-31', category: 'Any purchase' },
];

// Tab Button Component
const TabButton = ({ icon, label, active, onClick }) => (
  <button 
    className={`tab-button ${active ? 'active' : ''}`}
    onClick={onClick}
  >
    <span className="tab-icon">{icon}</span>
    <span className="tab-label">{label}</span>
  </button>
);

// BookmarkItem Component
const BookmarkItem = ({ book }) => (
  <div className="bookmark-item fade-in">
    <div className="book-image">
      <img src={book.image} alt={book.title} />
    </div>
    <div className="book-info">
      <h3>{book.title}</h3>
      <p className="book-author">{book.author}</p>
      <p className="book-price">${book.price.toFixed(2)}</p>
    </div>
    <div className="bookmark-actions">
      <button className="icon-button add-to-cart">
        <ShoppingCart size={18} />
      </button>
      <button className="icon-button remove">
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);

// CartItem Component
const CartItem = ({ item, updateQuantity }) => (
  <div className="cart-item fade-in">
    <div className="book-image">
      <img src={item.image} alt={item.title} />
    </div>
    <div className="book-info">
      <h3>{item.title}</h3>
      <p className="book-author">{item.author}</p>
      <p className="book-price">${item.price.toFixed(2)}</p>
    </div>
    <div className="quantity-control">
      <button className="quantity-button" onClick={() => updateQuantity(item.id, -1)}>
        <Minus size={16} />
      </button>
      <span className="quantity">{item.quantity}</span>
      <button className="quantity-button" onClick={() => updateQuantity(item.id, 1)}>
        <Plus size={16} />
      </button>
    </div>
    <button className="icon-button remove">
      <Trash2 size={18} />
    </button>
  </div>
);

// OrderItem Component
const OrderItem = ({ order }) => (
  <div className="order-item fade-in">
    <div className="order-header">
      <div>
        <h3 className="order-id">{order.id}</h3>
        <p className="order-date">{order.date}</p>
      </div>
      <span className={`order-status ${order.status.toLowerCase()}`}>
        {order.status}
      </span>
    </div>
    <div className="order-details">
      <div className="order-info">
        <p><strong>Items:</strong> {order.items}</p>
        <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
      </div>
      <div className="claim-code">
        <p><strong>Claim Code:</strong></p>
        <span className="code">{order.claimCode}</span>
      </div>
    </div>
    <button className="details-button">
      View Details <ChevronRight size={16} />
    </button>
  </div>
);

// DiscountItem Component
const DiscountItem = ({ discount }) => (
  <div className="discount-item fade-in">
    <div className="discount-code">
      <span className="code-label">CODE</span>
      <span className="code">{discount.code}</span>
    </div>
    <div className="discount-info">
      <h3>{discount.discount}</h3>
      <p className="discount-category">{discount.category}</p>
      <p className="discount-expiry">Valid until: {discount.validUntil}</p>
    </div>
    <button className="use-code-button">
      Use Code
    </button>
  </div>
);

export default function MemberDashboard() {
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [cartTotal, setCartTotal] = useState(0);
  
  useEffect(() => {
    // Calculate cart total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
    
    // Add staggered animation classes
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 100 * (index + 1));
    });
  }, [activeTab]);
  
  const updateQuantity = (id, amount) => {
    // In a real app, this would update the state and recalculate totals
    console.log(`Update item ${id} quantity by ${amount}`);
  };
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My Dashboard</h1>
        <p>Manage your bookmarks, cart, orders, and discounts</p>
      </header>
      
      {/* Dashboard Tabs */}
      <div className="tabs-container">
        <TabButton 
          icon={<BookOpen size={18} />} 
          label="Bookmarks" 
          active={activeTab === 'bookmarks'} 
          onClick={() => setActiveTab('bookmarks')} 
        />
       
        <TabButton 
          icon={<Clock size={18} />} 
          label="Orders" 
          active={activeTab === 'orders'} 
          onClick={() => setActiveTab('orders')} 
        />
        <TabButton 
          icon={<Tag size={18} />} 
          label="Discounts" 
          active={activeTab === 'discounts'} 
          onClick={() => setActiveTab('discounts')} 
        />
      </div>
      
      {/* Content Area */}
      <div className="content-area">
        {/* Bookmarks Tab */}
        {activeTab === 'bookmarks' && (
          <div className="bookmarks-container">
            <div className="section-header">
              <h2><Heart size={20} /> Bookmarked Books</h2>
              <span className="count">{bookmarkedBooks.length} items</span>
            </div>
            <div className="bookmarks-list">
              {bookmarkedBooks.map(book => (
                <BookmarkItem key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}
        
        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div className="cart-container">
            <div className="section-header">
              <h2><ShoppingCart size={20} /> Shopping Cart</h2>
              <span className="count">{cartItems.length} items</span>
            </div>
            <div className="cart-items">
              {cartItems.map(item => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  updateQuantity={updateQuantity} 
                />
              ))}
            </div>
            <div className="cart-summary">
              <div className="subtotal">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="shipping">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="total">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button className="checkout-button">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
        
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="orders-container">
            <div className="section-header">
              <h2><Clock size={20} /> Order History</h2>
              <span className="count">{orderHistory.length} orders</span>
            </div>
            <div className="orders-list">
              {orderHistory.map(order => (
                <OrderItem key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}
        
        {/* Discounts Tab */}
        {activeTab === 'discounts' && (
          <div className="discounts-container">
            <div className="section-header">
              <h2><Tag size={20} /> Available Discounts</h2>
              <span className="count">{discounts.length} codes</span>
            </div>
            <div className="discounts-list">
              {discounts.map(discount => (
                <DiscountItem key={discount.id} discount={discount} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}