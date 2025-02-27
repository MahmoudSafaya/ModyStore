import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { useFavorites } from "../../../context/FavoritesContext";
import { useStore } from "../../../context/StoreContext";

const Products = () => {

    const { products, categories } = useStore();
    const { addToCart } = useCart();
    const { addToFavorites } = useFavorites();
    
    const baseUrl = import.meta.env.VITE_SERVER_URL;

    return (
        <div className="bg-gray-100">
            <h2 className="text-2xl font-semibold mb-6">بعض المنتجات</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products && products.map((product, index) => {
                    const proCategory = categories.map(item => item._id === product.category ? item.name : '');
                    return (
                        <div key={index} className="group bg-white p-6 rounded-xl shadow-md relative overflow-hidden">
                            <div className="max-w-max absolute top-4 -right-14 z-20 opacity-0 duration-500 group-hover:right-4 group-hover:opacity-100 rounded-lg bg-white shadow-md flex flex-col">
                                <Link to={`/products/${product._id}`}>
                                    <div className="w-12 h-12 flex items-center justify-center cursor-pointer duration-500 text-gray-600 hover:text-gray-800 border-b border-gray-300">
                                        <Eye />
                                    </div>
                                </Link>
                                <div className="w-12 h-12 flex items-center justify-center cursor-pointer duration-500 text-gray-600 hover:text-gray-800" onClick={() => addToFavorites(product)}>
                                    <Heart />
                                </div>
                            </div>
                            {product.badge && (
                                <span className="absolute top-2 left-2 z-40 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                                    {product.badge}
                                </span>
                            )}
                            <div className="relative w-full h-60 overflow-hidden rounded-lg">
                                <Link to={`/products/${product._id}`}>
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-110"
                                        style={{ backgroundImage: `url(${baseUrl}/${product.mainImage.url.replace(/\\/g, '/')})` }}></div>
                                </Link>
                            </div>
                            <h3 className="text-lg font-medium my-2">
                                <Link to={`/products/${product._id}`} className="duration-500 hover:text-indigo-500">
                                    {product.name}
                                </Link>
                            </h3>
                            <p className="text-gray-500 text-sm">{proCategory}</p>
                            <div className="flex items-center mb-2">
                                {Array(product.ratings.count)
                                    .fill()
                                    .map((_, i) => (
                                        <span key={i} className="text-yellow-500">★</span>
                                    ))}
                            </div>
                            {/* <p className={`mb-2 ${product.storageAmount > 0 ? 'text-gray-400' : 'text-red-500'}`}>
                            {product.storageAmount > 0 ? `متوفر: ${product.storageAmount} قطعة` : 'تم نفاذ المنتج'}
                        </p> */}
                            <div className="flex items-center gap-2">
                                <p className="text-indigo-500 text-lg font-semibold">
                                    {product.discount > 0 ? product.price - (product.price * (product.discount / 100)) : product.price}
                                </p>
                                {product.discount > 0 && (
                                    <p className="text-gray-500 line-through text-sm">{product.price}</p>
                                )}
                            </div>
                            <button className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded w-full duration-500 hover:bg-indigo-600" onClick={() => addToCart(product, 1)}>
                                أضف إلى السلة
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Products;