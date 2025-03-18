import CryptoJS from 'crypto-js';
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {axiosMain} from '../api/axios';

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
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [variantsProducts, setVariantsProducts] = useState([]);

    const navigate = useNavigate();

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen)
    }

    // Calculate total price
    const calculateTotalPrice = (cartItems) => {
        return cartItems.reduce((total, item) => total + (item.discount > 0
            ? (item.actualPrice * item.quantity)
            : (item.price * item.quantity)), 0);
    };

    // Function to save cart to local storage
    const saveCartItems = (cart) => {
        const encryptedCart = encryptData(cart);
        localStorage.setItem('diva_store_cart', encryptedCart);
        setTotalPrice(calculateTotalPrice(cart)); // ✅ Update total price
    };

    // Function to get cart from local storage
    const loadCartItems = () => {
        const encryptedCart = localStorage.getItem('diva_store_cart');
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

    const fetchProductsNames = async () => {
        try {
            const res = await axiosMain.get("/products/search");
            setVariantsProducts(res.data.products);
        } catch (error) {
            console.error(error);
        }
    };

    // Add item to cart
    const addToCart = (item, quantity, selectedVariant) => {
        // Check if item already exists in the cart
        // const existingItem = cart.find(cartItem =>
        //     cartItem._id === item._id &&
        //     cartItem.selectedVariant === selectedVariant
        // );
        fetchProductsNames();
        
        const existingItem = cart.find(cartItem => cartItem._id === item._id  );

        if (existingItem) {
            setIsCartOpen(true);
            toast('المنتج موجود بالفعل في سلة التسوق.', {
                style: {
                    textAlign: 'center',
                    color: '#485363'
                }
            });
            return;
        }

        // Auto-select variant if only one exists (avoid mutation)
        let finalSelectedVariant = typeof selectedVariant === 'string' ? selectedVariant : null;
        if (item.variants.length === 1) {
            finalSelectedVariant = `${item.name} ${item.variants[0].color} (${item.variants[0].size})`;
        }

        // Ensure the user has selected a valid variant
        if (item.variants.length > 1 && !selectedVariant) {
            toast(`من فضلك, اختر مقاس أو لون مناسب لك أولاً.`, {
                duration: 3000,
                style: { textAlign: 'center' },
            });
            navigate(`/products/${item._id}`);
            return;
        }

        // Find matching variant name
        // const matchName = `${item.name} ${selectedVariant?.color} (${selectedVariant?.size})`;
        const matchingProduct = variantsProducts.find(variant => variant.product === selectedVariant);
        const finalVariant = matchingProduct?.product || "غير متوفر";

        const newItem = {
            ...item,
            quantity,
            selectedVariant: finalSelectedVariant || finalVariant,
        };

        const updatedCart = [...cart, newItem];
        setCart(updatedCart);
        setTotalPrice(calculateTotalPrice(updatedCart));
        saveCartItems(updatedCart);
        setIsCartOpen(true);

        toast.success('تم إضافة المنتج إلى سلة التسوق.');
    };



    // Increase item quantity
    const increaseQuantity = (product) => {
        const totalStock = product.variants.reduce((total, item) => total + item.stock, 0);
    
        let newCart = cart.map((item) => {
            if (item._id === product._id) {
                if (item.quantity < totalStock) {
                    return {
                        ...item,
                        quantity: item.quantity + 1,
                        quantityPrice: item.quantityPrice + item.price
                    };
                } else {
                    toast('عفوا, الكمية المطلوبة ليست متوفرة في الوقت الحالي.', {
                        style: { textAlign: 'center' }
                    });
                }
            }
            return item;
        });
    
        setCart(newCart);
        setTotalPrice(calculateTotalPrice(newCart)); // ✅ Update total price
        saveCartItems(newCart);
    };
    
    // Decrease item quantity (or remove if it reaches 0)
    const decreaseQuantity = (product) => {
        let newCart = cart.map((item) =>
            item._id === product._id ? { ...item, quantity: item.quantity - 1, quantityPrice: item.quantityPrice - item.price } : item
        ).filter((item) => item.quantity > 0); // remove item if quantity reach 0

        setCart(newCart);
        setTotalPrice(calculateTotalPrice(newCart)); // ✅ Update total price
        saveCartItems(newCart);
    };

    // Remove item from cart
    const removeFromCart = (itemId) => {
        const newCart = cart.filter(item => item._id !== itemId);
        setCart(newCart);
        saveCartItems(newCart);
    };

    // Load cart when component mounts
    useEffect(() => {
        loadCartItems();
        // fetchProductsNames();
    }, []);

    return (
        <CartContext.Provider value={{ cart, setCart, isCartOpen, toggleCart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, totalPrice, setTotalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;

export const useCart = () => useContext(CartContext);