import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Banner from '../components/common/Banner';
import BookCard from '../components/books/BookCard';
import { books, categories } from '../data/books';
import './HomePage.css';

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [displayBooks, setDisplayBooks] = useState([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  
  // Sample announcements for demonstration
  const announcements = [
    { id: 1, message: "Summer Sale: 20% off all books until June 30th!", type: "sale" },
    { id: 2, message: "New releases from bestselling authors now available!", type: "new" },
    { id: 3, message: "Free shipping on orders over $35", type: "default" }
  ];
  
  useEffect(() => {
    // Set a random announcement
    const randomIndex = Math.floor(Math.random() * announcements.length);
    setCurrentAnnouncement(announcements[randomIndex]);
    
    // Rotate announcements every 10 seconds
    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * announcements.length);
      setCurrentAnnouncement(announcements[newIndex]);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    filterBooks(activeCategory);
  }, [activeCategory]);
  
  const filterBooks = (category) => {
    let filtered = [];
    
    switch (category) {
      case 'bestsellers':
        filtered = books.filter(book => book.bestSeller);
        break;
      case 'award-winners':
        filtered = books.filter(book => book.awardWinner);
        break;
      case 'new-releases':
        filtered = books.filter(book => book.newRelease);
        break;
      case 'deals':
        filtered = books.filter(book => book.discount);
        break;
      default:
        filtered = books;
        break;
    }
    
    setDisplayBooks(filtered);
  };

  return (
    <div className="home-page">
      {currentAnnouncement && (
        <Banner 
          message={currentAnnouncement.message} 
          type={currentAnnouncement.type}
        />
      )}
      
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Discover Your Next Favorite Book</h1>
            <p>Explore our curated collection of books for every reader</p>
            <div className="hero-cta">
              <Link to="/catalog" className="btn-primary">Browse Books</Link>
              <Link to="/register" className="btn-outline">Become a Member</Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="categories-section">
        <div className="container">
          <div className="categories-tabs">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
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
            <h2>{categories.find(c => c.id === activeCategory)?.name || 'Featured Books'}</h2>
            <Link to={`/catalog?category=${activeCategory}`} className="view-all">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="books-grid">
            {displayBooks.slice(0, 4).map(book => (
              <div key={book.id} className="book-item">
                <BookCard book={book} />
              </div>
            ))}
          </div>
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
                <Link to="/catalog?genre=Science Fiction" className="category-link">
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
            <h2>Become a BookHaven Member</h2>
            <p>Join our community of book lovers and enjoy exclusive benefits:</p>
            <ul className="membership-benefits">
              <li>Save favorite books to your personal bookshelf</li>
              <li>Get personalized book recommendations</li>
              <li>Earn rewards on every purchase</li>
              <li>Receive early access to new releases</li>
              <li>Participate in member-only events</li>
            </ul>
            <Link to="/register" className="btn-primary">Join Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;