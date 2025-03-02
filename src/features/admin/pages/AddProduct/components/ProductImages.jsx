import { useState, useEffect } from 'react'
import { AiFillDelete } from "react-icons/ai";
import { ErrorMessage } from 'formik';

const ProductImages = ({ setFieldValue, productImages, setProductImages }) => {

    const baseUrl = import.meta.env.VITE_SERVER_URL;

    // Code for uploading multiple images for the product
    const handleProductImages = (event) => {
        const files = Array.from(event.currentTarget.files);

        // Validate files (size, type) before adding them
        // const validFiles = files.filter((file) =>
        //   ["image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= 2 * 1024 * 1024
        // );

        // Convert files to objects with previews
        const previewFiles = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        // Update Formik field and state
        setProductImages((prevImages) => [...prevImages, ...previewFiles]);
        setFieldValue("images", [...productImages.map((img) => img.file), ...files]); // Update Formik

        // Reset input field to allow re-selection of the same files
        event.currentTarget.value = null;
    };

    const handleDeleteImage = (index) => {
        setProductImages((prevFiles) => {
            const updatedFiles = prevFiles.filter((_, i) => i !== index);
            setFieldValue("images", updatedFiles.map((img) => img.file)); // Update Formik
            return updatedFiles;
        });
    };


    // useEffect(() => {
    //     if(isSubmitting) {
    //         setProductImages([])
    //     }
    // }, [isSubmitting]);

    return (
        <div className="custom-bg-white mt-8">
            <label className="p-6 w-full flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-lg cursor-pointer bg-purple-100">
                <input
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        handleProductImages(e);
                        // setFieldValue("images", e.currentTarget.files);
                    }}
                />
                <span className="text-gray-600">اضغط لتحميل صور للمنتج</span>
            </label>
            <ErrorMessage name="images" component="div" className="text-red-500" />

            {productImages?.length > 0 && (
                <div className="mt-4 p-4 bg-purple-100 rounded-lg flex gap-4 overflow-x-auto">
                    {productImages.map((file, index) => (
                        <div key={index} className="group relative w-20 h-20 rounded-lg overflow-hidden">
                            <img
                                src={file.url ? `${baseUrl}/${file.url.replace(/\\/g, '/')}` : file.preview}
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