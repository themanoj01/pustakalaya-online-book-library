import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FilterBar from '../components/books/FilterBar';
import BookCard from '../components/books/BookCard';
import Pagination from '../components/books/Pagination';
import { books } from '../data/books';
import './CatalogPage.css';

const CatalogPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(12);
  const [sortOption, setSortOption] = useState('relevance');
  const [filters, setFilters] = useState({
    search: queryParams.get('search') || '',
    author: '',
    genre: queryParams.get('genre') || '',
    availability: true,
    priceRange: { min: null, max: null },
    rating: 0,
    format: '',
    publisher: ''
  });
  
  // Initial filter based on URL parameters
  useEffect(() => {
    const category = queryParams.get('category');
    if (category) {
      // Handle category filtering based on URL parameter
      switch (category) {
        case 'bestsellers':
          setFilteredBooks(books.filter(book => book.bestSeller));
          break;
        case 'award-winners':
          setFilteredBooks(books.filter(book => book.awardWinner));
          break;
        case 'new-releases':
          setFilteredBooks(books.filter(book => book.newRelease));
          break;
        case 'deals':
          setFilteredBooks(books.filter(book => book.discount));
          break;
        default:
          applyFilters();
          break;
      }
    } else {
      applyFilters();
    }
  }, [location.search]);
  
  // Apply filters function
  const applyFilters = () => {
    let result = [...books];
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.isbn.toLowerCase().includes(searchTerm) ||
        (book.description && book.description.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filter by author
    if (filters.author) {
      const authorTerm = filters.author.toLowerCase();
      result = result.filter(book => 
        book.author.toLowerCase().includes(authorTerm)
      );
    }
    
    // Filter by genre
    if (filters.genre) {
      result = result.filter(book => book.genre === filters.genre);
    }
    
    // Filter by availability
    if (filters.availability) {
      result = result.filter(book => book.available);
    }
    
    // Filter by price range
    if (filters.priceRange.min !== null) {
      result = result.filter(book => book.price >= filters.priceRange.min);
    }
    
    if (filters.priceRange.max !== null) {
      result = result.filter(book => book.price <= filters.priceRange.max);
    }
    
    // Filter by rating
    if (filters.rating > 0) {
      result = result.filter(book => book.rating >= filters.rating);
    }
    
    // Filter by format
    if (filters.format) {
      result = result.filter(book => book.format === filters.format);
    }
    
    // Filter by publisher
    if (filters.publisher) {
      result = result.filter(book => 
        book.publisher.toLowerCase().includes(filters.publisher.toLowerCase())
      );
    }
    
    // Apply sorting
    result = sortBooks(result, sortOption);
    
    setFilteredBooks(result);
    setCurrentPage(1); // Reset to first page
  };
  
  // Sort books based on selected option
  const sortBooks = (books, option) => {
    switch (option) {
      case 'title_asc':
        return [...books].sort((a, b) => a.title.localeCompare(b.title));
      case 'title_desc':
        return [...books].sort((a, b) => b.title.localeCompare(a.title));
      case 'price_asc':
        return [...books].sort((a, b) => a.price - b.price);
      case 'price_desc':
        return [...books].sort((a, b) => b.price - a.price);
      case 'rating_desc':
        return [...books].sort((a, b) => b.rating - a.rating);
      case 'date_desc':
        return [...books].sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
      case 'date_asc':
        return [...books].sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));
      default:
        return books; // relevance (no sorting)
    }
  };
  
  // Get current page books
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  
  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <div className="catalog-page">
      <div className="container">
        <div className="catalog-header">
          <h1>Book Catalog</h1>
          <p>
            {filteredBooks.length === 0 ? (
              'No books found matching your criteria.'
            ) : (
              `Showing ${indexOfFirstBook + 1}-${Math.min(indexOfLastBook, filteredBooks.length)} of ${filteredBooks.length} books`
            )}
          </p>
        </div>
        
        <FilterBar 
          filters={filters}
          setFilters={setFilters}
          sortOption={sortOption}
          setSortOption={setSortOption}
          applyFilters={applyFilters}
        />
        
        {filteredBooks.length === 0 ? (
          <div className="no-results">
            <h2>No books found</h2>
            <p>Try adjusting your filters or search term to find books.</p>
          </div>
        ) : (
          <>
            <div className="catalog-grid">
              {currentBooks.map(book => (
                <div key={book.id} className="catalog-book-item">
                  <BookCard book={book} />
                </div>
              ))}
            </div>
            
            {filteredBooks.length > booksPerPage && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={Math.ceil(filteredBooks.length / booksPerPage)}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;