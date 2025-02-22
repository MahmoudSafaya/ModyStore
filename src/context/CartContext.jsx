import CryptoJS from 'crypto-js';
import React, { createContext, useState, useEffect } from "react";
import { useContext } from "react";

// Secret key for hashing (keep this secure)
const SECRET_KEY = import.meta.env.VITE_CART_SECRET_KEY;

// Function to encrypt data
const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Function to decrypt data
const decryptData = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);


    // Calculate total price
    const calculateTotalPrice = (cartItems) => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Function to save cart to local storage
    const saveCartItems = (cart) => {
        const encryptedCart = encryptData(cart);
        localStorage.setItem('mody_store_cart', encryptedCart);
        setTotalPrice(calculateTotalPrice(cart)); // ✅ Update total price
    };

    // Function to get cart from local storage
    const loadCartItems = () => {
        const encryptedCart = localStorage.getItem('mody_store_cart');
        if (!encryptedCart) return null;

        try {
            const savedCart = decryptData(encryptedCart);
            setCart(savedCart);
            setTotalPrice(calculateTotalPrice(savedCart)); // ✅ Update total price
        } catch (error) {
            console.error('Failed to decrypt cart data:', error);
            return null;
        }
    };

    // Add item to cart
    const addToCart = (item) => {
        if (cart.find(cartItem => cartItem.id === item.id)) {
            return false;
        }
        const newCart = [...cart, item];
        setCart(newCart);
        setTotalPrice(calculateTotalPrice(newCart)); // ✅ Update total price
        saveCartItems(newCart);
    };

    // Increase item quantity
    const increaseQuantity = (itemId) => {
        let newCart = cart.map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1, quantityPrice: item.quantityPrice + item.price } : item
        )

        setCart(newCart);
        setTotalPrice(calculateTotalPrice(newCart)); // ✅ Update total price
        saveCartItems(newCart);
    };
    // Decrease item quantity (or remove if it reaches 0)
    const decreaseQuantity = (itemId) => {
        let newCart = cart.map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity - 1, quantityPrice: item.quantityPrice - item.price } : item
        ).filter((item) => item.quantity > 0); // remove item if quantity reach 0

        setCart(newCart);
        setTotalPrice(calculateTotalPrice(newCart)); // ✅ Update total price
        saveCartItems(newCart);
    };

    // Remove item from cart
    const removeFromCart = (itemId) => {
        const newCart = cart.filter(item => item.id !== itemId);
        setCart(newCart);
        saveCartItems(newCart);
    };

    // Load cart when component mounts
    useEffect(() => {
        loadCartItems();
    }, []);

    return (
        <CartContext.Provider value={{ cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;

export const useCart = () => useContext(CartContext);