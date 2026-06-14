import React, { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem('storeMode') || 'B2C');
  const [settings, setSettings] = useState(null);
  const [cart, setCart] = useState(() => {
    const localCart = localStorage.getItem('agriCart');
    return localCart ? JSON.parse(localCart) : [];
  });
  
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.settings.get();
        setSettings(data);
        if (!localStorage.getItem('storeMode') && data.defaultMode) {
          setMode(data.defaultMode);
          localStorage.setItem('storeMode', data.defaultMode);
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    localStorage.setItem('agriCart', JSON.stringify(cart));
  }, [cart]);

  const toggleMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem('storeMode', newMode);
    showToast(`Switched to ${newMode === 'B2B' ? 'Wholesale (B2B)' : 'Retail (B2C)'} Mode`, 'success');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product._id === product._id);
      if (existingItem) {
        const newQty = Math.min(product.stock, existingItem.quantity + quantity);
        showToast(`Updated ${product.name} quantity in Cart`, 'success');
        return prevCart.map((item) =>
          item.product._id === product._id ? { ...item, quantity: newQty } : item
        );
      } else {
        showToast(`Added ${product.name} to Cart`, 'success');
        return [...prevCart, { product, quantity: Math.min(product.stock, quantity) }];
      }
    });
  };

  const updateCartQty = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product._id !== productId));
    showToast('Removed item from Cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <AppContext.Provider
      value={{
        mode,
        toggleMode,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        settings,
        setSettings,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
