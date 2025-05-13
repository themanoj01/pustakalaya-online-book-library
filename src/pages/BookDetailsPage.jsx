import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BookDetails from '../components/books/BookDetails';
import BookCard from '../components/books/BookCard';
import './BookDetailsPage.css';

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5198/api/Book/${id}`);
        setBook(res.data);
        console.log(res.data)
        // Fetch all books and filter related by genre
        const allBooksRes = await axios.get("http://localhost:5198/api/Book/GetAll");
        const related = allBooksRes.data
          .filter(b => b.id !== id && b.genre === res.data.genre)
          .slice(0, 4);
        setRelatedBooks(related);
      } catch (err) {
        console.error("Failed to fetch book:", err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="book-details-page loading">
        <div className="container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-details-page not-found">
        <div className="container">
          <h2>Book Not Found</h2>
          <p>Sorry, the book you're looking for doesn't exist or has been removed.</p>
          <a href="/catalog" className="btn-primary">Browse Books</a>
        </div>
      </div>
    );
  }

  return (
    <div className="book-details-page">
      <div className="container">
        <BookDetails book={book} />

        {relatedBooks.length > 0 && (
          <div className="related-books">
            <h2>You May Also Like</h2>
            <div className="related-books-grid">
              {relatedBooks.map(b => (
                <div key={b.id} className="related-book-item">
                  <BookCard book={b} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailsPage;
