import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

import './Header.css';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('JwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.Name);
        setUserRole(decoded.role || 'member');
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('JwtToken');
    window.location.href = '/login';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="header-logo">
          <Link to="/">
            <h1>Pustakalaya</h1>
          </Link>
        </div>

        <div className={`header-search ${isScrolled ? 'compact' : ''}`}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button" aria-label="Search">
              <Search size={20} />
            </button>
          </form>
        </div>

        <div className="header-mobile-toggle">
          <button onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><Link to="/catalog">Books</Link></li>
            <li><Link to="/catalog?category=bestsellers">Bestsellers</Link></li>
            <li><Link to="/catalog?category=new-releases">New Releases</Link></li>
            <li><Link to="/catalog?category=deals">Deals</Link></li>

            <li className="header-cart">
              <Link to="/cart">
                <ShoppingCart size={20} />
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>
            </li>

            <li className="header-user">
              {userName ? (
                <div className="user-dropdown">
                  <button className="user-dropdown-toggle">
                    <User size={20} />
                    <span>{userName}</span>
                  </button>
                  <div className="user-dropdown-menu">
                    {userRole === 'admin' && <Link to="/admin">Admin Dashboard</Link>}
                    {userRole === 'staff' && <Link to="/staff">Staff Portal</Link>}
                    <Link to="/member-dashboard">Dashboard</Link>
                    <Link to="/profile">Profile</Link>
                    {/* <Link to="/orders">Orders</Link> */}
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              ) : (
                <div className="auth-links">
                  <Link to="/login">Login</Link>
                  <Link to="/register" className="btn-small">Register</Link>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
