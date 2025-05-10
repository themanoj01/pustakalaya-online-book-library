import React, { useState } from 'react';
import { ShoppingCart, Heart, Star, ChevronRight, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './BookDetails.css';

const BookDetails = ({ book }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  
  if (!book) return null;
  
  const isBookmarked = currentUser && 
    currentUser.bookmarks && 
    currentUser.bookmarks.includes(book.id);
  
  const discountPercentage = book.discount 
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) 
    : 0;
  
  const handleAddToCart = () => {
    addToCart(book.id, quantity);
  };
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="book-details">
      <div className="book-details-breadcrumb">
        <a href="/">Home</a>
        <ChevronRight size={14} />
        <a href="/catalog">Books</a>
        <ChevronRight size={14} />
        <a href={`/catalog?genre=${book.genre}`}>{book.genre}</a>
        <ChevronRight size={14} />
        <span>{book.title}</span>
      </div>
      
      <div className="book-details-main">
        <div className="book-details-image">
          <img src={book.coverImage} alt={book.title} />
          
          {book.discount && (
            <div className="book-details-discount-badge">
              {discountPercentage}% OFF
            </div>
          )}
          
          {book.bestSeller && (
            <div className="book-details-badge bestseller">
              Bestseller
            </div>
          )}
          
          {book.newRelease && (
            <div className="book-details-badge new-release">
              New Release
            </div>
          )}
          
          {book.awardWinner && (
            <div className="book-details-badge award-winner">
              Award Winner
            </div>
          )}
        </div>
        
        <div className="book-details-info">
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author">by <a href={`/catalog?author=${book.author}`}>{book.author}</a></p>
          
          <div className="book-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={18} 
                  className={i < Math.floor(book.rating) ? 'filled' : 'empty'}
                  fill={i < Math.floor(book.rating) ? 'currentColor' : 'none'} 
                />
              ))}
            </div>
            <span className="rating-value">{book.rating}</span>
            <span className="review-count">({book.reviews ? book.reviews.length : 0} reviews)</span>
          </div>
          
          <div className="book-price-container">
            <div className="book-price">
              {book.discount && (
                <span className="original-price">RS. {book.originalPrice.toFixed(2)}</span>
              )}
              <span className="current-price">RS. {book.price.toFixed(2)}</span>
            </div>
            
            {book.discount && (
              <div className="price-savings">
                You save: RS. {(book.originalPrice - book.price).toFixed(2)} ({discountPercentage}%)
              </div>
            )}
          </div>
          
          <div className="book-meta">
            <div className="meta-item">
              <span className="meta-label">Format:</span>
              <span className="meta-value">{book.format}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Pages:</span>
              <span className="meta-value">{book.pages}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">ISBN:</span>
              <span className="meta-value">{book.isbn}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Publication Date:</span>
              <span className="meta-value">{book.publishDate}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Publisher:</span>
              <span className="meta-value">{book.publisher}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Language:</span>
              <span className="meta-value">{book.language}</span>
            </div>
          </div>
          
          <div className="book-availability">
            <div className={`availability-indicator ${book.available ? 'in-stock' : 'out-of-stock'}`}>
              {book.available ? (
                <>
                  <Check size={16} />
                  <span>In Stock</span>
                </>
              ) : (
                <span>Out of Stock</span>
              )}
            </div>
          </div>
          
          <div className="book-actions">
            <div className="quantity-control">
              <button 
                className="quantity-btn" 
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={handleQuantityChange}
                className="quantity-input"
                aria-label="Quantity"
              />
              <button 
                className="quantity-btn" 
                onClick={incrementQuantity}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            
            <button 
              className="cart-btn" 
              onClick={handleAddToCart}
              disabled={!book.available}
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
            
            {currentUser && (
              <button 
                className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
              >
                <Heart size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="book-details-tabs">
        <div className="tab-header">
          <button 
            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({book.reviews ? book.reviews.length : 0})
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="tab-pane description">
              <p>{book.description}</p>
            </div>
          )}
          
          {activeTab === 'details' && (
            <div className="tab-pane details">
              <table className="details-table">
                <tbody>
                  <tr>
                    <th>Title</th>
                    <td>{book.title}</td>
                  </tr>
                  <tr>
                    <th>Author</th>
                    <td>{book.author}</td>
                  </tr>
                  <tr>
                    <th>ISBN</th>
                    <td>{book.isbn}</td>
                  </tr>
                  <tr>
                    <th>Format</th>
                    <td>{book.format}</td>
                  </tr>
                  <tr>
                    <th>Pages</th>
                    <td>{book.pages}</td>
                  </tr>
                  <tr>
                    <th>Publisher</th>
                    <td>{book.publisher}</td>
                  </tr>
                  <tr>
                    <th>Publication Date</th>
                    <td>{book.publishDate}</td>
                  </tr>
                  <tr>
                    <th>Language</th>
                    <td>{book.language}</td>
                  </tr>
                  <tr>
                    <th>Genre</th>
                    <td>{book.genre}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="tab-pane reviews">
              {book.reviews && book.reviews.length > 0 ? (
                <>
                  <div className="reviews-list">
                    {book.reviews.map(review => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="review-user">{review.userName}</div>
                          <div className="review-date">{review.date}</div>
                        </div>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < review.rating ? 'filled' : 'empty'}
                              fill={i < review.rating ? 'currentColor' : 'none'} 
                            />
                          ))}
                        </div>
                        <div className="review-comment">{review.comment}</div>
                      </div>
                    ))}
                  </div>
                  
                  {currentUser && (
                    <div className="write-review">
                      <h3>Write a Review</h3>
                      <p>You need to have purchased this book to leave a review.</p>
                      <a href="/reviews/new" className="btn-review">Write a Review</a>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-reviews">
                  <p>There are no reviews yet for this book.</p>
                  {currentUser && (
                    <>
                      <p>Be the first to review this book!</p>
                      <a href="/reviews/new" className="btn-review">Write a Review</a>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;