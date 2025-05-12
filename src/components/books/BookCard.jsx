import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./BookCard.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./BookCard.css";
import toast from "react-hot-toast";

const BookCard = ({ book }) => {
  console.log("BookCard received book:", book); // Debug log
  const [userId, setUserId] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("JwtToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded.Id || decoded.id || decoded.UserId || decoded.userId;
        if (id) {
          setUserId(id);

          axios.get(`http://localhost:5198/pustakalaya/WishList/${id}`);
          axios
            .get(`http://localhost:5198/pustakalaya/WishList/${id}`)
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

    try {
      await axios.post(
        `http://localhost:5198/pustakalaya/wishList/toggle-wishlist`,
        null,
        {
          params: {
            userId: userId,
            bookId: book.Id,
          },
        }
      );
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  const displayAuthor = book.Authors?.length
    ? book.Authors[0]
    : "Unknown Author";

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
          <p className="book-author">by {displayAuthor}</p>

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
            className={`bookmark-btn ${isBookmarked ? "bookmarked" : ""}`}
            onClick={handleToggleBookmark}
            aria-label={
              isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
            }
          >
            <Heart size={18} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
