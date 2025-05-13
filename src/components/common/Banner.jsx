import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./Banner.css";

const Banner = ({ message, type = "default", duration = 0 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
  }, [message]);

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={`banner banner--${type}`}>
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
