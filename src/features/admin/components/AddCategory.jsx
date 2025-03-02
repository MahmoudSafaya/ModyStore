import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from '../../../api/axios';
import toast from 'react-hot-toast';
import { ChartColumnStacked } from 'lucide-react'

const AddCategory = () => {
    const [categories, setCategories] = useState([]);
    const [isDelete, setIsDelete] = useState({ display: false, cateId: '', username: '' });
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [parentCategory, setParentCategory] = useState('');

    const [iconFile, setIconFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const baseUrl = import.meta.env.VITE_SERVER_URL;

    const formRef = useRef(null); // Ref for scrolling


    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        icon: Yup.mixed().required('Icon image is required'),
        image: Yup.mixed().required('Category image is required'),
    });

    const getMimeTypeFromExtension = (filename) => {
        const extension = filename.split(".").pop().toLowerCase();
        const mimeTypes = {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            gif: "image/gif",
            webp: "image/webp",
            svg: "image/svg+xml",
        };
        return mimeTypes[extension] || "application/octet-stream"; // Default if unknown
    };

    const urlToFile = async (url) => {
        const response = await fetch(`/${url}`);
        const blob = await response.blob();

        const filename = url.split("_").pop(); // Extract filename
        const mimeType = blob.type && blob.type !== "text/html" ? blob.type : getMimeTypeFromExtension(filename);

        return new File([blob], filename, { type: mimeType });
    };


    // Handle file input change
    const handleFileChange = (event, setPreview, setFile) => {
        const file = event.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setFile(file);
        }
    };

    const handleAddCategory = async (values, actions) => {
        const formData = new FormData();

        if (parentCategory.length > 10) {
            formData.append('category', parentCategory);
        }

        if (selectedCategory) {
            console.log('in update')
            formData.append("name", values.name);

            iconFile ? formData.append("icon", iconFile) : ''
            imageFile ? formData.append("image", imageFile) : ''

            console.log(iconFile)
            console.log(imageFile)
            console.log(formData)

            const response = await axios.put(`/categories/${selectedCategory._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            console.log("did update: " + response);

        } else {
            // Create a new Category
            Object.keys(values).forEach((key) => {
                if (key === "icon" || key === "image") {
                    formData.append(key, values[key]?.[0]); // Ensure it's a File
                } else {
                    formData.append(key, values[key]);
                }
            });

            try {
                console.log(values)
                const res = await axios.post('/categories', formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success('تم إضافة قسم جديد بنجاح.')
                console.log(res);
            } catch (error) {
                toast.error('حدث خطأ, الرجاء المحاولة مرة أخري.')
                console.error(error);
            }
        }
        window.location.reload();
        setSelectedCategory(null);
        actions.resetForm();
        setCateIcon('');
        setCateImage('');
    };

    const getAllCategories = async () => {
        try {
            const res = await axios.get('/categories');
            console.log(res);
            setCategories(res.data)
        } catch (error) {
            console.error(error);
        }
    }

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        console.log(category);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to form
        }, 100);

        setIconPreview(`${baseUrl}/${category.icon.url.replace(/\\/g, '/')}`);
        setImagePreview(`${baseUrl}/${category.image.url.replace(/\\/g, '/')}`);
    };

    const handleDeleteCategory = async (cateId) => {
        try {
            const res = await axios.delete(`/categories/${cateId}`);
            console.log(res);
            setIsDelete({ display: false, cateId: '', name: '' });
            const remainUsers = categories.filter(item => item._id !== cateId);
            setCategories(remainUsers);
            toast.success('تم حذف القسم بنجاح.');
        } catch (error) {
            console.error(error);
            toast.error('هذا القسم ما يزال به منتجات, لذا لا يمكن حذف.');
        }
    }

    useEffect(() => {
        getAllCategories();
    }, []);

    return (
        <div>
            <div className='custom-bg-white mt-8'>
                <div className='relative max-w-max flex items-center justify-center gap-2 mb-8 mx-auto'>
                    <ChartColumnStacked />
                    <h2 className='font-bold'>قائمة الأقسام</h2>
                    <span className='absolute -bottom-1 right-0 w-[60%] h-[2px] bg-indigo-200 rounded-sm'></span>
                </div>
                {categories && categories.length > 0 ? (
                    <div className='flex flex-col gap-4 items-center'>
                        {categories.map(item => {
                            return (
                                <div key={item._id} className='w-full flex items-center justify-between border-b border-gray-300 pb-4'>
                                    <p className='min-w-40 text-center'>{item.name}</p>
                                    <div className='flex flex-col md:flex-row gap-6'>
                                        <button className="w-30 py-2 px-4 bg-gray-600 text-white shadow-sm rounded-full duration-500 hover:bg-gray-700" onClick={() => handleEditCategory(item)}>تعديل</button>
                                        <button className="w-30 py-2 px-4 bg-red-500 text-white shadow-sm rounded-full duration-500 hover:bg-red-600" onClick={() => setIsDelete({ display: true, cateId: item._id, name: item.name })}>حذف</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div></div>
                )}
            </div>

            {/* User Popup */}
            {isDelete.display && (
                <div className='custom-bg-white fixed top-[50%] left-[50%] translate-[-50%] z-80 flex flex-col gap-8 shadow-md'>
                    <p className='text-center w-full text-gray-900'>هل انت متأكد من حذف قسم: <span className='font-semibold'>{isDelete.name}</span> ؟</p>
                    <div className='flex justify-center gap-4'>
                        <button type='button' className='w-20 bg-red-500 text-white rounded-full py-2 px-4 duration-500 hover:bg-red-600' onClick={() => handleDeleteCategory(isDelete.cateId)}>yes</button>
                        <button type='button' className='w-20 bg-gray-300 text-gray-900 rounded-full py-2 px-4 duration-500 hover:bg-gray-400' onClick={() => setIsDelete({ display: false, cateId: '', name: '' })}>No</button>
                    </div>
                </div>
            )}

            <div className="custom-bg-white mt-8" ref={formRef}>
                <Formik
                    enableReinitialize
                    initialValues={{
                        name: selectedCategory ? selectedCategory.name : '',
                        icon: selectedCategory ? selectedCategory.icon : null,
                        image: selectedCategory ? selectedCategory.image : null,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleAddCategory}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form className="w-full p-4 space-y-4">
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8'>
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="custom-label-field">
                                        اسم القسم
                                    </label>
                                    <Field
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="custom-input-field"
                                    />
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                                </div>

                                {/* category Field */}
                                <div>
                                    <label htmlFor="category" className="custom-label-field">
                                        category
                                    </label>
                                    <Field
                                        as='select'
                                        type="text"
                                        id="category"
                                        name="category"
                                        className="custom-input-field"
                                        onChange={(e) => setParentCategory(e.target.value)}
                                    >
                                        <option value="">اختر قسم الأب</option>
                                        {categories && categories.map(item => {
                                            return (
                                                <option value={item._id} key={item._id}>{item.name}</option>
                                            )
                                        })}
                                    </Field>
                                    {/* <ErrorMessage name="category" component="div" className="text-red-500 text-sm" /> */}
                                </div>

                                {/* Icon Image Field */}
                                <div>
                                    <label htmlFor="icon" className="custom-label-field">
                                        أيقونة القسم
                                    </label>
                                    <div
                                        className="relative flex items-center justify-center w-full h-20 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer bg-purple-100"
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                handleFileChange(e, setIconPreview, setIconFile);
                                                // Use Formik's setFieldValue to handle file input
                                                setFieldValue('icon', e.currentTarget.files);
                                            }}
                                        />
                                        {/* {iconPreview && <img src={iconPreview} alt="Icon Preview" width={50} />} */}
                                        {iconPreview ? (
                                            <img src={iconPreview} alt="Icon Preview" className="h-full object-cover rounded-md" />
                                        ) : (
                                            <span className="text-purple-600">اضغط لتحميل صوره الأيقونة  </span>
                                        )}
                                    </div>
                                    <ErrorMessage name="icon" component="div" className="text-red-500 text-sm" />
                                </div>

                                {/* Category Image Field */}
                                <div>
                                    <label htmlFor="image" className="custom-label-field">
                                        صورة القسم
                                    </label>
                                    <div
                                        className="relative flex items-center justify-center w-full h-20 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer bg-purple-100"
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                handleFileChange(e, setImagePreview, setImageFile);
                                                // Use Formik's setFieldValue to handle file input
                                                setFieldValue('image', e.currentTarget.files);
                                            }}
                                        />
                                        {/* {imagePreview && <img src={imagePreview} alt="Image Preview" width={50} />} */}
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Image Preview" className="h-full object-cover rounded-md" />
                                        ) : (
                                            <span className="text-purple-600">اضغط لتحميل صوره القسم الرئيسية </span>
                                        )}
                                    </div>
                                    <ErrorMessage name="image" component="div" className="text-red-500 text-sm" />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className='mt-8 mx-auto text-center'>
                                <button
                                    type="submit"
                                    className="min-w-60 px-4 py-2 bg-indigo-500 text-white rounded-lg duration-500 hover:bg-indigo-600"
                                >
                                    {isSubmitting ? 'جار الإضافة...' : 'إضافة'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AddCategory;