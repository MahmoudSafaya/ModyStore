import React from "react";
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

            </div>
          ))}
        </div>
      </FieldArray>

    </div>
  );
};

export default ProductForm;
