import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { TiHome } from "react-icons/ti";
import { GrStatusGoodSmall } from "react-icons/gr";
import ProductVariations from "./components/ProductVariations";
import { Tag } from "lucide-react";
import ProductDetails from "./components/ProductDetails";
import ProductPrice from "./components/ProductPrice";
import ProductImages from "./components/ProductImages";
import ProductCategory from "./components/ProductCategory";


const AddProduct = () => {
    const [status, setStatus] = useState("Published");
    const [thumbnail, setThumbnail] = useState(null);

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(URL.createObjectURL(file));
        }
    };

    return (
        <div>
            {/* Component Header */}
            <div className='custom-bg-white flex items-center justify-between'>
                <h2 className='text-lg'>اضافة منتج جديد</h2>
                <Link to='/admin/products' className='text-2xl bg-white rounded-xl transition-all duration-300 hover:bg-indigo-600 hover:text-white p-2'>
                    <TiHome />
                </Link>
            </div>
            {/* Component Content */}
            <div className="flex items-between flex-col md:flex-row gap-4 md:gap-8 my-8">
                <div className="w-full md:w-2/3">
                    {/* Product name and description */}
                    <ProductDetails />

                    {/* product images */}
                    <ProductImages />

                    {/* Pricing the product */}
                    <ProductPrice />

                    {/* Variations */}
                    <ProductVariations />
                </div>

                <div className="w-full md:w-1/3">
                    {/* Thumbnail Upload */}
                    <div className="max-w-md mx-auto custom-bg-white space-y-6">
                        <h2 className="custom-header">صوره المنتج الرئيسية</h2>
                        <div
                            className="relative flex items-center justify-center w-full h-32 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer bg-purple-100"
                        >
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleThumbnailUpload}
                            />
                            {thumbnail ? (
                                <img src={thumbnail} alt="Thumbnail" className="h-full object-cover rounded-md" />
                            ) : (
                                <span className="text-purple-600">اضغط لتحميل صوره المنتج الرئيسية </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Set the product thumbnail image. Only *.png, *.jpg, and *.jpeg files are accepted.
                        </p>
                    </div>

                    {/* Status Dropdown */}
                    <div className="mt-8 max-w-md mx-auto custom-bg-white space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="custom-header">الحاله</h2>
                            <GrStatusGoodSmall className="text-[#36C76C]" />
                        </div>
                        <div className="relative">
                            <select
                                className="w-full custom-input-field"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="Published">نشط</option>
                                <option value="Inactive">غير نشط</option>
                                <option value="Draft">مخفي</option>
                            </select>
                        </div>
                    </div>

                    {/* Category Details */}
                    <ProductCategory />

                    {/* Tag Badge*/}
                    <div className="custom-bg-white mt-8">
                        <label htmlFor="product-badge" className="custom-label-field">Badge</label>
                        <div className="relative">
                            <input type="text" name="product-badge" id="product-badge" className="custom-input-field w-full" placeholder="اكتب السعر المراد خصمه..." />
                            <Tag className="w-20 h-full text-2xl p-2 rounded-l-lg bg-indigo-200 text-indigo-500 absolute top-0 left-0 border border-indigo-200" />
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default AddProduct