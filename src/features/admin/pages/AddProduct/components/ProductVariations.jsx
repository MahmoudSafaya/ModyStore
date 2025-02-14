import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";

const ProductVariations = () => {
  const [variations, setVariations] = useState([]);

  const addVariation = () => {
    setVariations([...variations, { size: "", color: "", stock: "" }]);
  };

  const updateVariation = (index, field, value) => {
    const updatedVariations = [...variations];
    updatedVariations[index][field] = value;
    setVariations(updatedVariations);
    console.log(variations)
  };

  const handleRemoveVariation = (index) => {
    const newVariations = variations.filter((_, i) => i !== index);
    setVariations(newVariations);
  };

  return (
    <div className="custom-bg-white mt-8">
      <h2 className="custom-header">Add Product Variations</h2>
      <form>
        {variations.map((variation, variationIndex) => (
          <div key={variationIndex} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <select
                id="options"
                name="options"
                value={variation.size}
                onChange={(e) => updateVariation(variationIndex, "size", e.target.value)}
                className="custom-input-field"
              >
                <option value="">Select...</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
              
              <input type="text" placeholder="Color" value={variation.color} onChange={(e) => updateVariation(variationIndex, "color", e.target.value)} className="custom-input-field" />
              <input type="number" placeholder="Stock" value={variation.stock} onChange={(e) => updateVariation(variationIndex, "stock", e.target.value)} className="custom-input-field" />
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
      </form>
    </div>
  );
};

export default ProductVariations;