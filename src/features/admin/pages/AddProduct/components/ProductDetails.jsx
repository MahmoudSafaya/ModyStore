import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Field, ErrorMessage } from "formik";

const ProductDetails = ({values, setFieldValue}) => {

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
        ],
    };

    return (
        <div className="custom-bg-white">
            <h2 className='custom-header'>معلومات المنتج</h2>
            <div className="flex flex-col gap-2">
                <label className="custom-label-field">اسم المنتج:</label>
                <Field name="name" type="text" className="custom-input-field" />
                <ErrorMessage name="name" component="div" className="text-red-500" />
            </div>
            <div className="flex flex-col gap-2 mt-6">
                <label htmlFor="description" className="mb-1 custom-label-field">وصف المنتج</label>
                <ReactQuill
                    id='description'
                    value={values.description}
                    onChange={(value) => setFieldValue("description", value)}
                    modules={modules}
                    placeholder="اكتب وصف مميز للمنتج..."
                />
                <ErrorMessage name="description" component="div" className="text-red-500" />
            </div>
        </div>
    )
}

export default ProductDetails