import React, { createContext, useState } from "react";
import { useContext } from "react";
import clothesImage from '../assets/categories/clothes.svg'; // Adjust the path as needed


export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const storeMainNav = [
    { label: "الرئيسية", link: '/' },
    { label: "متجرنا", link: '/products' },
    { label: "من نحن", link: '/about-us' },
    { label: "الشحن والاسترجاع", link: '/shippment' },
  ];
  const modyStoreCategories = [
    { name: "ملابس", products: 8, image: "category-image.jpg", icon: clothesImage, link: '/product-category/clothes' },
    { name: "ملابس اطفال", products: 24, image: "category-image.jpg", icon: clothesImage, link: '/kids-clothes' },
    { name: "الكترونيات", products: 7, image: "category-image.jpg", icon: clothesImage, link: '/electronics' },
    { name: "شنط", products: 5, image: "category-image.jpg", icon: clothesImage, link: '/bags' },
    { name: "أحذية", products: 15, image: "category-image.jpg", icon: clothesImage, link: '/shoes' },
  ];

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  return (
    <StoreContext.Provider value={{ storeMainNav, modyStoreCategories, products, setProducts, isCartOpen, setIsCartOpen, toggleCart }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
