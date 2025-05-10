import React, { createContext, useContext, useState, useEffect } from 'react';
import { books } from '../data/books';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const { currentUser } = useAuth();

  // Load cart from localStorage on initial load
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCart(parsedCart);
    }
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Calculate total items and price
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    setTotalItems(itemCount);
    
    const price = cart.reduce((total, item) => {
      const book = books.find(b => b.id === item.bookId);
      return total + (book ? book.price * item.quantity : 0);
    }, 0);
    setTotalPrice(price);
    
    // Calculate discount
    // 5% for 5+ books
    let discountAmount = 0;
    if (itemCount >= 5) {
      discountAmount = price * 0.05;
    }
    
    // Additional 10% discount for users with 10+ completed orders (would come from backend in real app)
    if (currentUser && currentUser.ordersMilestone && currentUser.ordersMilestone >= 10) {
      discountAmount += price * 0.1;
    }
    
    setDiscount(discountAmount);
    
  }, [cart, currentUser]);

  const addToCart = (bookId, quantity = 1) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    setCart(prevCart => {
      // Check if book is already in cart
      const existingItem = prevCart.find(item => item.bookId === bookId);
      
      if (existingItem) {
        // Update quantity if book already exists in cart
        return prevCart.map(item => 
          item.bookId === bookId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new item if book is not in cart
        return [...prevCart, { 
          bookId, 
          quantity, 
          price: book.price,
          title: book.title,
          author: book.author,
          coverImage: book.coverImage
        }];
      }
    });
  };

  const removeFromCart = (bookId) => {
    setCart(prevCart => prevCart.filter(item => item.bookId !== bookId));
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.bookId === bookId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    totalItems,
    totalPrice,
    discount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;