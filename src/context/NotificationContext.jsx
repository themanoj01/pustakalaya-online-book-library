import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification
  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const newNotification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  };

  // Remove a notification by id
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Add a broadcast notification (for real-time events)
  const addBroadcast = (message) => {
    return addNotification(message, 'broadcast', 5000);
  };

  // Add a banner announcement
  const addBanner = (message, duration = 0) => {
    return addNotification(message, 'banner', duration);
  };

  // Success notification helper
  const success = (message) => {
    return addNotification(message, 'success');
  };

  // Error notification helper
  const error = (message) => {
    return addNotification(message, 'error');
  };

  // Warning notification helper
  const warning = (message) => {
    return addNotification(message, 'warning');
  };

  // Info notification helper
  const info = (message) => {
    return addNotification(message, 'info');
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    addBroadcast,
    addBanner,
    success,
    error,
    warning,
    info
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export default NotificationContext;