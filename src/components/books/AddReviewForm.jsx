import React, { useState } from "react";
import ReactStars from "react-rating-stars-component";
import { toast } from "react-hot-toast";
import axios from "axios";
import "./AddReviewForm.css";

const AddReviewForm = ({ bookId, userId, token, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5 stars.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5198/api/Review",
        {
          bookId,
          userId,
          rating,
          comment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      onReviewSubmit(response.data);
    } catch (error) {
      console.error(
        "Error submitting review:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-review-form">
      <h3>Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Rating</label>
          <ReactStars
            count={5}
            value={rating}
            onChange={setRating}
            size={24}
            activeColor="#ffd700"
            isHalf={false}
            edit={!loading}
          />
        </div>
        <div className="form-group">
          <label>Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength="1000"
            placeholder="Share your thoughts about the book..."
            disabled={loading}
            rows="5"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="loader"></span> : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default AddReviewForm;
