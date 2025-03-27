import React, { useState } from 'react'
import { Field, ErrorMessage } from "formik";
import { useEffect } from 'react';
import { useApp } from '../../../../../context/AppContext';

const categoriesList = ["Computer", "Watches", "Headphones", "Beauty", "Fashion", "Accessories"];

const ProductCategory = () => {
    // Code for Category Section
    const [selectedCategories, setSelectedCategories] = useState(["Watches"]);
    const [newCategory, setNewCategory] = useState('');

    const { getAllCategories, categories } = useApp();

    const handleNewCategory = () => {
        categoriesList.push(newCategory);
        setSelectedCategories([...selectedCategories, newCategory]);
        setNewCategory('');
    }

    useEffect(() => {
        getAllCategories();
    }, [])

    return (
        <div className="mt-8 custom-bg-white">
            <h2 className="custom-header">قسم المنتج</h2>
            <div className="flex flex-col gap-2 relative">
                <Field as="select" name='category' className='custom-input-field max-h-40 text-gray-800' >
                    <option value="">اختر قسم المنتج</option>
                    {categories && categories.map(item => {
                        return (
                            <option key={item._id} value={item._id}>{item.name}</option>
                        )
                    })}
                </Field>
                <ErrorMessage name="category" component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
            </div>
        </div>
    )
}

export default ProductCategory