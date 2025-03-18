import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams, Link } from "react-router-dom";
import { Filter } from "lucide-react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { S_ProductCard, S_ProductFilter } from "../components";
import { axiosMain } from "../../../api/axios";
import Loading from "../../../shared/components/Loading";
import { IoStorefrontOutline } from "react-icons/io5";

const Products = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [subCategories, setSubCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const baseUrl = import.meta.env.VITE_SERVER_URL;

    // Extract the category ID from the query string
    const { categoryId } = useParams();

    // Fetch products with debouncing
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = Object.fromEntries(searchParams.entries());
                if (categoryId) {
                    params.category = categoryId; // Add categoryId to the query params
                }
                const response = await axiosMain.get('/products', {
                    params,
                });
                setProducts(response.data.Products);
                setCurrentPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
                setCurrentPage(1);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        // Debounce the API call
        const debounceTimer = setTimeout(() => {
            fetchProducts();
        }, 300);

        // Cleanup function
        return () => clearTimeout(debounceTimer);
    }, [searchParams, categoryId]);

    // Fetch subcategories when categoryId changes
    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const response = await axiosMain.get(`/categories/${categoryId}/subcategories`);
                setSubCategories(response.data);
            } catch (error) {
                console.error(`Error fetching subcategories for ${categoryId}:`, error);
            }
        };

        if (categoryId) {
            fetchSubCategories();
        }
    }, [categoryId]);

    // Handle page change
    const handlePageChange = (page) => {
        const newParams = new URLSearchParams(searchParams);
        if (page >= 1 && page <= totalPages) {
            newParams.set("page", page);
            setSearchParams(newParams);
        }
    };

    // Handle category click
    const handleCategoryClick = (categoryId) => {
        navigate(`/products/category/${categoryId}`);
    };

    // Clear all search params on page reload
    useEffect(() => {
        // Check if there are any search params
        if (searchParams.toString()) {
            // Clear all search params
            setSearchParams({});

            // Optionally, navigate to the same URL without search params
            navigate(window.location.pathname, { replace: true });
        }
    }, []); // Empty dependency array ensures this runs only on mount


    if (loading) {
        return <Loading />
    }

    return (
        <div className="px-4 md:px-12">

            <div className="flex flex-row flex-wrap items-center justify-center gap-6 py-12">
                {subCategories && subCategories.map(item => {
                    const correctedPath = item.image.url.replace(/\\/g, '/');
                    const fullImageUrl = encodeURI(`${baseUrl}/${correctedPath}`);
                    return (
                        <div key={item._id} onClick={() => handleCategoryClick(item._id)} className="group bg-white p-4 rounded-xl shadow-md flex flex-col items-center cursor-pointer">
                            <img src={fullImageUrl} alt={item.image.alt} className="w-32 h-32 object-cover mb-4 transform transition-transform duration-500 rounded-lg group-hover:scale-110" />
                            <h3 className="text-lg font-medium">{item.name}</h3>
                            {/* <p className="text-gray-500">{item.products} products</p> */}
                        </div>
                    )
                })}
            </div>

            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold">أحدث المنتجات</h2>
                <div className="flex flex-col gap-2">
                    <button type="button" className={`group flex items-center gap-2 text-gray-700 ${showFilters && 'text-indigo-400'}`} onClick={() => setShowFilters(!showFilters)}>
                        <span className="text-xl duration-500 group-hover:text-indigo-400">فلتر</span>
                        <Filter className="w-5 h-5 duration-500 group-hover:rotate-45 group-hover:text-indigo-400" />
                    </button>
                    <div className="relative">
                        <S_ProductFilter
                            showFilters={showFilters}
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                        />
                    </div>
                </div>
            </div>

            <div className="w-full">
                    {products && products.length > 0 ? (
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {
                                products.filter(product => product.isActive).map((product, index) => {
                                    return (
                                        <div key={index}>
                                            <S_ProductCard product={product} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6 w-full">
                            <div>
                                <IoStorefrontOutline className="w-20 h-20 opacity-25" />
                            </div>
                            <p className="text-2xl font-medium text-center">لا يوجد منتجات هنا في الوقت الحالي</p>
                            <Link to='/' className="max-w-max bg-indigo-500 text-white py-2 px-6 rounded-lg shadow-sm duration-500 hover:bg-indigo-600">الصفحة الرئيسية</Link>
                        </div>
                    )}
            </div>


            {/* Pagination Controls */}
            {products.length > 0 && (
                <div className="flex justify-center mt-12">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-25"
                    >
                        <ChevronRight />
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? "bg-indigo-500 text-white" : "bg-gray-200"
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-25"
                    >
                        <ChevronLeft />
                    </button>
                </div>
            )}

        </div>
    );
}

export default Products;