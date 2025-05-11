import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [cartId, setCartId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('JwtToken');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId || decoded.Id); // match field in your token
      fetchCart(decoded.userId || decoded.Id);
    }
  }, []);

  const fetchCart = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5198/pustakalaya/carts/get-Cart-details`, {
        params: { UserId: userId }
      });
      setCartItems(response.data.items || []);
      setCartId(response.data.cartId)
    } catch (error) {
      console.error("Failed to load cart", error);
    }
  };

  const updateQuantity = async (bookId, change) => {
    const endpoint = change > 0 ? "/increase-item" : "/decrease-item";
    try {
      await axios.patch(`http://localhost:5198/pustakalaya/carts${endpoint}`, {
        cartId,
        bookId,
      });
      fetchCart(userId);
    } catch (error) {
      console.error("Quantity update failed", error);
    }
  };

  const removeItem = async (bookId) => {
    try {
      await axios.delete("http://localhost:5198/pustakalaya/carts/delete-item", {
        data: { cartId, bookId }
      });
      fetchCart(userId);
    } catch (error) {
      console.error("Remove item failed", error);
    }
  };

  const clearCart = async () => {
    for (const item of cartItems) {
      await removeItem(item.bookId);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const discount = totalItems >= 5 ? totalPrice * 0.05 : 0;
  const finalPrice = totalPrice - discount;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <ShoppingBag size={48} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any books to your cart yet.</p>
            <Link to="/catalog" className="btn-primary">Browse Books</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.bookId} className="cart-item">
                <div className="item-image">
                  <img src={item.coverImage || item.bookImage} alt={item.title} />
                </div>

                <div className="item-details">
                  <h3>{item.bookTitle}</h3>
                  <p className="item-author">by {item.author}</p>
                  <div className="item-price">RS. {item.price?.toFixed(2)}</div>
                </div>

                <div className="item-quantity">
                  <button
                    onClick={() => updateQuantity(item.bookId, -1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.bookId, 1)}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  className="remove-item"
                  onClick={() => removeItem(item.bookId)}
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>RS. {totalPrice?.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span>- RS. {discount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row total">
              <span>Total</span>
              <span>RS. {finalPrice?.toFixed(2)}</span>
            </div>

            <Link
              to={userId ? "/checkout" : "/login?redirect=checkout"}
              className="checkout-button"
            >
              Proceed to Checkout
            </Link>

            <button className="clear-cart" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
