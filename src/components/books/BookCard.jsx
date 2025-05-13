import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./BookCard.css";
import toast from "react-hot-toast";

const BookCard = ({ book }) => {
  console.log("BookCard received book:", book);
  const [userId, setUserId] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("JwtToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded.userId || decoded.Id || decoded.UserId || decoded.id;
        if (id) {
          setUserId(id);
          axios.get(`http://localhost:5198/pustakalaya/wishlist/${id}`)
            .then((res) => {
              const wishlistBookIds = res.data;
              setIsBookmarked(wishlistBookIds.includes(book.Id));
            })
            .catch((err) => console.error("Error fetching wishlist:", err));
        }
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, [book.Id]);

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
            bookId: book.Id,
            quantity: 1,
          },
        ],
      });
      console.log("Book added to cart");

      toast.success("Added to cart");
    } catch (error) {
      console.error(
        "Failed to add to cart:",
        error.response?.data || error.message
      );
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
      <Link
        to={`/book/${book.Id}`}
        className="book-card-link"
        style={{ textDecoration: "none" }}
      >
        <div className="book-card-image">
          <img
            src={book.BookImage || "/placeholder-image.jpg"}
            alt={book.Title || "Book Image"}
          />
          {book.TotalSold > 0 && (
            <div className="book-badge bestseller">Bestseller</div>
          )}
          {new Date(book.PublicationDate) >
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
            <div className="book-badge new-release">New Release</div>
          )}
        </div>

        <div className="book-card-content">
          <h3 className="book-title">{book.Title}</h3>
          <p className="book-author">by {}</p>

          <div className="book-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={`star-${i}`}
                  size={16}
                  className={
                    i < Math.floor(book.Rating || 0) ? "filled" : "empty"
                  }
                  fill={
                    i < Math.floor(book.Rating || 0) ? "currentColor" : "none"
                  }
                />
              ))}
            </div>
            <span className="rating-value">
              {(Number(book.Rating) || 0).toFixed(1)}
            </span>
          </div>

          <div className="book-price">
            <span className="current-price">
              RS. {(Number(book.Price) || 0).toFixed(2)}
            </span>
          </div>

          <div className="book-format">{book.Format}</div>
        </div>
      </Link>

      <div className="book-card-actions">
        <button
          className="cart-btn"
          onClick={handleAddToCart}
          aria-label="Add to Cart"
        >
          <ShoppingCart size={18} /> Add to Cart
        </button>

        {userId && (
          <button

            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
            onClick={handleToggleBookmark}
          >
            <Heart size={18} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        )}

      </div>
    </div>
  );
};

export default BookCard;
