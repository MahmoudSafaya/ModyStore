import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { Toaster } from "react-hot-toast";
import { useApp } from "../../../../context/AppContext";
import Loading from "../../../../shared/components/Loading";

const AddProduct = () => {
    const [thumbnail, setThumbnail] = useState(null);
    const [proImage, setProImage] = useState(null);
    const [productImages, setProductImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [updatedImages, setUpdatedImages] = useState([]);
    const [variations, setVariations] = useState([{ size: "", color: "", stock: "" }]);
    const [discount, setDiscount] = useState('none');

    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState();

    const { successNotify } = useApp();

    const location = useLocation();
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_SERVER_URL;

    // Extract the category ID from the query string
    const queryParams = new URLSearchParams(location.search);
    const paramID = queryParams.get('product');

    const getProductById = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/products/${paramID}`);
            console.log(res);
            setSelectedProduct(res.data);
            setThumbnail(`${baseUrl}/${res.data.mainImage.url.replace(/\\/g, '/')}`);
            setProductImages(res.data.images)
            setVariations(res.data.variants);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (paramID && paramID.length > 10) {
            getProductById()
        }
    }, [paramID]);

    const handleThumbnailUpload = (e) => {
        const file = e.currentTarget.files[0];
        if (file) {
            setThumbnail(URL.createObjectURL(file));
        }
        setProImage(file);
    };

    const initialValues = selectedProduct || {
        name: "",
        description: "",
        price: '',
        discount: 0,
        category: "",
        badge: "",
        isFeatured: true,
        mainImage: null,
        images: null,
        variants: [{ color: "", size: "", stock: "" }],
        reviews: [],
        isActive: true,
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const formData = new FormData();

        if (selectedProduct) {
            formData.append('name', values.name)
            formData.append('description', values.description)
            formData.append('badge', values.badge)
            formData.append('price', values.price)
            formData.append('discount', values.discount)
            formData.append('category', values.category)
            formData.append('isActive', values.isActive)

            proImage ? formData.append('mainImage', proImage) : '';

            updatedImages.length > 0 && updatedImages.forEach((file) => {
                formData.append("images", file);
            });

            removedImages && removedImages.forEach((item, index) => {
                formData.append(`removedImagesPaths[${index}]`, item);
            });

            variations.forEach((variant, index) => {
                if (variant.stock) { // Ensure stock exists before adding variant
                    if (variant.barCode) formData.append(`variants[${index}][barCode]`, variant.barCode);
                    if (variant.color) formData.append(`variants[${index}][color]`, variant.color);
                    if (variant.size) formData.append(`variants[${index}][size]`, variant.size);
                    formData.append(`variants[${index}][stock]`, variant.stock);
                }
            });


            try {
                for (let pair of formData.entries()) {
                    console.log(pair[0], pair[1]);
                }
                const response = await axios.put(`/products/${paramID}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                successNotify('تهانينا!, تم تعديل المنتج بنجاح');

                resetForm();
                // setThumbnail('');
                // setProductImages([])
                navigate('/admin/products');
            } catch (error) {
                console.error("Error editing product:", error.response?.data || error.message);
            }
        } else {
            values.variants = values.variants
                .map((item, index) => {
                    if (index === 0 && item.stock) return item;
                    if (index > 0 && item.stock && (item.size || item.color)) return item;
                    return null; // Explicitly return null instead of an implicit undefined
                })
                .filter(Boolean); // Remove null or undefined values

            // Append form values
            Object.keys(values).forEach((key) => {
                if (key === "images") {
                    Array.from(values.images).forEach((file) => {
                        formData.append("images", file);
                    });
                } else if (key === "variants") {
                    values.variants.forEach((variant, index) => {
                        if (variant.stock) { // Ensure stock exists before adding variant
                            if (variant.color) formData.append(`variants[${index}][color]`, variant.color);
                            if (variant.size) formData.append(`variants[${index}][size]`, variant.size);
                            formData.append(`variants[${index}][stock]`, variant.stock);
                        }
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
            try {
                const response = await axios.post("/products", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                console.log("Product uploaded:", response);
                successNotify('تهانينا!, تم إضافة المنتج بنجاح');

                resetForm();
                // setThumbnail('');
                // setProductImages([]);
                // setVariations([{ barCode: "", size: "", color: "", stock: "" }]);
                // setDiscount('none');
                navigate('/admin/products');
            } catch (error) {
                console.error("Error uploading product:", error.response?.data || error.message);
            }
        }

        setSubmitting(false);
    };

    if (loading) {
        return <Loading />
    }

    return (
        <div>
            {/* Component Content */}
            <Formik
                initialValues={initialValues}
                validationSchema={ProductSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form>
                        <div className="flex items-between flex-col md:flex-row gap-4 md:gap-8 mb-8">
                            <div className="w-full md:w-2/3">
                                {/* Product name and description */}
                                <ProductDetails values={values} setFieldValue={setFieldValue} />

                                {/* product images */}
                                <ProductImages setFieldValue={setFieldValue} isSubmitting={isSubmitting} productImages={productImages} setProductImages={setProductImages} removedImages={removedImages} setRemovedImages={setRemovedImages} updatedImages={updatedImages} setUpdatedImages={setUpdatedImages} />

                                {/* Pricing the product */}
                                <ProductPrice values={values} setFieldValue={setFieldValue} discount={discount} setDiscount={setDiscount} />

                                {/* Variations */}
                                <ProductVariations setFieldValue={setFieldValue} isSubmitting={isSubmitting} variations={variations} setVariations={setVariations} />
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
                                            onChange={(e) => {
                                                handleThumbnailUpload(e);
                                                setFieldValue('mainImage', e.currentTarget.files[0])
                                            }}
                                        />
                                        {thumbnail ? (
                                            <img src={thumbnail} alt="Thumbnail" className="h-full object-cover rounded-md" />
                                        ) : (
                                            <span className="text-purple-600 text-center">اضغط لتحميل صوره المنتج الرئيسية </span>
                                        )}
                                    </div>
                                    <ErrorMessage name="mainImage" component="div" className="text-red-400" />
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
                                    <h2 className="custom-header">العلامة</h2>
                                    <div className="relative">
                                        <Field type="text" name="badge" id="badge" className="custom-input-field w-full" placeholder="اكتب علامة مميزة للمنتج ..." />
                                        <Tag className="w-20 h-full text-2xl p-2 rounded-l-lg bg-indigo-200 text-indigo-500 absolute top-0 left-0 border border-indigo-200" />
                                        <ErrorMessage name="badge" component="div" className="text-red-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="block min-w-60 bg-indigo-500 text-white py-2 px-4 mx-auto duration-500 rounded-lg hover:be-indigo-600"
                        >
                            {selectedProduct ?
                                (isSubmitting ? "يتم تعديل المنتج..." : "تعديل المنتج") :
                                (isSubmitting ? "يتم إضافة المنتج..." : "إضافة المنتج")}
                        </button>
                    </Form>
                )}
            </Formik>

            <Toaster toastOptions={{ duration: 3000 }} />
        </div>
    )
}

export default AddProduct