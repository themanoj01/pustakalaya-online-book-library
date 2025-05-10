import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import './RealTimeBroadcast.css';

const RealTimeBroadcast = ({ message, onClose, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      
      // Give time for exit animation before removing from DOM
      setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 300);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`broadcast ${isExiting ? 'exiting' : ''}`}>
      <div className="broadcast-icon">
        <BookOpen size={18} />
      </div>
      <p className="broadcast-message">{message}</p>
    </div>
  );
};

const RealTimeBroadcastContainer = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  
  // This would be connected to a real-time service in a real app
  // For demo purposes, we'll simulate new broadcasts every 20 seconds
  useEffect(() => {
    const simulateBroadcast = () => {
      const books = [
        "The Silent Patient",
        "Educated",
        "Project Hail Mary",
        "The Midnight Library",
        "Klara and the Sun"
      ];
      
      const book = books[Math.floor(Math.random() * books.length)];
      const newBroadcast = {
        id: Date.now(),
        message: `"${book}" was just purchased!`
      };
      
      setBroadcasts(prev => [...prev, newBroadcast]);
    };
    
    // Initial broadcast after 5 seconds
    const initialTimer = setTimeout(simulateBroadcast, 5000);
    
    // Subsequent broadcasts every 20 seconds
    const intervalTimer = setInterval(simulateBroadcast, 20000);
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);
  
  const handleBroadcastClose = (id) => {
    setBroadcasts(prev => prev.filter(broadcast => broadcast.id !== id));
  };
  
  return (
    <div className="broadcast-container">
      {broadcasts.map(broadcast => (
        <RealTimeBroadcast
          key={broadcast.id}
          message={broadcast.message}
          onClose={() => handleBroadcastClose(broadcast.id)}
        />
      ))}
    </div>
  );
};

export default RealTimeBroadcastContainer;