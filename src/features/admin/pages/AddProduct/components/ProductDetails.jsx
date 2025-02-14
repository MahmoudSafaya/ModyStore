import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ProductDetails = () => {
    const [value, setValue] = useState("");

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
                <label htmlFor="product-name" className="custom-label-field">اسم المنتج</label>
                <input type="text" name='product-name' id='product-name' placeholder='اسم المنتج مطلوب ويفضل يكون مميز...'
                    className="custom-input-field" />
            </div>
            <div className="flex flex-col gap-2 mt-6">
                <label htmlFor="product-description" className="mb-1 custom-label-field">وصف المنتج</label>
                <ReactQuill
                    value={value}
                    onChange={setValue}
                    modules={modules}
                    placeholder="اكتب وصف مميز للمنتج..."
                />
            </div>
        </div>
    )
}

export default ProductDetails