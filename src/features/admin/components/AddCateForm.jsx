import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useApp } from '../../../context/AppContext';

const AddCateForm = ({ selectedCategory, handleAddCategory, iconPreview, setIconPreview, imagePreview, setImagePreview, parentCategory, setParentCategory, setIconFile, setImageFile }) => {

    const { getMainCategories, mainCategories } = useApp();

    useEffect(() => {
        getMainCategories();
    }, []);

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

    return (
        <div>
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
                                    autoComplete="diff-password"
                                />
                                <ErrorMessage name="name" component="div" className="text-red-400 text-sm" />
                            </div>

                            {/* category Field */}
                            <div>
                                <label htmlFor="category" className="custom-label-field">
                                    قسم الأب
                                </label>
                                <Field
                                    as='select'
                                    type="text"
                                    id="category"
                                    name="category"
                                    className="custom-input-field cursor-pointer"
                                    value={parentCategory}
                                    onChange={(e) => {
                                        setParentCategory(e.target.value);
                                        setFieldValue('category', e.target.value);
                                    }}
                                >
                                    <option value="">اختر قسم الأب</option>
                                    {mainCategories && mainCategories.map(item => {
                                        return (
                                            <option
                                                value={item._id}
                                                key={item._id}
                                                className={`${item._id === selectedCategory?._id ? 'text-gray-400 opacity-50' : ''}`}
                                                disabled={item._id === selectedCategory?._id}
                                            >
                                                {item.name}
                                            </option>
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
                                        id='icon'
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
                                        <span className="text-purple-600 text-center">اضغط لتحميل صوره الأيقونة  </span>
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
                                        id='image'
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
                                        <span className="text-purple-600 text-center">اضغط لتحميل صوره القسم الرئيسية </span>
                                    )}
                                </div>
                                <ErrorMessage name="image" component="div" className="text-red-400 text-sm" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className='mt-8 mx-auto text-center'>
                            <button
                                type="submit"
                                className={`w-full md:w-auto md:min-w-60 px-4 py-2 text-white rounded-lg duration-500 transition-all ${selectedCategory ? 'bg-gray-600 hover:bg-gray-700' : 'bg-indigo-500 hover:bg-indigo-600'}`}
                            >
                                {selectedCategory ? (isSubmitting ? 'جار التحديث...' : 'تحديث البيانات') : (isSubmitting ? 'جار الإضافة...' : 'إضافة')}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddCateForm