import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { Heart, Eye } from "lucide-react";
import { useCart } from '../../../context/CartContext';
import { useFavorites } from '../../../context/FavoritesContext';
import { useApp } from '../../../context/AppContext';
import { Toaster } from "react-hot-toast";
import { FaHeart } from "react-icons/fa";

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { categories } = useApp();
    const { favorites, addToFavorites } = useFavorites();
    const [selectedVariant, setSelectedVariant] = useState(null);

    useEffect(() => {
        if (product && product.variants.length === 1) {
            setSelectedVariant(`${product.name} ${product.variants[0].color} (${product.variants[0].size})`);
        }
    }, [])
    const baseUrl = import.meta.env.VITE_SERVER_URL;

    const proCategory = categories.map(item => item._id === product.category ? item.name : '');

    return (
        <div className="group bg-white p-4 rounded-xl shadow-md relative overflow-hidden h-full flex flex-col justify-between">
            <div className="max-w-max absolute top-4 -right-14 z-20 opacity-0 duration-500 group-hover:right-4 group-hover:opacity-100 rounded-lg bg-white shadow-md flex flex-col">
                <Link to={`/products/${product._id}`}>
                    <div className="w-12 h-12 flex items-center justify-center cursor-pointer duration-500 text-gray-600 hover:text-indigo-500 border-b border-gray-300">
                        <Eye className='w-6 h-6' />
                    </div>
                </Link>
                {favorites.find(item => item._id === product._id) ? (
                    <Link to='/favorites' className="w-12 h-12 flex items-center justify-center cursor-pointer duration-500 text-red-500 hover:text-red-600">
                        <FaHeart className='w-6 h-6' />
                    </Link>
                ) : (
                    <div className="w-12 h-12 flex items-center justify-center cursor-pointer duration-500 text-gray-600 hover:text-indigo-500" onClick={() => addToFavorites(product)}>
                        <Heart className='w-6 h-6' />
                    </div>
                )}
            </div>
            {product.badge && (
                <span className="absolute top-2 left-2 z-40 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                    {product.badge}
                </span>
            )}
            <div className="relative w-full h-80 overflow-hidden rounded-lg">
                <Link to={`/products/${product._id}`} className='w-full h-full'>
                    <img
                        src={encodeURI(`${baseUrl}/${product.mainImage.url.replace(/\\/g, '/')}`)}
                        alt={product.mainImage.alt}
                        loading="lazy"
                        className='w-full h-full object-cover duration-500 transition-all hover:scale-110'
                    />
                </Link>
            </div>
            <h3 className="text-lg font-medium my-2">
                <Link to={`/products/${product._id}`} className="duration-500 hover:text-indigo-500">
                    {product.name.length > 32 ? product.name.slice(0, 32) + '...' : product.name}
                </Link>
            </h3>
            <div className='flex flex-col gap-2'>
                <p className="text-gray-500 text-sm">{proCategory}</p>

                {/* {product.ratings?.average > 0 ? (
                    <div className="flex items-center mb-2">
                        <p>{product.ratings?.average} <span className="text-yellow-500">★</span></p>
                    </div>
                ) : ''} */}

                <div className="flex items-center gap-2">
                    <p className="text-indigo-500 text-lg font-semibold">
                        EGP {product.actualPrice}
                    </p>
                    {product.discount > 0 && (
                        <p className="text-gray-500 line-through text-sm">EGP {product.price}</p>
                    )}
                </div>
                <button
                    type='button'
                    name='add-to-cart-btn' className="bg-indigo-500 text-white px-4 py-2 rounded w-full duration-500 hover:bg-indigo-600" onClick={() => addToCart(product, 1, selectedVariant)}>
                    أضف إلى السلة
                </button>
            </div>

            <Toaster />
        </div>
    )
}

export default ProductCard