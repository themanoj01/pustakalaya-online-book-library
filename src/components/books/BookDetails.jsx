import React, { useEffect, useState } from 'react';
import { ShoppingCart, Heart, Star, ChevronRight, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './BookDetails.css';
import AddReviewForm from './AddReviewForm';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import axios from 'axios';

const BookDetails = ({ book }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [currentUser, setCurrentUser] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!book) return null;

  useEffect(() => {
    const token = localStorage.getItem('JwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
        // Optional: Check if book is already bookmarked
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
  }, []);

  const handleAddToCart = async () => {
    if (!currentUser) {
      toast.error('Please login to add to cart');
      return;
    }

    try {
      await axios.post('http://localhost:5198/pustakalaya/carts/add-to-cart', {
        userId: currentUser.userId || currentUser.Id,
        items: [
          {
            bookId: book.id,
            quantity: quantity,
          },
        ],
      });
      toast.success('Added to cart!');
    } catch (err) {
      console.error('Failed to add to cart', err);
      toast.error('Failed to add to cart');
    }
  };


  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setQuantity(value);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const discountPercentage = book.discount
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;


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
          <img src={book.bookImage} alt={book.title} />

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
          <p className="book-author">
            by{" "}
            {book.authors.map((author, index) => (
              <span key={author}>
                <a href={`/catalog?author=${encodeURIComponent(author)}`}>{author}</a>
                {index < book.authors.length - 1 && ", "}
              </span>
            ))}
          </p>


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
              <span className="meta-label">ISBN:</span>
              <span className="meta-value">{book.isbn}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Publication Date:</span>
              <span className="meta-value">
                {new Date(book.publicationDate).toLocaleString()}
              </span>

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
            <div className={`availability-indicator ${book.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {book.stock > 0 ? (
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
              disabled={book.stock <1}
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
                    <td>
                      {book.authors.map((author, index) => (
                        <span key={author}>
                          {author}
                          {index < book.authors.length - 1 && ", "}
                        </span>
                      ))}
                    </td>
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
                    <th>Publisher</th>
                    <td>{book.publisher}</td>
                  </tr>
                  <tr>
                    <th>Publication Date</th>
                    <td>{new Date(book.publicationDate).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>Language</th>
                    <td>{book.language}</td>
                  </tr>
                  <tr>
                    <th>Genre</th>
                    <td>
                      {book.genres.map((genre, index) => (
                        <span key={genre}>
                          {genre}
                          {index < book.genres.length - 1 && ", "}
                        </span>
                      ))}
                    </td>
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
                      {/* <h3>Write a Review</h3>
                      <p>You need to have purchased this book to leave a review.</p> */}
                      <AddReviewForm
                        bookId={book.id}
                        onReviewSubmit={(review) => {
                          // You could POST to API here, or just update local state:
                          book.reviews.push(review);
                        }}
                      />

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