import React from "react";
import InputField from "./InputField";
import { Field, FieldArray, ErrorMessage } from "formik";

const ProductForm = ({ values }) => {
  return (
    <div className="mt-8">

      <FieldArray name="items">
        <div>
          {values.items.map((_, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-b border-gray-300 pb-8">

              <div className="flex flex-col gap-2">
                <label className="text-gray-500 cursor-pointer">الاسم: <span className="text-red-400">*</span></label>
                <Field name={`items.${index}.englishName`} placeholder='وصف المنتج' className="custom-input-field text-gray-800" />
                <ErrorMessage
                  name={`items.${index}.englishName`}
                  component="div"
                  style={{ color: "red" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-500 cursor-pointer">سعر المنتج: <span className="text-red-400">*</span></label>
                <Field name={`items.${index}.itemValue`} placeholder='سعر المنتج' className="custom-input-field text-gray-800" />
                <ErrorMessage
                  name={`items.${index}.itemValue`}
                  component="div"
                  style={{ color: "red" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-500 cursor-pointer">نوع المنتج: <span className="text-red-400">*</span></label>
                <Field as="select" name={`items.${index}.itemType`} className='custom-input-field max-h-40 text-gray-800' >
                  <option value="">اختر نوع المنتج</option>
                  <option value="ITN1">Clothes</option>
                  <option value="ITN2">Document</option>
                  <option value="ITN3">Food</option>
                  <option value="ITN5">Digital product</option>
                  <option value="ITN6">Daily necessities</option>
                  <option value="ITN7">Fragile Items</option>
                  <option value="ITN8">Tools</option>
                  <option value="ITN9">Stationery</option>
                  <option value="ITN10">Furniture</option>
                  <option value="ITN11">Certificate</option>
                  <option value="ITN12">Machine Parts</option>
                  <option value="ITN13">handicraft</option>
                  <option value="ITN14">Production Materials</option>
                  <option value="ITN15 ">Books</option>
                  <option value="ITN16 ">Other</option>
                </Field>
                <ErrorMessage name={`items.${index}.itemType`} component="div" className="error" />
              </div>

            </div>
          ))}
        </div>
      </FieldArray>

    </div>
  );
};

export default ProductForm;
