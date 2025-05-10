import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

const CartPage = () => {
  const { cart, totalItems, totalPrice, discount, removeFromCart, updateQuantity, clearCart } = useCart();
  const { currentUser } = useAuth();
  
  const handleQuantityChange = (bookId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(bookId, newQuantity);
    }
  };
  
  const handleRemoveItem = (bookId) => {
    removeFromCart(bookId);
  };
  
  const finalPrice = totalPrice - discount;

  if (cart.length === 0) {
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
            {cart.map(item => (
              <div key={item.bookId} className="cart-item">
                <div className="item-image">
                  <img src={item.coverImage} alt={item.title} />
                </div>
                
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p className="item-author">by {item.author}</p>
                  <div className="item-price">RS. {item.price.toFixed(2)}</div>
                </div>
                
                <div className="item-quantity">
                  <button 
                    onClick={() => handleQuantityChange(item.bookId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.bookId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <div className="item-total">
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  className="remove-item" 
                  onClick={() => handleRemoveItem(item.bookId)}
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
              <span>RS. {totalPrice.toFixed(2)}</span>
            </div>
            
            {discount > 0 && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="summary-row total">
              <span>Total</span>
              <span>RS. {finalPrice.toFixed(2)}</span>
            </div>
            
            <Link 
              to={currentUser ? "/checkout" : "/login?redirect=checkout"} 
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