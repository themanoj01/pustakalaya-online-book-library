import React, { createContext, useState, useContext, useEffect } from 'react';
import { users } from '../data/users';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is stored in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    setError(null);
    
    // Find user with matching email and password
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // Create a user object without the password
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    } else {
      setError('Invalid email or password');
      return null;
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Register function
  const register = (name, email, password) => {
    setError(null);
    
    // Check if email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      setError('Email already in use');
      return null;
    }

    // In a real app, you would make an API call to register the user
    // Here we're just simulating it with the mock data
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password, // In a real app, this would be hashed
      role: 'member',
      joinDate: new Date().toISOString().split('T')[0],
      bookmarks: [],
      orders: []
    };

    // In a real app, you would add the user to the database
    // For this mock, we'll just return the new user object
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  };

  // Update user profile
  const updateProfile = (updates) => {
    if (!currentUser) return null;

    // In a real app, you would make an API call to update the user's profile
    // Here we're just simulating it with the mock data
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    updateProfile,
    error,
    setError,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;