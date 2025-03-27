import React from 'react';
import { IoClose } from "react-icons/io5";
import { Field, ErrorMessage } from 'formik';
import toast, { Toaster } from 'react-hot-toast';

const ProductVariations = ({ setFieldValue, variations, setVariations }) => {

  const addVariation = () => {
    if (variations.some(v => v.size || v.color)) {
      // If at least one variant has size or color, allow adding a new empty variant
      setVariations([...variations, { barCode: "", size: "", color: "", stock: "" }]);
    } else {
      // If no variant has size or color, keep only the stock in the first variant
      setVariations([{ barCode: variations[0].barCode, size: variations[0].size, color: variations[0].color, stock: variations[0].stock }]);
      toast('الرجاء, إضافة مقاس او لون اولا.')
    }
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

  return (
    <div className="custom-bg-white mt-8">
      <h2 className="custom-header">متغيرات المنتج</h2>
      {variations && variations.map((variation, variationIndex) => (
        <div key={variationIndex} className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className='relative'>
              <Field name={`variants[${variationIndex}].size`} type="text" value={variation.size} onChange={(e) => {
                updateVariation(variationIndex, "size", e.target.value);
                setFieldValue(`variants[${variationIndex}].size`, e.target.value)
              }} className="custom-input-field" placeholder="الحجم" />
              <ErrorMessage name={`variants[${variationIndex}].size`} component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
            </div>

            <div className='relative'>
              <Field name={`variants[${variationIndex}].color`} type="text" value={variation.color} onChange={(e) => {
                updateVariation(variationIndex, "color", e.target.value);
                setFieldValue(`variants[${variationIndex}].color`, e.target.value)
              }} className="custom-input-field" placeholder="اللون" />
              <ErrorMessage name={`variants[${variationIndex}].color`} component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
            </div>

            <div className='relative'>
              <Field name={`variants[${variationIndex}].stock`} type="number" value={variation.stock} onChange={(e) => {
                updateVariation(variationIndex, "stock", e.target.value);
                setFieldValue(`variants[${variationIndex}].stock`, e.target.value)
              }} className="custom-input-field" placeholder="الكمية" />
              <ErrorMessage name={`variants[${variationIndex}].stock`} component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
            </div>

            {variationIndex !== 0 && (
              <button
                type="button"
                name='x-close-btn'
                onClick={() => handleRemoveVariation(variationIndex)}
                className="bg-red-200 text-red-400 text-2xl w-20 h-10 flex-grow rounded-lg flex justify-center items-center duration-500 hover:bg-red-500 hover:text-white"
              >
                <IoClose />
              </button>
            )}
          </div>
        </div>
      ))}
      <button
        type="button"
        name='new-variant-btn'
        onClick={addVariation}
        className="block mt-8 w-full py-3 px-5 text-center bg-indigo-200 text-indigo-600 duration-500 rounded-xl hover:bg-indigo-500 hover:text-white"
      >
        إضافة متغير جديد
      </button>

      <Toaster />
    </div>
  );
};

export default ProductVariations;