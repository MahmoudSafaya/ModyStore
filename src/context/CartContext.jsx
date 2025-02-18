import React, { createContext, useState, useEffect } from "react";
import { useContext } from "react";

const CartContext = createContext();

// Convert a string into a 256-bit (32-byte) AES key
async function generateAESKey(secret) {
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret.padEnd(32, "0").slice(0, 32)), // Ensure 32 bytes
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
    );
    return keyMaterial;
}

// Function to generate a hash for the cart (SHA-256)
async function generateCartHash(cartItems) {
    const cartString = JSON.stringify(cartItems);
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(cartString));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Encrypt cart data
async function encryptCartData(cartItems, secret) {
    const key = await generateAESKey(secret);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM requires a 12-byte IV
    const encodedData = new TextEncoder().encode(JSON.stringify(cartItems));
    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodedData);
    return {
        encryptedData: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
        iv: btoa(String.fromCharCode(...iv))
    };
}

// Decrypt cart data
async function decryptCartData(encryptedData, iv, secret) {
    try {
        const key = await generateAESKey(secret);
        const encryptedBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
        const ivBuffer = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
        const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: ivBuffer }, key, encryptedBuffer);
        return JSON.parse(new TextDecoder().decode(decrypted));
    } catch (error) {
        console.error("Error decrypting cart data:", error);
        return [];
    }
}

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const SECRET_KEY = "my_super_secret_key"; // Use a proper key in production

    // Calculate total price
    const calculateTotalPrice = (cartItems) => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Save cart to localStorage with encryption
    const saveCart = async (cartItems) => {
        const hash = await generateCartHash(cartItems);

        setTotalPrice(calculateTotalPrice(cartItems)); // ✅ Update total price

        const { encryptedData, iv } = await encryptCartData(cartItems, SECRET_KEY);

        const keys = Object.keys(localStorage);
        const cartKey = keys.find(key => key.startsWith("cart_hash_"));
        if (cartKey) {
            localStorage.setItem(cartKey, JSON.stringify({ encryptedData, iv }));
        } else {
            localStorage.setItem(`cart_hash_${hash.slice(0, 22)}`, JSON.stringify({ encryptedData, iv }));
        }
    };

    // Load cart from localStorage and decrypt
    const loadCart = async () => {
        const keys = Object.keys(localStorage);
        const cartKey = keys.find(key => key.startsWith("cart_hash_"));
        if (cartKey) {
            const storedData = JSON.parse(localStorage.getItem(cartKey));
            const decryptedCart = await decryptCartData(storedData.encryptedData, storedData.iv, SECRET_KEY);
            setCart(decryptedCart);
            setTotalPrice(calculateTotalPrice(decryptedCart)); // ✅ Update total price
        }
    };

    // Add item to cart
    const addToCart = async (item) => {
        if (cart.find(cartItems => cartItems.id === item.id)) {
            return false;
        }
        const newCart = [...cart, item];
        setCart(newCart);
        setTotalPrice(calculateTotalPrice(newCart)); // ✅ Update total price
        await saveCart(newCart);
    };

    // Decrease item quantity (or remove if it reaches 0)
    const increaseQuantity = async (itemId) => {
        let newCart = cart.map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1, quantityPrice: item.quantityPrice + item.price } : item
        ).filter((item) => item.quantity > 0);

        setCart(newCart);
        setTotalPrice(calculateTotalPrice(newCart)); // ✅ Update total price
       await saveCart(newCart);
    };
    const decreaseQuantity = async (itemId) => {
        let newCart = cart.map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity - 1, quantityPrice: item.quantityPrice - item.price } : item
        ).filter((item) => item.quantity > 0);

        setCart(newCart);
        setTotalPrice(calculateTotalPrice(newCart)); // ✅ Update total price
        await saveCart(newCart);
    };

    // Remove item from cart
    const removeFromCart = async (itemId) => {
        const newCart = cart.filter(item => item.id !== itemId);
        setCart(newCart);
        await saveCart(newCart);
    };

    // Load cart when component mounts
    useEffect(() => {
        loadCart();
    }, []);

    return (
        <CartContext.Provider value={{ cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;

export const useCart = () => {
    return useContext(CartContext)
}