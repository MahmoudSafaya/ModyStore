import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css"; // Default styles for the slider


const ProductFilter = React.memo(({ showFilters, searchParams, setSearchParams }) => {
    // State for the price range
    const [priceRange, setPriceRange] = useState([10, 5000]); // [minPrice, maxPrice]

    // Destructure minPrice and maxPrice for clarity
    const [minPrice, maxPrice] = priceRange;

    // Handle slider change
    const handleSliderChange = (value) => {
        setPriceRange(value);
        updateURLParams(value[0], value[1]);
    };

    // Update URL with minPrice and maxPrice
    const updateURLParams = (min, max) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("minPrice", min);
        newParams.set("maxPrice", max);
        newParams.delete("page"); // Reset page when filters change
        setSearchParams(newParams);
    };

    // Read minPrice and maxPrice from URL on component mount
    useEffect(() => {
        const urlMinPrice = searchParams.get("minPrice");
        const urlMaxPrice = searchParams.get("maxPrice");
        if (urlMinPrice && urlMaxPrice) {
            setPriceRange([Number(urlMinPrice), Number(urlMaxPrice)]);
        }
    }, [searchParams]);

    // Handle filter changes (e.g., category, price range)
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("page"); // Reset page when filters change
        if (value) {
            newParams.set(name, value);
        } else {
            newParams.delete(name);
        }
        setSearchParams(newParams);
    };

    // Handle sorting (e.g., price, rating)
    const handleSort = (sortValue) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("sort", sortValue);
        setSearchParams(newParams);
    };

    return (
        <div className="absolute top-0 left-0 z-100">
            {showFilters && (
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4 text-gray-700">

                    <div className="w-full">
                        <Slider
                            range
                            min={10} // Minimum price
                            max={5000} // Maximum price
                            value={priceRange}
                            onChange={handleSliderChange}
                        />
                        <div className="flex items-center justify-between gap-2 text-sm whitespace-nowrap">
                            <p>EGP {priceRange[1]}</p>
                            <p>EGP {priceRange[0]}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-2">
                        <button
                            type='button'
                            name='filter-sort-btn'
                            className="whitespace-nowrap duration-300 hover:text-indigo-400"
                            onClick={() => handleSort("ratings")}> ترتيب حسب: التقيمات</button>
                        <button
                            type='button'
                            name='filter-price-btn'
                            className="whitespace-nowrap duration-300 hover:text-indigo-400"
                            onClick={() => handleSort("price")}>ترتيب حسب: السعر</button>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className=" whitespace-nowrap">عدد المنتجات:</label>
                        <input type="text" name="limit" value={searchParams.get("limit") || 10} onChange={handleFilterChange} className="custom-input-field text-center" />
                    </div>
                </div>
            )}
        </div>
    );
});

export default ProductFilter;
