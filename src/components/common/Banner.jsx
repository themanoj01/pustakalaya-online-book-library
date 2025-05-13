import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './Banner.css';

const Banner = ({ message, duration = 0, type = 'default' }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // If duration is set, automatically hide the banner after the specified time
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={`banner ${type}`}>
      <div className="container banner-container">
        <p>{message}</p>
        <button 
          className="banner-close" 
          onClick={handleClose}
          aria-label="Close banner"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Banner;