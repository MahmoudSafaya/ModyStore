import React from "react";
import { Field, FieldArray, ErrorMessage } from "formik";

const ProductForm = ({ values }) => {
  return (
    <div className="mt-8">
      <FieldArray name="items">
        {({ push }) => (
          <div>
            {values.items.map((_, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-b border-gray-300 pb-8">
                <div className="flex flex-col gap-2">
                  <label className="text-gray-500 cursor-pointer">الاسم:</label>
                  <Field
                    name={`items.${index}.englishName`}
                    placeholder="اسم المنتج"
                    className="custom-input-field text-gray-800"
                  />
                  <ErrorMessage
                    name={`items.${index}.englishName`}
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-gray-500 cursor-pointer">سعر المنتج:</label>
                  <Field
                    name={`items.${index}.itemValue`}
                    placeholder="سعر المنتج"
                    className="custom-input-field text-gray-800"
                  />
                  <ErrorMessage
                    name={`items.${index}.itemValue`}
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
              </div>
            ))}

            {/* Button to add a new item */}
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg duration-500 hover:bg-indigo-600"
              onClick={() => push({
                englishName: "",
                number: 1,
                itemType: "ITN16",
                itemName: "",
                priceCurrency: "DHS",
                itemValue: "",
                chineseName: "",
                itemUrl: "",
                desc: ""
              })}
            >
              إضافة منتج اخر
            </button>
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export default ProductForm;
