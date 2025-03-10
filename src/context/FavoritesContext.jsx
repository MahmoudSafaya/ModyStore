import { useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { createContext, useContext, useState } from "react";
import toast from 'react-hot-toast';

// Secret key for hashing (keep this secure)
const SECRET_KEY = import.meta.env.VITE_FAVS_SECRET_KEY;

// Function to encrypt data
const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Function to decrypt data
const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Create context
const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Function to save favorites to local storage
  const saveFavoritesItems = (favItmes) => {
    const encryptedFAVs = encryptData(favItmes);
    localStorage.setItem('mody-favorites', encryptedFAVs);
  };

  // Function to get favorites from local storage
  const getFavoritesItems = () => {
    const encryptedFAVs = localStorage.getItem('mody-favorites');
    if (!encryptedFAVs) return null;

    try {
      return decryptData(encryptedFAVs);
    } catch (error) {
      console.error('Failed to decrypt favorites data:', error);
      return null;
    }
  };

  // Add item to favorites
  const addToFavorites = (item) => {
    if (favorites.find(favItem => favItem._id === item._id)) {
        return false;
    }
    const newFAVs = [...favorites, item];
    setFavorites(newFAVs);
    saveFavoritesItems(newFAVs);
    toast.success('تم إضافة المنتج إلى قائمة المفضله.')
};

  const removeFromFavorites = (itemId) => {
    const newFAVs = favorites.filter(item => item._id !== itemId);
    setFavorites(newFAVs);
    saveFavoritesItems(newFAVs);
    toast.success('تم إزالة المنتج من قائمة المفضله.', {
      style: {
        padding: '16px',
        color: '#485363',
      },
      iconTheme: {
        primary: '#485363',
        secondary: '#FFFFFF',
      },
    });
  };

  // Load cart when component mounts
      useEffect(() => {
        const savedFavorites = getFavoritesItems();
        if (savedFavorites) {
          setFavorites(savedFavorites);
        }
      }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites, saveFavoritesItems, getFavoritesItems, addToFavorites, removeFromFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use Favorites
export const useFavorites = () => useContext(FavoritesContext);
