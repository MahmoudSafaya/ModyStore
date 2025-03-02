import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Field, ErrorMessage } from 'formik';
import { useEffect } from 'react';

const ProductVariations = ({ setFieldValue, variations, setVariations }) => {

  const addVariation = () => {
    setVariations([...variations, { size: "", color: "", stock: "" }]);
  };

  const updateVariation = (index, field, value) => {
    const updatedVariations = [...variations];
    updatedVariations[index][field] = value;
    setVariations(updatedVariations);
  };

  const handleRemoveVariation = (index) => {
    const newVariations = variations.filter((_, i) => i !== index);
    setVariations(newVariations);
  };

  // useEffect(() => {
  //   if (isSubmitting) {
  //     setVariations([{ size: "", color: "", stock: "" }]);
  //   }
  // }, [isSubmitting])

  return (
    <div className="custom-bg-white mt-8">
      <h2 className="custom-header">Add Product Variations</h2>
      {variations && variations.map((variation, variationIndex) => (
        <div key={variationIndex} className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div>
              <Field name={`variants[${variationIndex}].size`} type="text" value={variation.size} onChange={(e) => {
                updateVariation(variationIndex, "size", e.target.value);
                setFieldValue(`variants[${variationIndex}].size`, e.target.value)
              }} className="custom-input-field" placeholder="Size" />
              <ErrorMessage name={`variants[${variationIndex}].size`} component="div" className="text-red-500" />
            </div>

            <div>
              <Field name={`variants[${variationIndex}].color`} type="text" value={variation.color} onChange={(e) => {
                updateVariation(variationIndex, "color", e.target.value);
                setFieldValue(`variants[${variationIndex}].color`, e.target.value)
              }} className="custom-input-field" placeholder="Color" />
              <ErrorMessage name={`variants[${variationIndex}].color`} component="div" className="text-red-500" />
            </div>

            <div>
              <Field name={`variants[${variationIndex}].stock`} type="number" value={variation.stock} onChange={(e) => {
                updateVariation(variationIndex, "stock", e.target.value);
                setFieldValue(`variants[${variationIndex}].stock`, e.target.value)
              }} className="custom-input-field" placeholder="Stock" />
              <ErrorMessage name={`variants[${variationIndex}].stock`} component="div" className="text-red-500" />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveVariation(variationIndex)}
              className="bg-red-200 text-red-400 text-2xl w-20 h-10 flex-grow rounded-lg flex justify-center items-center duration-500 hover:bg-red-500 hover:text-white"
            >
              <IoClose />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addVariation}
        className="block mt-8 w-full py-3 px-5 text-center bg-indigo-200 text-indigo-600 duration-500 rounded-xl hover:bg-indigo-500 hover:text-white"
      >
        Add Variation
      </button>
    </div>
  );
};

export default ProductVariations;