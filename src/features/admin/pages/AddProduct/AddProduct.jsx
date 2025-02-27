import React, { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom';
import { GrStatusGoodSmall } from "react-icons/gr";
import ProductVariations from "./components/ProductVariations";
import { Tag, House } from "lucide-react";
import ProductDetails from "./components/ProductDetails";
import ProductPrice from "./components/ProductPrice";
import ProductImages from "./components/ProductImages";
import ProductCategory from "./components/ProductCategory";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ProductSchema } from "../../../../schemas/productSchema";
import axios from "../../../../api/axios";
import toast, { Toaster } from "react-hot-toast";

const AddProduct = () => {
    const [thumbnail, setThumbnail] = useState(null);

    const mainImageRef = useRef(null);

    const handleThumbnailUpload = (e) => {
        const file = e.currentTarget.files[0];
        if (file) {
            setThumbnail(URL.createObjectURL(file));
        }
    };

    const initialValues = {
        name: "",
        description: "",
        price: 0,
        discount: 0,
        category: "",
        badge: "",
        isFeatured: true,
        mainImage: null,
        images: null,
        variants: [{ color: "", size: "", stock: "" }],
        reviews: [{ rating: 2, comment: "" }],
        isActive: true,
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const formData = new FormData();

        // Append form values
        Object.keys(values).forEach((key) => {
            if (key === "images") {
                Array.from(values.images).forEach((file) => {
                    formData.append("images", file);
                });
            } else if (key === "variants") {
                values.variants.forEach((variant, index) => {
                    formData.append(`variants[${index}][color]`, variant.color);
                    formData.append(`variants[${index}][size]`, variant.size);
                    formData.append(`variants[${index}][stock]`, variant.stock);
                });
            } else if (key === "reviews") {
                values.reviews.forEach((review, index) => {
                    formData.append(`reviews[${index}][rating]`, review.rating);
                    formData.append(`reviews[${index}][comment]`, review.comment);
                });
            } else {
                formData.append(key, values[key]);
            }
        });

        values.isActive = values.isActive === 'true' ? true : false

        try {
            const response = await axios.post("/products", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Product uploaded:", response);
            toast.success('تهانينا!, تم إضافة المنتج بنجاح');
            console.log(values)
        } catch (error) {
            console.error("Error uploading product:", error.response?.data || error.message);
        }

        setSubmitting(false);
        resetForm();
        setThumbnail('');
    };


    return (
        <div>
            {/* Component Header */}
            <div className='custom-bg-white flex items-center justify-between'>
                <h2 className='text-lg'>اضافة منتج جديد</h2>
                <Link to='/admin/products' className='text-2xl bg-white rounded-xl transition-all duration-300 hover:bg-indigo-600 hover:text-white p-2'>
                    <House />
                </Link>
            </div>
            {/* Component Content */}
            <Formik
                initialValues={initialValues}
                validationSchema={ProductSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form>
                        <div className="flex items-between flex-col md:flex-row gap-4 md:gap-8 my-8">
                            <div className="w-full md:w-2/3">
                                {/* Product name and description */}
                                <ProductDetails values={values} setFieldValue={setFieldValue} />

                                {/* product images */}
                                <ProductImages setFieldValue={setFieldValue} isSubmitting={isSubmitting} />

                                {/* Pricing the product */}
                                <ProductPrice values={values} setFieldValue={setFieldValue} />

                                {/* Variations */}
                                <ProductVariations setFieldValue={setFieldValue} isSubmitting={isSubmitting} />
                            </div>

                            <div className="w-full md:w-1/3">
                                {/* Thumbnail Upload */}
                                <div className="max-w-md mx-auto custom-bg-white space-y-6">
                                    <h2 className="custom-header">صوره المنتج الرئيسية</h2>
                                    <div
                                        className="relative flex items-center justify-center w-full h-32 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer bg-purple-100"
                                    >
                                        <input
                                            ref={mainImageRef}
                                            type="file"
                                            accept="image/*"
                                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                handleThumbnailUpload(e);
                                                setFieldValue('mainImage', e.currentTarget.files[0])
                                            }}
                                        />
                                        {thumbnail ? (
                                            <img src={thumbnail} alt="Thumbnail" className="h-full object-cover rounded-md" />
                                        ) : (
                                            <span className="text-purple-600">اضغط لتحميل صوره المنتج الرئيسية </span>
                                        )}
                                    </div>
                                    <ErrorMessage name="mainImage" component="div" className="text-red-400" />
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
                                        <Field as="select" name='isActive' className="w-full custom-input-field" >
                                            <option value="true">نشط</option>
                                            <option value="false">غير نشط</option>
                                        </Field>
                                        <ErrorMessage name="isActive" component="div" className="text-red-400" />
                                    </div>
                                </div>

                                {/* Category Details */}
                                <ProductCategory setFieldValue={setFieldValue} />

                                {/* Tag Badge*/}
                                <div className="custom-bg-white mt-8">
                                    <label htmlFor="badge" className="custom-label-field">Badge</label>
                                    <div className="relative">
                                        <Field type="text" name="badge" id="badge" className="custom-input-field w-full" placeholder="اكتب السعر المراد خصمه..." />
                                        <Tag className="w-20 h-full text-2xl p-2 rounded-l-lg bg-indigo-200 text-indigo-500 absolute top-0 left-0 border border-indigo-200" />
                                        <ErrorMessage name="badge" component="div" className="text-red-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="block min-w-40 bg-indigo-500 text-white py-2 px-4 mx-auto duration-500 rounded-full hover:be-indigo-600"
                        >
                            {isSubmitting ? "يتم إضافة المنتج..." : "إضافة المنتج"}
                        </button>
                    </Form>
                )}
            </Formik>

            <Toaster toastOptions={{ duration: 7000 }} />
        </div>
    )
}

export default AddProduct