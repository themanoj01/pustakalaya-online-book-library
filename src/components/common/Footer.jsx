import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';
import toast from 'react-hot-toast';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const subscribe = (e, email)=>{
    e.preventDefault();
    if(email != null){
      toast.success("Thank you for your subscription");
    }
    else{
      toast.error("Field Should not be null");
    }
  }
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Pustakalaya</h3>
            <p>Your private book library for exclusive literature and treasured volumes. Discover, explore, and add to your personal collection.</p>
            <div className="footer-social">
              <a href="www.facebook.com" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="www.twitter.com" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="www.instagram.com" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="www.linkedin.com" aria-label="LinkedIn"><Linkedin size={20} /></a>
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
            <h4 className="footer-heading">Contact Info</h4>
            <div className="footer-contact">
              <p><MapPin size={16} /> Putalisadak, Kathmandu</p>
              <p><Phone size={16} /> (977) 9827732079</p>
              <p><Mail size={16} /> pustakalaya@gmail.com</p>
            </div>
            <div className="footer-newsletter">
              <h4 className="footer-heading">Newsletter</h4>
              <p>Stay updated with our latest offers</p>
              <form className="newsletter-form" onSubmit={(e) => subscribe(e, email)}>
                <input type="email" placeholder="Your email address" onChange={(e)=> setEmail(e.target.value)} required />
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