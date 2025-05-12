import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import FilterBar from "../components/books/FilterBar";
import BookCard from "../components/books/BookCard";
import Pagination from "../components/books/Pagination";
import "./CatalogPage.css";

const CatalogPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(12);
  const [sortOption, setSortOption] = useState("relevance");
  const [filters, setFilters] = useState({
    search: queryParams.get("search") || "",
    author: queryParams.get("author") || "",
    genre: queryParams.get("genre") || "",
    availability: queryParams.get("availability") === "true",
    priceRange: {
      min: queryParams.get("minPrice")
        ? parseFloat(queryParams.get("minPrice"))
        : null,
      max: queryParams.get("maxPrice")
        ? parseFloat(queryParams.get("maxPrice"))
        : null,
    },
    rating: queryParams.get("minRating")
      ? parseFloat(queryParams.get("minRating"))
      : 0,
    format: queryParams.get("format") || "",
    publisher: queryParams.get("publisher") || "",
  });
  const [activeTab, setActiveTab] = useState(
    queryParams.get("category") || "all-books"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllBooks();
  }, []);

  useEffect(() => {
    applyFrontendFilters();
  }, [filters, sortOption, activeTab, allBooks]);

  const fetchAllBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5198/api/Book/GetAll");
      const normalized = (response.data || []).map((book) => ({
        Id: book.id ?? `temp-id-${Math.random()}`,
        Title: book.title ?? "Unknown Title",
        Authors: book.authors ?? ["Unknown Author"],
        ISBN: book.isbn ?? "",
        Price: Number(book.price) ?? 0,
        Stock: Number(book.stock) ?? 0,
        Language: book.language ?? "Unknown Language",
        Format: book.format ?? "Unknown Format",
        Publisher: book.publisher ?? "Unknown Publisher",
        PublicationDate: book.publicationDate ?? new Date().toISOString(),
        Description: book.description ?? "No description available.",
        Rating: Number(book.rating) ?? 0,
        BookImage: book.bookImage ?? "/placeholder-image.jpg",
        TotalSold: Number(book.totalSold) ?? 0,
        Genres: book.genres ?? ["Unknown Genre"],
        AwardWinner: book.awardWinner ?? false,
        Category: book.category ?? "all-books",
        DiscountId: book.discountId ?? null,
      }));
      setAllBooks(normalized);
    } catch (error) {
      console.error("Error fetching books:", error);
      setAllBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFrontendFilters = () => {
    let result = [...allBooks];
    const now = new Date();

    switch (activeTab?.toLowerCase()) {
      case "bestsellers":
        result = result.sort((a, b) => b.TotalSold - a.TotalSold).slice(0, 5);
        break;
      case "award-winners":
        result = result.filter((b) => b.AwardWinner);
        break;
      case "new-releases":
        result = result.filter(
          (b) =>
            new Date(b.PublicationDate) >=
            new Date(now.setMonth(now.getMonth() - 3))
        );
        break;
      case "new-arrivals":
        result = result.filter(
          (b) =>
            new Date(b.PublicationDate) >=
            new Date(now.setMonth(now.getMonth() - 1))
        );
        break;
      case "coming-soon":
        result = result.filter((b) => new Date(b.PublicationDate) > new Date());
        break;
      case "deals":
        result = result.filter((b) => b.DiscountId);
        break;
      default:
        break;
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (book) =>
          book.Title.toLowerCase().includes(searchLower) ||
          book.Authors.join(" ").toLowerCase().includes(searchLower)
      );
    }

    if (filters.author) {
      const authorLower = filters.author.toLowerCase();
      result = result.filter((book) =>
        book.Authors.some((author) =>
          author.toLowerCase().includes(authorLower)
        )
      );
    }

    if (filters.genre) {
      result = result.filter((book) => book.Genres.includes(filters.genre));
    }

    if (filters.availability) {
      result = result.filter((book) => book.Stock > 0);
    }

    if (filters.priceRange.min !== null) {
      result = result.filter((book) => book.Price >= filters.priceRange.min);
    }
    if (filters.priceRange.max !== null) {
      result = result.filter((book) => book.Price <= filters.priceRange.max);
    }

    if (filters.rating > 0) {
      result = result.filter((book) => book.Rating >= filters.rating);
    }

    if (filters.format) {
      result = result.filter((book) => book.Format === filters.format);
    }

    if (filters.publisher) {
      result = result.filter((book) => book.Publisher === filters.publisher);
    }

    result = sortBooks(result, sortOption);
    setFilteredBooks(result);
    setCurrentPage(1);
  };

  const sortBooks = (books, option) => {
    const sorted = [...books];
    switch (option) {
      case "price_asc":
        return sorted.sort((a, b) => a.Price - b.Price);
      case "price_desc":
        return sorted.sort((a, b) => b.Price - a.Price);
      case "title_asc":
        return sorted.sort((a, b) => a.Title.localeCompare(b.Title));
      case "title_desc":
        return sorted.sort((a, b) => b.Title.localeCompare(a.Title));
      case "rating_desc":
        return sorted.sort((a, b) => b.Rating - a.Rating);
      case "date_desc":
        return sorted.sort(
          (a, b) => new Date(b.PublicationDate) - new Date(a.PublicationDate)
        );
      case "date_asc":
        return sorted.sort(
          (a, b) => new Date(a.PublicationDate) - new Date(b.PublicationDate)
        );
      case "popularity":
        return sorted.sort((a, b) => b.TotalSold - a.TotalSold);
      default:
        return sorted;
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const applyFilters = () => {
    applyFrontendFilters();
  };

  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  return (
    <div className="catalog-page">
      <div className="container">
        <div className="catalog-header">
          <h1>Book Catalog</h1>
          <p>
            {loading
              ? "Loading..."
              : filteredBooks.length === 0
              ? "No books found matching your criteria."
              : `Showing ${Math.min(
                  (currentPage - 1) * booksPerPage + 1,
                  filteredBooks.length
                )}-${Math.min(
                  currentPage * booksPerPage,
                  filteredBooks.length
                )} of ${filteredBooks.length} books`}
          </p>
        </div>

        <div className="catalog-tabs">
          {[
            "all-books",
            "bestsellers",
            "award-winners",
            "new-releases",
            "new-arrivals",
            "coming-soon",
            "deals",
          ].map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>

        <FilterBar
          filters={filters}
          setFilters={setFilters}
          sortOption={sortOption}
          setSortOption={setSortOption}
          applyFilters={applyFilters}
        />

        {loading ? (
          <div className="loader">Loading...</div>
        ) : currentBooks.length === 0 ? (
          <div className="no-results">
            <h2>No books found</h2>
            <p>Try adjusting your filters or search term to find books.</p>
          </div>
        ) : (
          <>
            <div className="catalog-grid">
              {currentBooks.map((book) => (
                <div key={book.Id} className="catalog-book-item">
                  <BookCard book={book} />
                </div>
              ))}
            </div>
            {filteredBooks.length > booksPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredBooks.length / booksPerPage)}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
