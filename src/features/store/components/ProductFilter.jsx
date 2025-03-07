import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../../../api/axios";
import { useStore } from "../../../context/StoreContext";
import { useApp } from "../../../context/AppContext";

const ProductFilter = () => {
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
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
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
                    <input type="number" name="minPrice" value={searchParams.get("minPrice") || ""} onChange={handleFilterChange} className="custom-input-field" />
                </div>
                <div className="flex items-center gap-2">
                    <label>إلى:</label>
                    <input type="number" name="maxPrice" value={searchParams.get("maxPrice") || ""} onChange={handleFilterChange} className="custom-input-field" />
                </div>
            </div>
            <div>
                <label value={searchParams.get("sort") || ""} onChange={handleFilterChange}>ترتيب حسب:</label>
                <select name="sort" value={searchParams.get("sort") || ""} onChange={handleFilterChange} className="custom-input-field">
                    <option value="ratings">التقييمات</option>
                    <option value="price">السعر</option>
                </select>
            </div>
            {/* <div className="flex items-center gap-2">
                <label>صفحة رقم:</label>
                <input type="number" name="page" value={searchParams.get("page") || ""} onChange={handleFilterChange} className="custom-input-field" />
            </div> */}
            <div className="flex items-center gap-2">
                <label>عدد المنتجات:</label>
                <input type="number" name="limit" value={searchParams.get("limit") || 10} onChange={handleFilterChange} className="custom-input-field" />
            </div>
        </div>
    );
};

export default ProductFilter;
