import React, { useState } from 'react';
import { Star } from 'lucide-react';
import './AddReviewForm.css';

const AddReviewForm = ({ bookId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) {
      alert('Please add a rating and comment.');
      return;
    }

    const newReview = {
      bookId,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      userName: 'Current User', // replace with actual user name from auth context
    };

    onReviewSubmit(newReview);
    setRating(0);
    setComment('');
  };

  return (
    <form className="add-review-form" onSubmit={handleSubmit}>
      <h3>Add Your Review</h3>
      <div className="star-rating-input">
        {[...Array(5)].map((_, i) => {
          const index = i + 1;
          return (
            <button
              key={index}
              type="button"
              className={`star-button ${index <= (hoverRating || rating) ? 'filled' : ''}`}
              onClick={() => setRating(index)}
              onMouseEnter={() => setHoverRating(index)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`Rate ${index} star`}
            >
              <Star size={20} fill={index <= (hoverRating || rating) ? '#f59e0b' : 'none'} />
            </button>
          );
        })}
      </div>

      <textarea
        placeholder="Write your review here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      ></textarea>

      <button type="submit" className="submit-review-btn">Submit Review</button>
    </form>
  );
};

export default AddReviewForm;
