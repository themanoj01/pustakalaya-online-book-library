import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import axios from "axios";

import Banner from "../components/common/Banner";
import BookCard from "../components/books/BookCard";
import { categories } from "../data/books";

import "./HomePage.css";

const HomePage = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [displayBooks, setDisplayBooks] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [announcements, setAnnouncements] = useState([]);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [bookFetchError, setBookFetchError] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5198/api/Announcement/GetAll"
      );
      const validAnnouncements = response.data.filter(
        (a) => !a.expiresAt || new Date(a.expiresAt) > new Date()
      );
      setAnnouncements(validAnnouncements);
      setCurrentAnnouncementIndex(0);
      console.log("Fetched announcements:", validAnnouncements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const fetchBooks = async (retries = 3) => {
    setIsLoadingBooks(true);
    setBookFetchError(null);
    try {
      const response = await axios.get("http://localhost:5198/api/Book/GetAll");
      const books = Array.isArray(response.data) ? response.data : [];
      setAllBooks(books);
      setDisplayBooks(books);
      console.log("Fetched books:", books);
    } catch (error) {
      console.error("Error fetching books:", error);
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        setTimeout(() => fetchBooks(retries - 1), 2000);
      } else {
        setBookFetchError("Failed to load books. Please try again later.");
      }
    } finally {
      setIsLoadingBooks(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchAnnouncements();
    const pollInterval = setInterval(fetchAnnouncements, 30000);
    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    if (announcements.length > 0) {
      const interval = setInterval(() => {
        setCurrentAnnouncementIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % announcements.length;
          console.log(
            `Rotating to announcement index ${newIndex}:`,
            announcements[newIndex]
          );
          return newIndex;
        });
      }, 6000);
      return () => clearInterval(interval);
    } else {
      console.log("No announcements to rotate.");
    }
  }, [announcements]);

  const getBannerType = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("sale")) return "sale";
    if (lowerTitle.includes("new")) return "new";
    if (lowerTitle.includes("important") || lowerTitle.includes("urgent"))
      return "important";
    return "default";
  };

  useEffect(() => {
    filterBooks(activeCategory);
  }, [activeCategory, allBooks]);

  const filterBooks = (category) => {
    console.log(
      "Filtering books for category:",
      category,
      "Total books:",
      allBooks.length
    );
    let filtered = [];
    switch (category) {
      case "bestsellers":
        filtered = allBooks.filter((book) => book.totalSold >= 50);
        break;
      case "award-winners":
        filtered = allBooks.filter((book) => book.awardWinner === true);
        break;
      case "new-releases":
        filtered = allBooks.filter((book) => {
          if (!book.publicationDate) return false;
          const pubDate = new Date(book.publicationDate);
          const now = new Date();
          return (now - pubDate) / (1000 * 60 * 60 * 24) <= 90;
        });
        break;
      case "deals":
        filtered = allBooks.filter((book) => book.discount > 0);
        break;
      default:
        filtered = allBooks;
        break;
    }
    console.log("Filtered books:", filtered);
    setDisplayBooks(filtered);
  };

  const currentAnnouncement = announcements[currentAnnouncementIndex];

  return (
    <div className="home-page">
      {announcements.length > 0 && currentAnnouncement && (
        <Banner
          key={currentAnnouncement.id}
          message={`${currentAnnouncement.title}: ${currentAnnouncement.content}`}
          type={getBannerType(currentAnnouncement.title)}
          duration={6000}
        />
      )}

      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Discover Your Next Favorite Book</h1>
            <p>Explore our curated collection of books for every reader</p>
            <div className="hero-cta">
              <Link to="/catalog" className="btn-primary">
                Browse Books
              </Link>
              <Link to="/register" className="btn-outline">
                Become a Member
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <div className="categories-tabs">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-tab ${
                  activeCategory === category.id ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-books">
        <div className="container">
          <div className="section-header">
            <h2>
              {categories.find((c) => c.id === activeCategory)?.name ||
                "Featured Books"}
            </h2>
            <Link
              to={`/catalog?category=${activeCategory}`}
              className="view-all"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {isLoadingBooks ? (
            <div className="loading">Loading books...</div>
          ) : bookFetchError ? (
            <div className="error">{bookFetchError}</div>
          ) : displayBooks.length === 0 ? (
            <div className="no-books">No books available in this category.</div>
          ) : (
            <div className="books-grid">
              {displayBooks.slice(0, 4).map((book) => (
                <div key={book.id} className="book-item">
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="featured-categories">
        <div className="container">
          <h2>Browse by Category</h2>
          <div className="category-cards">
            <div className="category-card fiction">
              <div className="category-card-content">
                <h3>Fiction</h3>
                <p>Explore imaginative worlds and compelling stories</p>
                <Link to="/catalog?genre=Fiction" className="category-link">
                  Browse Fiction <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            <div className="category-card non-fiction">
              <div className="category-card-content">
                <h3>Non-Fiction</h3>
                <p>Discover real-world knowledge and insights</p>
                <Link to="/catalog?genre=Non-Fiction" className="category-link">
                  Browse Non-Fiction <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            <div className="category-card mystery">
              <div className="category-card-content">
                <h3>Mystery & Thriller</h3>
                <p>Unravel suspenseful tales and thrilling adventures</p>
                <Link to="/catalog?genre=Thriller" className="category-link">
                  Browse Mystery & Thriller <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            <div className="category-card scifi">
              <div className="category-card-content">
                <h3>Science Fiction</h3>
                <p>Venture into futuristic worlds and scientific wonders</p>
                <Link
                  to="/catalog?genre=Science Fiction"
                  className="category-link"
                >
                  Browse Sci-Fi <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="membership-section">
        <div className="container">
          <div className="membership-content">
            <h2>Become a Pustakalaya Member</h2>
            <p>
              Join our community of book lovers and enjoy exclusive benefits:
            </p>
            <ul className="membership-benefits">
              <li>Save favorite books to your personal bookshelf</li>
              <li>Get personalized book recommendations</li>
              <li>Earn rewards on every purchase</li>
              <li>Receive early access to new releases</li>
              <li>Participate in member-only events</li>
            </ul>
            <Link to="/register" className="btn-primary">
              Join Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
