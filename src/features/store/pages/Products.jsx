import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Filter } from "lucide-react";
import { useStore } from "../../../context/StoreContext";
import { S_ProductCard, S_ProductFilter } from "../components";
import axios from "../../../api/axios";
import Loading from "../../../shared/components/Loading";

const Products = () => {

    const { products, setProducts } = useStore();
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

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

    useEffect(() => {
        const getSubcategoriesProducts = async () => {
            setLoading(true);
            try {
                subCategories.map(async (subCate) => {
                    const response = await axios.get(`/products?isActive=true&category=${subCate._id}`);
                    setProducts([...products, ...response.data.products]);
                })
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        if(subCategories) {
            getSubcategoriesProducts();
        }
    }, [subCategories]);

    const fetchProductsByCategory = async (categoryId) => {
        try {
            setLoading(true);
            const response = await axios.get(`/products?isActive=true&category=${categoryId}`);
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
        return <Loading />
    }

    return (
        <div className="px-4 md:px-12 pt-12">

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

            <div className="flex items-center justify-between my-8">
                <h2 className="text-2xl font-semibold">بعض المنتجات</h2>
                <div className="flex flex-col gap-2">
                    <button type="button" className={`group flex items-center gap-2 text-gray-700 ${showFilters && 'text-indigo-400'}`} onClick={() => setShowFilters(!showFilters)}>
                        <span className="text-xl duration-500 group-hover:text-indigo-400">فلتر</span>
                        <Filter className="w-5 h-5 duration-500 group-hover:rotate-45 group-hover:text-indigo-400" />
                    </button>
                    <div className="relative">
                        <S_ProductFilter showFilters={showFilters} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-8">
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products && products.map((product, index) => {
                        return (
                            <div key={index}>
                                <S_ProductCard product={product} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default Products;