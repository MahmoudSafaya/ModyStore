import React, { useState } from 'react'
import { Field, ErrorMessage } from "formik";
import { useEffect } from 'react';
import { useApp } from '../../../../../context/AppContext';

const categoriesList = ["Computer", "Watches", "Headphones", "Beauty", "Fashion", "Accessories"];

const ProductCategory = () => {
    // Code for Category Section
    const [selectedCategories, setSelectedCategories] = useState(["Watches"]);
    const [isAdding, setIsAdding] = useState(false);
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
            <div className="flex flex-col gap-2">
                <Field as="select" name='category' className='custom-input-field max-h-40 text-gray-800' >
                    <option value="">اختر قسم المنتج</option>
                    {categories && categories.map(item => {
                        return (
                            <option key={item._id} value={item._id}>{item.name}</option>
                        )
                    })}
                </Field>
                <ErrorMessage name="category" component="div" className="text-red-500" />
            </div>
            {/* <label className="custom-label-field mt-4 text-sm">Categories</label>
            <div className="mt-2 flex flex-wrap gap-2 border border-gray-300 p-2 rounded-lg">
                {selectedCategories.map((category) => (
                    <div
                        key={category}
                        className="flex items-center gap-2 bg-indigo-500 text-white px-2 py-1 rounded-full text-sm"
                    >
                        <span>{category}</span>
                        <button
                            onClick={() => removeCategory(category)}
                            className="text-white text-lg cursor-pointer hover:opacity-85 focus:outline-none"
                        >
                            <IoClose />
                        </button>
                    </div>
                ))}
                <Field name="category" type="text"
                    value={inputValue}
                    onChange={(e) => {
                        handleInputChange(e);
                        setFieldValue('category', e.target.value)
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="outline-none px-2 text-sm flex-1"
                    placeholder="Add category" />
                <ErrorMessage name="category" component="div" className="text-red-500" />
            </div>
            <div className="relative">
                {isFocused && (
                    <div className="bg-white mt-2 border border-gray-300 rounded-lg shadow max-h-40 overflow-y-auto absolute top-0 right-0 w-full">
                        {filteredCategories.map((category) => (
                            <div
                                key={category}
                                className={`p-2 cursor-pointer border-b border-gray-300 hover:bg-indigo-600 hover:text-white ${selectedCategories.includes(category) ? 'bg-indigo-600 text-white' : ''}`}
                                onClick={() => addCategory(category)}
                            >
                                {category}
                            </div>
                        ))}
                    </div>
                )}
            </div> */}
            {/* <button type='button' className="block mt-8 min-w-content py-3 px-5 text-center bg-indigo-200 text-indigo-600 duration-500 rounded-xl cursor-pointer hover:bg-indigo-500 hover:text-white"
                onClick={() => setIsAdding(!isAdding)}
            >
                {isAdding ? '-' : '+'} إضافة قسم جديد
            </button>
            <div className={`overflow-hidden duration-500 ${isAdding ? 'h-auto' : 'h-0'}`}>
                <label htmlFor="new-category" className="custom-label-field mt-4 mb-2">new category</label>
                <div className="flex">
                    <input type="text" placeholder="new-category" className="border border-gray-300 outline-none rounded-r-lg p-2 w-full" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                    <button className="w-content py-3 px-5 bg-indigo-500 text-white rounded-l-lg cursor-pointer" onClick={handleNewCategory}>إضافة</button>
                </div>
            </div> */}
        </div>
    )
}

export default ProductCategory