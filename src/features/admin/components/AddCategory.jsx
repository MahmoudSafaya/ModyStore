import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { axiosAuth } from '../../../api/axios';
import { Toaster } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { BiCategory } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { useApp } from '../../../context/AppContext';
import { A_DeleteConfirmModal } from '.';
import { ChevronDown } from "lucide-react";
import AddCateForm from './AddCateForm';

const AddCategory = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [parentCategory, setParentCategory] = useState('');
    const [iconFile, setIconFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const { getMainCategories, getSubcategories, mainCategories, subcategories, isDelete, setIsDelete, successNotify, deleteNotify, errorNotify } = useApp();

    const [iconPreview, setIconPreview] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);

    const baseUrl = import.meta.env.VITE_SERVER_URL;

    const formRef = useRef(null); // Ref for scrolling
    const [reload, setReload] = useState(false);

    useEffect(() => {
        getMainCategories();
    }, []);


    const handleAddCategory = async (values, actions) => {
        const formData = new FormData();

        // if (parentCategory.length > 10) {
        //     formData.append('category', parentCategory);
        // }

        if (selectedCategory) {
            if (!parentCategory) {

            } else {
                formData.append('category', parentCategory);
            }
            formData.append("name", values.name);

            iconFile ? formData.append("icon", iconFile) : ''
            imageFile ? formData.append("image", imageFile) : ''

            await axiosAuth.put(`/categories/${selectedCategory._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            })
            successNotify('تم تعديل القسم بنجاح.');
            setReload((prev) => !prev); // Toggle state to force re-render
            actions.resetForm();
            setIconFile(null);
            setImageFile(null);
            setImagePreview(null);
            setIconPreview(null);
            setSelectedCategory(null);
            setOpenDropdown(null);
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
                await axiosAuth.post('/categories', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                });
                successNotify('تم إضافة قسم جديد بنجاح.');
                setTimeout(() => {
                    getMainCategories();
                }, 300);
            } catch (error) {
                errorNotify('حدث خطأ, الرجاء المحاولة مرة أخري.')
                console.error(error);
            }
            setReload((prev) => !prev); // Toggle state to force re-render
            actions.resetForm();
            setIconFile(null);
            setImageFile(null);
            setImagePreview(null);
            setIconPreview(null);
            setSelectedCategory(null);
        }
    };


    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setParentCategory(category.category ? category.category : '');
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to form
        }, 100);

        setIconPreview(`${baseUrl}/${category.icon.url.replace(/\\/g, '/')}`);
        setImagePreview(`${baseUrl}/${category.image.url.replace(/\\/g, '/')}`);
    };

    const handleDeleteCategory = async (cateId) => {
        try {
            await axiosAuth.delete(`/categories/${cateId}`);
            setIsDelete({ purpose: '', itemId: '', itemName: '' });
            getMainCategories();
            deleteNotify('تم حذف القسم بنجاح.');
        } catch (error) {
            console.error(error);
            errorNotify('هذا القسم ما يزال به منتجات او اقسام, لذا لا يمكن حذف.');
        }
    }

    const handleDropDown = (cateId) => {
        if (openDropdown === cateId) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(cateId);
        }
    }

    return (
        <div className='lg:grid grid-cols-2 gap-6'>
            <div className='custom-bg-white max-h-120 mt-8 overflow-y-auto scrollbar'>
                <div className='relative max-w-max flex items-center justify-center gap-2 mb-8 mx-auto'>
                    <BiCategory />
                    <h2 className='font-bold'>قائمة الأقسام</h2>
                    <span className='absolute -bottom-1 right-0 w-[60%] h-[2px] bg-indigo-200 rounded-sm'></span>
                </div>

                <div>
                    {mainCategories ? (
                        mainCategories.map((category) => (
                            <div key={category._id} className="relative">
                                {/* Main Category */}
                                <div
                                    onLoad={() => getSubcategories(category._id)}
                                >
                                    <div className='w-full flex items-center justify-between border-b border-gray-300 pb-4'>
                                        <div>
                                            <div className={`group flex items-center flex-grow py-4 cursor-pointer px-6 gap-4`}
                                                onClick={() => handleDropDown(category._id)}>
                                                <div>
                                                    <img
                                                        src={encodeURI(`${baseUrl}/${category.image.url.replace(/\\/g, '/')}`)}
                                                        alt={category.image.alt}
                                                        className="w-8 h-8 rounded-lg"
                                                    />
                                                </div>
                                                <div className='text-gray-700'>
                                                    <p className="text-base font-semibold">{category.name}</p>
                                                </div>
                                                {
                                                    subcategories[category._id]?.length > 0 && (
                                                        <div>
                                                            <ChevronDown className='w-5 h-5 duration-500 group-hover:rotate-45 group-hover:text-indigo-500' />
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>

                                        <div className="flex gap-6">
                                            <div className='cursor-pointer duration-500 hover:text-indigo-500 hover:rotate-45' onClick={() => handleEditCategory(category)}>
                                                <FaRegEdit className="w-5 h-5" />
                                            </div>
                                            <div className='cursor-pointer duration-500 hover:text-red-500 hover:rotate-45 rounded-b-lg' onClick={() => setIsDelete({ purpose: 'one-category', itemId: category._id, itemName: category.name })}>
                                                <Trash className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subcategories (Shown inline, not absolute) */}
                                    {openDropdown === category._id && subcategories[category._id]?.length > 0 && (
                                        <div className="bg-gray-50">
                                            {subcategories[category._id].map((sub) => (
                                                <div key={sub._id} className='w-full flex items-center justify-between border-b border-gray-300 pb-4 pr-8 opacity-75'>
                                                    <div>
                                                        <div className={`group flex items-center flex-grow py-4 hover:text-indigo-600 cursor-pointer duration-500 px-6 gap-4`}>
                                                            <div>
                                                                <img
                                                                    src={encodeURI(`${baseUrl}/${sub.image.url.replace(/\\/g, '/')}`)}
                                                                    alt={sub.image.alt}
                                                                    className="w-8 h-8 rounded-lg"
                                                                />
                                                            </div>
                                                            <div className='text-gray-700'>
                                                                <p className="text-base font-semibold">{sub.name}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-6">
                                                        <div className='cursor-pointer duration-500 hover:text-indigo-500 hover:rotate-45' onClick={() => handleEditCategory(sub)}>
                                                            <FaRegEdit className="w-5 h-5" />
                                                        </div>
                                                        <div className='cursor-pointer duration-500 hover:text-red-500 hover:rotate-45 rounded-b-lg' onClick={() => setIsDelete({ purpose: 'one-category', itemId: sub._id, itemName: sub.name })}>
                                                            <Trash className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='text-center'>
                            <p>القائمة فارغة, الرجاء إضافة بعض الأقسام.</p>
                        </div>
                    )}
                </div>
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

                <AddCateForm key={reload} selectedCategory={selectedCategory} handleAddCategory={handleAddCategory} iconPreview={iconPreview} setIconPreview={setIconPreview} imagePreview={imagePreview} setImagePreview={setImagePreview} parentCategory={parentCategory} setParentCategory={setParentCategory} setIconFile={setIconFile} setImageFile={setImageFile} />
            </div>

            <Toaster />
        </div>
    );
};

export default AddCategory;