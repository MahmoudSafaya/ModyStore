import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../../../api/axios";
import { useStore } from "../../../context/StoreContext";
import { useApp } from "../../../context/AppContext";

const ProductFilter = ({ showFilters }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { setProducts } = useStore();
    const { categories } = useApp();

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(name, value);
        } else {
            newParams.delete(name);
        }
        setSearchParams(newParams);
    };

    const handleSort = (sortValue) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("sort", sortValue);
        setSearchParams(newParams);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = Object.fromEntries(searchParams.entries());
                console.log(params)
                const response = await axios.get("/products", {
                    params,
                });
                console.log(response)
                setProducts(response.data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [searchParams]);

    return (
        <div className="absolute top-0 left-0 z-100">
            {showFilters && (
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4 text-gray-700">
                    {/* <div>
                    <label>حدد قسم:</label>
                    <select name="category" value={searchParams.get("category") || ""} onChange={handleFilterChange} className="custom-input-field">
                        <option value="">الكل</option>
                        {categories && categories.map(item => {
                            return (
                                <option key={item._id} value={item._id}>{item.name}</option>
                            )
                        })}
                    </select>
                </div> */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <label>من:</label>
                            <input type="number" name="minPrice" value={searchParams.get("minPrice") || ""} onChange={handleFilterChange} className="custom-input-field" placeholder="EGP" />
                        </div>
                        <div className="flex items-center gap-2">
                            <label>إلى:</label>
                            <input type="number" name="maxPrice" value={searchParams.get("maxPrice") || ""} onChange={handleFilterChange} className="custom-input-field" placeholder="EGP" />
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <button className="whitespace-nowrap duration-300 hover:text-indigo-400" onClick={() => handleSort("ratings")}> ترتيب حسب: التقيمات</button>
                        <button className="whitespace-nowrap duration-300 hover:text-indigo-400" onClick={() => handleSort("price")}>ترتيب حسب: السعر</button>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className=" whitespace-nowrap">عدد المنتجات:</label>
                        <input type="text" name="limit" value={searchParams.get("limit") || 10} onChange={handleFilterChange} className="custom-input-field text-center" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductFilter;
