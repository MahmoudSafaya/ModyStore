import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Eye } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { useFavorites } from "../../../context/FavoritesContext";
import { useStore } from "../../../context/StoreContext";
import { S_ProductFilter } from "../components";
import axios from "../../../api/axios";
import { useApp } from "../../../context/AppContext";

const Products = () => {

    const { products, setProducts } = useStore();
    const { addToCart } = useCart();
    const { categories } = useApp();
    const { addToFavorites } = useFavorites();
    const [loading, setLoading] = useState(true);

    const [subCategories, setSubCategories] = useState();

    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const location = useLocation();
    const navigate = useNavigate();

    // Extract the category ID from the query string
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('category');

    useEffect(() => {
        if (categoryId) {
            console.log(categoryId)
            fetchProductsByCategory(categoryId);
            fetchSubCategories(categoryId)
        } else {
            setLoading(false);
        }
    }, [categoryId]);

    const fetchProductsByCategory = async (categoryId) => {
        try {
            setLoading(true);
            const response = await axios.get(`/products?category=${categoryId}`);
            setProducts(response.data.products);
            console.log(response)
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubCategories = async (categoryId) => {
        try {
            const response = await axios.get(`/categories/${categoryId}/subcategories`); // Replace with your endpoint
            setSubCategories(response.data);
        } catch (error) {
            console.error(`Error fetching subcategories for ${categoryId}:`, error);
        }
    }

    const handleCategoryClick = (categoryId) => {
        navigate(`/products?category=${categoryId}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="px-4 md:px-12">
            <h2 className="text-2xl font-semibold mb-6">بعض المنتجات</h2>
            <div className="flex flex-row flex-wrap items-center justify-center gap-6 mb-12">
                {subCategories && subCategories.map(item => {
                    const correctedPath = item.image.url.replace(/\\/g, '/');
                    const fullImageUrl = `${baseUrl}/${correctedPath}`;
                    return (
                        <div key={item._id} onClick={() => handleCategoryClick(item._id)} className="group bg-white p-4 rounded-xl shadow-md flex flex-col items-center cursor-pointer">
                            <img src={fullImageUrl} alt={item.image.alt} className="w-32 h-32 object-cover mb-4 transform transition-transform duration-500 rounded-lg group-hover:scale-110" />
                            <h3 className="text-lg font-medium">{item.name}</h3>
                            {/* <p className="text-gray-500">{item.products} products</p> */}
                        </div>
                    )
                })}
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-8">
                <div className="w-full lg:w-[15%]">
                    <S_ProductFilter />
                </div>
                <div className="w-full lg:w-[85%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products && products.map((product, index) => {
                        const proCategory = categories.map(item => item._id === product.category ? item.name : '');
                        return (
                            <div key={index} className="group bg-white p-4 rounded-xl shadow-md relative overflow-hidden">
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
                                <div className="relative w-full h-100 overflow-hidden rounded-lg">
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
                                        EGP {product.actualPrice}
                                    </p>
                                    {product.discount > 0 && (
                                        <p className="text-gray-500 line-through text-sm">EGP {product.price}</p>
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
        </div>
    );
}

export default Products;