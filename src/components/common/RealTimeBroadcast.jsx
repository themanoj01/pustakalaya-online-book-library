import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BookOpen } from "lucide-react";
import "./RealTimeBroadcast.css";

const RealTimeBroadcast = ({ message, onClose, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`broadcast ${isExiting ? "exiting" : ""}`}>
      <div className="broadcast-icon">
        <BookOpen size={18} />
      </div>
      <p className="broadcast-message">{message}</p>
    </div>
  );
};

const RealTimeBroadcastContainer = () => {
  const [currentBroadcast, setCurrentBroadcast] = useState(null);
  const broadcastQueue = useRef([]);

  useEffect(() => {
    const fetchAndQueue = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5198/pustakalaya/orders/latest-orders"
        );
        const newBroadcasts = res.data.map((order) => {
          const firstBook = order.orderedItems[0]?.bookTitle;
          return {
            id: `${order.orderId}-${Date.now()}`,
            message: `A user just ordered "${firstBook}"`,
          };
        });
        broadcastQueue.current.push(...newBroadcasts);
        triggerNextBroadcast();
      } catch (err) {
        console.error("Failed to fetch broadcast orders", err);
      }
    };

    const initialTimer = setTimeout(fetchAndQueue, 5000);
    const intervalTimer = setInterval(fetchAndQueue, 6000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  const triggerNextBroadcast = () => {
    if (!currentBroadcast && broadcastQueue.current.length > 0) {
      const next = broadcastQueue.current.shift();
      setCurrentBroadcast(next);
    }
  };

  const handleClose = () => {
    setCurrentBroadcast(null);
    setTimeout(() => {
      triggerNextBroadcast();
    }, 300); // small delay to allow exit animation
  };

  return (
    <div className="broadcast-container">
      {currentBroadcast && (
        <RealTimeBroadcast
          key={currentBroadcast.id}
          message={currentBroadcast.message}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default RealTimeBroadcastContainer;
