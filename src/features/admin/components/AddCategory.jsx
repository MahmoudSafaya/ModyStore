import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from '../../../api/axios';
import { Toaster } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { BiCategory } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { useApp } from '../../../context/AppContext';
import { A_DeleteConfirmModal } from '.';

const AddCategory = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [parentCategory, setParentCategory] = useState('');

    const { getAllCategories, categories, setCategories, isDelete, setIsDelete, successNotify, deleteNotify, errorNotify } = useApp();

    const [iconFile, setIconFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const baseUrl = import.meta.env.VITE_SERVER_URL;

    const formRef = useRef(null); // Ref for scrolling

    const validationSchema = Yup.object({
        name: Yup.string().required('هذا الحقل مطلوب'),
        icon: Yup.mixed().required('هذا الحقل مطلوب'),
        image: Yup.mixed().required('هذا الحقل مطلوب'),
    });

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
            formData.append("name", values.name);

            iconFile ? formData.append("icon", iconFile) : ''
            imageFile ? formData.append("image", imageFile) : ''

            await axios.put(`/categories/${selectedCategory._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            successNotify('تم تعديل القسم بنجاح.')

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
                await axios.post('/categories', formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                successNotify('تم إضافة قسم جديد بنجاح.');
            } catch (error) {
                errorNotify('حدث خطأ, الرجاء المحاولة مرة أخري.')
                console.error(error);
            }
        }
        window.location.reload();
        setSelectedCategory(null);
        actions.resetForm();
        setCateIcon('');
        setCateImage('');
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to form
        }, 100);

        setIconPreview(`${baseUrl}/${category.icon.url.replace(/\\/g, '/')}`);
        setImagePreview(`${baseUrl}/${category.image.url.replace(/\\/g, '/')}`);
    };

    const handleDeleteCategory = async (cateId) => {
        try {
            await axios.delete(`/categories/${cateId}`);
            setIsDelete({ purpose: '', itemId: '', itemName: '' });
            const remainUsers = categories.filter(item => item._id !== cateId);
            setCategories(remainUsers);
            deleteNotify('تم حذف القسم بنجاح.');
        } catch (error) {
            console.error(error);
            errorNotify('هذا القسم ما يزال به منتجات, لذا لا يمكن حذف.');
        }
    }

    useEffect(() => {
        getAllCategories();
    }, []);

    return (
        <div className='lg:grid grid-cols-2 gap-6'>
            <div className='custom-bg-white max-h-max mt-8'>
                <div className='relative max-w-max flex items-center justify-center gap-2 mb-8 mx-auto'>
                    <BiCategory />
                    <h2 className='font-bold'>قائمة الأقسام</h2>
                    <span className='absolute -bottom-1 right-0 w-[60%] h-[2px] bg-indigo-200 rounded-sm'></span>
                </div>
                {categories && categories.length > 0 ? (
                    <div className='flex flex-col gap-4 items-center'>
                        {categories.map(item => {
                            return (
                                <div key={item._id} className='w-full flex items-center justify-between border-b border-gray-300 pb-4'>
                                    <div className='flex items-center gap-2'>
                                        <div>
                                            <img src={`${baseUrl}/${item.image.url.replace(/\\/g, '/')}`} alt={item.image.alt} className='w-8 h-8 rounded-lg shadow-sm' />
                                        </div>
                                        <p className='text-center'>{item.name}</p>
                                    </div>
                                    {/* <div className='flex flex-col md:flex-row gap-6'>
                                        <button className="min-w-30 py-2 px-4 bg-gray-600 text-white shadow-sm rounded-lg duration-500 hover:bg-gray-700" onClick={() => handleEditCategory(item)}>تعديل</button>
                                        <button className="min-w-30 py-2 px-4 bg-red-500 text-white shadow-sm rounded-lg duration-500 hover:bg-red-600" onClick={() => setIsDelete({ purpose: 'one-category', itemId: item._id, itemName: item.name })}>حذف</button>
                                    </div> */}
                                    <div className="flex gap-6">
                                        <div className='cursor-pointer duration-500 hover:text-indigo-500 hover:rotate-45' onClick={() => handleEditCategory(item)}>
                                            <FaRegEdit className="w-5 h-5" />
                                        </div>
                                        <div className='cursor-pointer duration-500 hover:text-red-500 hover:rotate-45 rounded-b-lg' onClick={() => setIsDelete({ purpose: 'one-category', itemId: item._id, itemName: item.name })}>
                                            <Trash className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div></div>
                )}
            </div>


            {isDelete.purpose === 'one-category' && (
                <A_DeleteConfirmModal itemName={isDelete.itemName} deleteFun={() => handleDeleteCategory(isDelete.itemId)} setIsDelete={setIsDelete} />
            )}

            <div className="custom-bg-white max-h-max mt-8" ref={formRef}>
                <div className='relative max-w-max flex items-center justify-center gap-2 mb-8 mx-auto'>
                    <BiCategory />
                    <h2 className='font-bold'>إضافة قسم جديد</h2>
                    <span className='absolute -bottom-1 right-0 w-[60%] h-[2px] bg-indigo-200 rounded-sm'></span>
                </div>
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
                        <Form>
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
                                        placeholder="اسم القسم"
                                        className="custom-input-field"
                                    />
                                    <ErrorMessage name="name" component="div" className="text-red-400 text-sm" />
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
                                    {/* <ErrorMessage name="category" component="div" className="text-red-400 text-sm" /> */}
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
                                    <ErrorMessage name="icon" component="div" className="text-red-400 text-sm" />
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
                                    <ErrorMessage name="image" component="div" className="text-red-400 text-sm" />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className='mt-8 mx-auto text-center'>
                                <button
                                    type="submit"
                                    className="w-full md:w-auto md:min-w-60 px-4 py-2 bg-indigo-500 text-white rounded-lg duration-500 hover:bg-indigo-600"
                                >
                                    {selectedCategory ? (isSubmitting ? 'جار التعديل...' : '  تعديل') : (isSubmitting ? 'جار الإضافة...' : 'إضافة')}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

            <Toaster />
        </div>
    );
};

export default AddCategory;