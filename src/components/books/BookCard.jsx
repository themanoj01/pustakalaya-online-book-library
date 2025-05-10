import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './BookCard.css';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  
  const isBookmarked = currentUser && 
    currentUser.bookmarks && 
    currentUser.bookmarks.includes(book.id);
  
  const discountPercentage = book.discount 
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) 
    : 0;
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book.id);
  };

  return (
    <div className="book-card">
      <Link to={`/book/${book.id}`} className="book-card-link">
        <div className="book-card-image">
          <img src={book.coverImage} alt={book.title} />
          
          {book.discount && (
            <div className="book-discount-badge">
              {discountPercentage}% OFF
            </div>
          )}
          
          {book.bestSeller && (
            <div className="book-badge bestseller">
              Bestseller
            </div>
          )}
          
          {book.newRelease && (
            <div className="book-badge new-release">
              New Release
            </div>
          )}
          
          {book.awardWinner && (
            <div className="book-badge award-winner">
              Award Winner
            </div>
          )}
        </div>
        
        <div className="book-card-content">
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">by {book.author}</p>
          
          <div className="book-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={i < Math.floor(book.rating) ? 'filled' : 'empty'}
                  fill={i < Math.floor(book.rating) ? 'currentColor' : 'none'} 
                />
              ))}
            </div>
            <span className="rating-value">{book.rating}</span>
          </div>
          
          <div className="book-price">
            {book.discount && (
              <span className="original-price">${book.originalPrice.toFixed(2)}</span>
            )}
            <span className="current-price">${book.price.toFixed(2)}</span>
          </div>
          
          <div className="book-format">{book.format}</div>
        </div>
      </Link>
      
      <div className="book-card-actions">
        <button 
          className="cart-btn" 
          onClick={handleAddToCart}
          aria-label="Add to cart"
        >
          <ShoppingCart size={18} /> Add to Cart
        </button>
        
        {currentUser && (
          <button 
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
          >
            <Heart size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;