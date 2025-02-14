import { useState } from 'react'
import { AiFillDelete } from "react-icons/ai";

const ProductImages = () => {
    const [productImages, setProductImages] = useState([]);

    // Code for uploading multiple images for the product
    const handleProductImages = (event) => {
        const newFiles = Array.from(event.target.files);
        const previewFiles = newFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
        );
        setProductImages([...productImages, ...previewFiles]);

        // Reset the input field to allow re-selection of the same file
        event.target.value = null;
    };
    const handleDeleteImage = (index) => {
        setProductImages((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <div className="custom-bg-white mt-8">
            <label className="p-6 w-full flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-lg cursor-pointer bg-purple-100">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleProductImages}
                />
                <span className="text-gray-600">اضغط لتحميل صور للمنتج</span>
            </label>
            {productImages.length > 0 && (
                <div className="mt-4 p-4 bg-purple-100 rounded-lg flex gap-4 overflow-x-auto">
                    {productImages.map((file, index) => (
                        <div key={index} className="group relative w-20 h-20 rounded-lg overflow-hidden">
                            <img
                                src={file.preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-0 right-0 w-full h-full z-10 duration-300 opacity-0 group-hover:opacity-100 flex bg-[#00000025] justify-center items-center cursor-pointer"
                                onClick={() => handleDeleteImage(index)}
                            >
                                <AiFillDelete className="text-4xl text-red-600" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProductImages