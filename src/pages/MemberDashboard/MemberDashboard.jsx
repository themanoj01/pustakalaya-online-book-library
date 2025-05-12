// MemberDashboard.js
import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  Tag,
  ChevronRight,
  Heart
} from 'lucide-react';
import './MemberDashboard.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


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
      <img src={book.bookImage} alt={book.title} />
    </div>
    <div className="book-info">
      <h3>{book.title}</h3>
      <p className="book-author">{book.authors}</p>
      <p className="book-price">Rs. {book.price?.toFixed(2)}</p>
    </div>
    <div className="bookmark-actions">

      <button className="icon-button remove">
        <Heart size={18} style={{ fill: "red", border: "none", outline: 'none' }} />
      </button>
    </div>
  </div>
);


// OrderItem Component
const OrderItem = ({ order, onViewDetails }) => (
  <div className="order-item fade-in">
    <div className="order-header">
      <div>
        <h3 className="order-id">#{order.orderId}</h3>
        <p className="order-date">{new Date(order.orderDate).toLocaleDateString()}</p>
      </div>
      <span style={{ color: order.status != "CANCLED" ? "green" : "red" }} className={`order-status ${order.status.toLowerCase()}`}>
        {order.status}
      </span>
    </div>
    <div className="order-details">
      <div className="order-info">
        <p><strong>Items:</strong> {order.orderedItems.length}</p>
        <p><strong>Total:</strong> Rs. {order.totalAmount.toFixed(2)}</p>
      </div>
      <div className="claim-code">
        <p><strong>Claim Code:</strong></p>
        <span className="code">{order.claimCode}</span>
      </div>
    </div>
    <button className="details-button" onClick={() => onViewDetails(order)}>
      View Details <ChevronRight size={16} />
    </button>
  </div>
);


// DiscountItem Component
const DiscountItem = ({ discount }) => (
  <div className="discount-item fade-in">
    <div className="discount-code">
      <span className="code-label">NAME</span>
      <span className="code">{discount.name}</span>
    </div>
    <div className="discount-info">
      <h3>{discount.discountPercent}% off</h3>
      <p className="discount-expiry">
        Valid: {discount.startDate ? new Date(discount.startDate).toLocaleDateString() : "N/A"} - {discount.endDate ? new Date(discount.endDate).toLocaleDateString() : "N/A"}
      </p>
    </div>
  </div>
);


export default function MemberDashboard() {
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [cartTotal, setCartTotal] = useState(0);
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);


  useEffect(() => {
    // Fetch discounts from backend
    axios.get("http://localhost:5198/api/Discount/GetAll")
      .then(res => setDiscounts(res.data))
      .catch(err => console.error("Failed to load discounts", err));
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("JwtToken");
        const decoded = jwtDecode(token);
        const userId = decoded.userId || decoded.UserId || decoded.Id;

        const response = await axios.get(`http://localhost:5198/pustakalaya/orders/get-order-by-user`, {
          params: { userId }
        });
        setOrderHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch order history:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('JwtToken');
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.userId || decoded.Id;
      setUserId(userId);
      if (activeTab === "bookmarks" && userId) {
        fetchWishlist(userId);
      }
    }
  }, [activeTab]);

  const fetchWishlist = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5198/pustakalaya/wishlist/${userId}`);
      const bookIds = res.data;

      // Assuming you have an API to fetch book details by IDs
      const books = await Promise.all(
        bookIds.map(id => axios.get(`http://localhost:5198/api/Book/${id}`))
      );
      const bookData = books.map(b => b.data);
      setBookmarkedBooks(bookData);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    }
  };

  useEffect(() => {

    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 100 * (index + 1));
    });
  }, [activeTab]);


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



        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="orders-container">
            <div className="section-header">
              <h2><Clock size={20} /> Order History</h2>
              <span className="count">{orderHistory.length} orders</span>
            </div>
            <div className="orders-list">
              {orderHistory.map(order => (
                <OrderItem
                  key={order.orderId || order.id}
                  order={order}
                  onViewDetails={(order) => {
                    setSelectedOrder(order);
                    setShowOrderModal(true);
                  }}
                />
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

      {showOrderModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal order-detail-modal">
            <div className="modal-header">
              <h3>Order #{selectedOrder.orderId}</h3>
              <button className="close-btn" onClick={() => setShowOrderModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Total:</strong> Rs. {selectedOrder.totalAmount.toFixed(2)}</p>
              <p><strong>Claim Code:</strong> {selectedOrder.claimCode}</p>
              <h4>Ordered Items:</h4>
              <ul>
                {selectedOrder.orderedItems.map((item, idx) => (
                  <li key={idx}>{item.bookTitle} × {item.quantity}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}