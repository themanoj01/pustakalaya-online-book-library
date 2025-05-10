import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">BookHaven</h3>
            <p>Your private book library for exclusive literature and treasured volumes. Discover, explore, and add to your personal collection.</p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links">
              <li><Link to="/catalog">All Books</Link></li>
              <li><Link to="/catalog?category=bestsellers">Bestsellers</Link></li>
              <li><Link to="/catalog?category=award-winners">Award Winners</Link></li>
              <li><Link to="/catalog?category=new-releases">New Releases</Link></li>
              <li><Link to="/catalog?category=deals">Deals</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Customer Service</h4>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/shipping">Shipping Information</Link></li>
              <li><Link to="/returns">Returns & Refunds</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Contact Info</h4>
            <div className="footer-contact">
              <p><MapPin size={16} /> 123 BookStore Avenue, Reading, BK 12345</p>
              <p><Phone size={16} /> (123) 456-7890</p>
              <p><Mail size={16} /> info@bookhaven.com</p>
            </div>
            <div className="footer-newsletter">
              <h4 className="footer-heading">Newsletter</h4>
              <p>Stay updated with our latest offers</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Your email address" required />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} BookHaven. All rights reserved.</p>
          </div>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;