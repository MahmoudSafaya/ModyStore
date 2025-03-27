import React, { useState, useEffect } from "react";
import { Field, FieldArray, ErrorMessage } from "formik";
import { axiosAuth } from "../../../api/axios";
import Loading from "../../../shared/components/Loading";

const ProductForm = ({ values, setFieldValue, handleBlur }) => {
  const [firstOptions, setFirstOptions] = useState([]);
  const [showFirstOptions, setShowFirstOptions] = useState([]);

  const [selections, setSelections] = useState({});
  const [prices, setPrices] = useState({});
  const [quantities, setQuantities] = useState({});

  const [loading, setLoading] = useState(false);
  const [clientNotes, setClientNotes] = useState(values.remark.split('- ملحوظة العميل:')[1]);

  useEffect(() => {
    const fetchProductsNames = async () => {
      setLoading(true);
      try {
        const res = await axiosAuth.get("/products/search");
        setFirstOptions(res.data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsNames();
  }, []);

  useEffect(() => {
    if (values.items && values.items.length > 0) {
      const newSelections = {};
      const newPrices = {};
      const newQuantities = {};
      let newRemark = values.remark || ""; // Keep the existing remark

      values.items.forEach((item, index) => {
        newSelections[index] = item.englishName || "";
        newPrices[index] = item.itemValue || "";
        newQuantities[index] = item.number || 1; // Default to 1 if not provided

        // Append new values to remark if not already included
        if (!newRemark.includes(item.englishName)) {
          newRemark += (newRemark ? ", " : "") + (item.englishName || "") + (item.number > 1 ? `(${item.number || ''} قطع)` : '');
        }
      });

      setSelections(newSelections);
      setPrices(newPrices);
      setQuantities(newQuantities);
      values.remark = newRemark;
    }
  }, [values.items]);

  // Add another useEffect to handle quantity changes and update the remark
  useEffect(() => {
    let updatedRemark = "";

    Object.keys(selections).forEach((key) => {
      const itemName = selections[key];
      const itemQuantity = quantities[key] || 1; // Default to 1 if not provided

      if (itemName) {
        updatedRemark += (updatedRemark ? ", " : "") + itemName + (itemQuantity > 1 ? `(${itemQuantity} قطع)` : '');
      }
    });
    const fromStore = clientNotes ? ('- ملحوظة العميل:' + clientNotes) : '';
    values.remark = updatedRemark + fromStore;
  }, [quantities, selections]);


  if (loading) return <Loading />;

  const handleInputBlur = (val, index, options) => {
    if (!options.some((item) => item.product === val)) {
      setSelections((prev) => ({ ...prev, [index]: "" }));
      setFieldValue(`items.${index}.englishName`, "");
    }
  };

  return (
    <div className="mt-8">
      <FieldArray name="items">
        {({ push }) => (
          <div>
            {values.items.map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-b border-gray-300 pb-8"
              >
                <div className="relative w-full">
                  <label className="custom-label-field">
                    اسم المنتج:
                  </label>
                  <Field
                    type="text"
                    name={`items.${index}.englishName`}
                    placeholder="اسم المنتج"
                    className="custom-input-field"
                    autoComplete="new-password"
                    value={selections[index] || ""}
                    onChange={(e) => {
                      setSelections((prev) => ({ ...prev, [index]: e.target.value }));
                      setFieldValue(`items.${index}.englishName`, e.target.value);
                      setShowFirstOptions((prev) => ({ ...prev, [index]: true }));
                    }}
                    onFocus={() => setShowFirstOptions((prev) => ({ ...prev, [index]: true }))}
                    onBlur={(e) => {
                      handleBlur(e);
                      handleInputBlur(selections[index], index, firstOptions);
                      setTimeout(() => setShowFirstOptions((prev) => ({ ...prev, [index]: false })), 200);
                    }}
                  />
                  <ErrorMessage
                    name={`items.${index}.englishName`}
                    component="div"
                    className="text-red-400 mt-1 text-sm"
                  />
                  {showFirstOptions[index] && (
                    <ul className="absolute bg-white z-40 border border-gray-300 rounded-lg w-full mt-1 max-h-60 overflow-auto">
                      {firstOptions && firstOptions
                        .filter((item) => item.product.includes(selections[index] || ""))
                        .map((option) => (
                          <li
                            key={option.variantId}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onMouseDown={() => {
                              setSelections((prev) => ({ ...prev, [index]: option.product }));
                              setPrices((prev) => ({ ...prev, [index]: option.price }));
                              setQuantities((prev) => ({ ...prev, [index]: 1 }));
                              setFieldValue(`items.${index}.englishName`, option.product);
                              setFieldValue(`items.${index}.itemValue`, option.price);
                              setFieldValue(`items.${index}.number`, 1);
                              setShowFirstOptions((prev) => ({ ...prev, [index]: false }));
                            }}
                          >
                            {option.product}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-gray-500 cursor-pointer">سعر المنتج:</label>
                  <Field
                    type="text"
                    name={`items.${index}.itemValue`}
                    placeholder="سعر المنتج"
                    autoComplete="new-password"
                    className="custom-input-field text-gray-800"
                    value={prices[index] || ""}
                    onChange={(e) => {
                      setPrices((prev) => ({ ...prev, [index]: e.target.value }));
                      setFieldValue(`items.${index}.itemValue`, e.target.value);
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-gray-500 cursor-pointer">الكمية:</label>
                  <Field
                    type="text"
                    name={`items.${index}.number`}
                    placeholder="الكمية"
                    autoComplete="new-password"
                    className="custom-input-field text-gray-800"
                    value={quantities[index] || ""}
                    onChange={(e) => {
                      setQuantities((prev) => ({ ...prev, [index]: e.target.value }));
                      setFieldValue(`items.${index}.number`, e.target.value);
                    }}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              name="add-product-btn"
              className="w-full md:w-auto md:min-w-60 mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg duration-500 hover:bg-indigo-600"
              onClick={() => {
                const newIndex = values.items.length;
                setSelections((prev) => ({ ...prev, [newIndex]: "" }));
                setPrices((prev) => ({ ...prev, [newIndex]: "" }));
                setQuantities((prev) => ({ ...prev, [newIndex]: "" }));

                push({
                  englishName: "",
                  number: 1,
                  itemType: "ITN16",
                  itemName: "",
                  priceCurrency: "DHS",
                  itemValue: "",
                  chineseName: "",
                  itemUrl: "",
                  desc: "",
                });
              }}
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
