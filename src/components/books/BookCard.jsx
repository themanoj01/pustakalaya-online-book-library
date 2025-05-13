import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './BookCard.css';
import toast from 'react-hot-toast';

const BookCard = ({ book }) => {
  const [userId, setUserId] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('JwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded.userId || decoded.Id || decoded.UserId || decoded.id;
        if (id) {
          setUserId(id);

          axios.get(`http://localhost:5198/pustakalaya/wishlist/${id}`)
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

      toast.success("Added to cart");
    } catch (error) {
      console.error("Failed to add to cart:", error.response?.data || error.message);
    }
  };

  const handleToggleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return;

    console.log("Toggling bookmark for", book.id);
    try {
      await axios.post(`http://localhost:5198/pustakalaya/wishlist/toggle-wishlist`, null, {
        params: {
          userId: userId,
          bookId: book.id,
        },
      });
      setIsBookmarked(prev => !prev);
    } catch (error) {
      console.error("Toggle failed", error);
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
            {book.discount && <span className="original-price">RS. {book.originalPrice?.toFixed(2)}</span>}
            <span className="current-price">RS. {book.price?.toFixed(2)}</span>
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
            aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
            onClick={handleToggleBookmark}
          >
            <Heart size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        )}

      </div>
    </div>
  );
};

export default BookCard;