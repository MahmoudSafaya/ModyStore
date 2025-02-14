import React, { useState } from "react";

const ProductTest = () => {
  const [mainImage, setMainImage] = useState(
    "https://images.pexels.com/assets/static/images/canva/photo-background-remover.png?w=600"
  );

  const thumbnails = [
    "https://images.pexels.com/assets/static/images/canva/photo-background-remover.png?w=600",
    "https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/848573/pexels-photo-848573.jpeg?auto=compress&cs=tinysrgb&w=600",
  ];

  const handleThumbnailHover = (image) => {
    setMainImage(image);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8">
      {/* Product Images Section */}
      <div className="flex-1">
        {/* Main Image with Zoom Effect */}
        <div className="relative overflow-hidden group">
          <img
            src={mainImage}
            alt="Main Product"
            className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Thumbnails */}
        <div className="flex gap-4 mt-4">
          {thumbnails.map((thumbnail, index) => (
            <img
              key={index}
              src={thumbnail}
              alt={`Thumbnail ${index + 1}`}
              className="w-20 h-20 cursor-pointer border-2 border-transparent hover:border-gray-400 transition-all duration-200"
              onMouseEnter={() => handleThumbnailHover(thumbnail)}
            />
          ))}
        </div>
      </div>

      {/* Product Info Section */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-4">Product Name</h1>
        <p className="text-gray-600 mb-4">
          This is a detailed description of the product. It includes all the
          features and benefits.
        </p>
        <p className="text-2xl font-semibold mb-4">$99.99</p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors duration-200">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductTest;