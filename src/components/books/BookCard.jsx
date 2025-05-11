import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './BookCard.css';

const BookCard = ({ book }) => {
  const [userId, setUserId] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // ✅ Decode token and fetch wishlist status
  useEffect(() => {
    const token = localStorage.getItem('JwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded.Id || decoded.id || decoded.UserId || decoded.userId;
        if (id) {
          setUserId(id);

          // ✅ Fetch wishlist for this user
          axios.get(`http://localhost:5198/pustakalaya/WishList/${id}`)
            .then((res) => {
              const wishlistBookIds = res.data;
              setIsBookmarked(wishlistBookIds.includes(book.id));
            });
        }
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
  }, [book.id]);

  // ✅ Add to cart using CartDTO structure
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      console.warn("User not logged in.");
      return;
    }

    try {
      await axios.post("http://localhost:5198/pustakalaya/carts/add-to-cart", {
        userId: userId,
        items: [
          {
            bookId: book.id,
            quantity: 1
          }
        ]
      });

      console.log("Book added to cart");
      // You can add toast.success("Added to cart") here
    } catch (error) {
      console.error("Failed to add to cart:", error.response?.data || error.message);
    }
  };

  // ✅ Toggle bookmark
  const handleToggleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return;

    try {
      await axios.post(`http://localhost:5198/pustakalaya/wishList/toggle-wishlist`, null, {
        params: {
          userId: userId,
          bookId: book.id,
        },
      });
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  const discountPercentage = book.discount
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  return (
    <div className="book-card">
      <Link to={`/book/${book.id}`} className="book-card-link" style={{ textDecoration: "none" }}>
        <div className="book-card-image">
          <img src={book.bookImage} alt={book.title} />
          {book.discount && <div className="book-discount-badge">{discountPercentage}% OFF</div>}
          {book.bestSeller && <div className="book-badge bestseller">Bestseller</div>}
          {book.newRelease && <div className="book-badge new-release">New Release</div>}
          {book.awardWinner && <div className="book-badge award-winner">Award Winner</div>}
        </div>

        <div className="book-card-content">
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">by {book.authors}</p>

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
            {book.discount && <span className="original-price">RS. {book.originalPrice.toFixed(2)}</span>}
            <span className="current-price">RS. {book.price.toFixed(2)}</span>
          </div>

          <div className="book-format">{book.format}</div>
        </div>
      </Link>

      <div className="book-card-actions">
        <button className="cart-btn" onClick={handleAddToCart}>
          <ShoppingCart size={18} /> Add to Cart
        </button>

        {userId && (
          <button
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={handleToggleBookmark}
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
