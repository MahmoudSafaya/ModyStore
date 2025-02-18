import { createContext, useContext, useEffect, useState } from "react";

// Create context
const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  // Save to localStorage whenever favorites change
  const saveToFavorites = () => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  // Hash function (SHA-256)
  const hashProductId = async (id) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(id);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  // Add to favorites
  const addToFavorites = async (product) => {
    const hashedId = await hashProductId(product.id);
    if (!favorites.some((item) => item.hashedId === hashedId)) {
      setFavorites([...favorites, { ...product, hashedId }]);
      saveToFavorites();
    }
  };

  // Remove from favorites
  const removeFromFavorites = (hashedId) => {
    setFavorites(favorites.filter((item) => item.hashedId !== hashedId));
    saveToFavorites();
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use Favorites
export const useFavorites = () => useContext(FavoritesContext);
