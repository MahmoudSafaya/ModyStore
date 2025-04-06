import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import { A_ProductForm } from "../components";
import { newOrderSchema } from "../../../schemas";
import { axiosAuth } from '../../../api/axios';
import { useOrders } from "../../../context/OrdersContext";
import JNTAddresses from "../../../shared/components/JNTAddresses";
import { Toaster } from "react-hot-toast";
import { useApp } from "../../../context/AppContext";


const TotalOrderValueField = () => {
  const { shippingPrice } = useApp();
  const { values, setFieldValue } = useFormikContext();
  const [totalOrderVal, setTotalOrderVal] = useState("");

  // Memoize the total order calculation
  const total = useMemo(() => {
    return values.items.reduce(
      (sum, item) => sum + Number(item.itemValue * item.number || 0),
      Number(shippingPrice || 0)
    );
  }, [values.items, shippingPrice]);

  // Update the Formik state when total changes
  useEffect(() => {
    setTotalOrderVal(total > 0 ? total : '');
    setFieldValue("itemsValue", total);
  }, [total, setFieldValue]);

  // Memoize the change handler
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setTotalOrderVal(newValue);
    setFieldValue("itemsValue", newValue);
  }, [setFieldValue]);

  return (
    <div>
      <label className="custom-label-field" htmlFor="itemsValue">
        إجمالى سعر الاوردر:
      </label>
      <Field
        type="text"
        id="itemsValue"
        name="itemsValue"
        className="custom-input-field"
        autoComplete="new-password"
        placeholder="إجمالي سعر الاوردر"
        value={totalOrderVal}
        onChange={handleChange} // Optimized with useCallback
      />
      <ErrorMessage name="itemsValue" component="div" className="text-red-400 mt-1 text-sm" />
    </div>
  );
};


const NewOrder = ({ editMode, info, handleOrderPopup }) => {
  const { getUnconfirmedOrders, currentPage } = useOrders();
  const { shippingPrice, setShippingPrice, successNotify, errorNotify, senderAddress, fetchSenderAddress } = useApp();

  const initialValues = info || {
    length: '',
    weight: 1,
    itemsValue: "",
    remark: "",
    billCode: "",
    goodsType: "ITN16",
    totalQuantity: "1",
    width: '',
    height: '',
    offerFee: 1,
    receiver: {
      area: "",
      street: "",
      address: "",
      addressBak: "",
      town: "",
      city: "",
      mobile: "",
      mailBox: "",
      phone: "",
      countryCode: "EGY",
      name: "",
      alternateReceiverPhoneNo: "",
      company: "",
      postCode: "",
      prov: "",
      areaCode: "",
      building: "",
      floor: "",
      flats: ""
    },
    sender: senderAddress,
    items: [
      {
        englishName: "",
        number: 1,
        itemType: "ITN16",
        itemName: "",
        priceCurrency: "DHS",
        itemValue: "",
        chineseName: "",
        itemUrl: "",
        desc: ""
      }
    ]
  }

  const handleOrderSubmit = async (values, actions) => {
    if (editMode) {
      try {
        await axiosAuth.put(`/visitors/orders/${values._id}`, values);
        getUnconfirmedOrders(currentPage);
        // Hide popup
        handleOrderPopup({ display: false, editing: false, info: {} });
        successNotify("تم تعديل الطلب بنجاح.");
        setShippingPrice(0);
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        await axiosAuth.post('/jnt/orders/', values);
        successNotify('تم تسجل الاوردر بنجاح');
        actions.resetForm();
        values.receiver.prov = '';
        setShippingPrice(0);
        fetchSenderAddress();

      } catch (error) {
        console.error(error)
      }
    }

  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={newOrderSchema}
        onSubmit={handleOrderSubmit}
      >
        {({ values, isSubmitting, errors, setFieldValue, handleBlur }) => {
          useEffect(() => {
            if (isSubmitting && Object.keys(errors).length > 0) {
              errorNotify('من فضلك, املآ الخانات المطلوبة اولآ!')
            }
          }, [isSubmitting, errors]);

          return (
            <Form className="mt-8" autoComplete="off">
              <div className="grid grid-cols-1 lg:flex gap-8">
                <div className="custom-bg-white lg:w-1/2">
                  <h2 className="font-bold mb-4 text-center ">بيانات المتجر</h2>
                  <JNTAddresses values={values} parent='sender' setFieldValue={setFieldValue} handleBlur={handleBlur} />
                </div>

                <div className="custom-bg-white lg:w-1/2">
                  <h2 className="font-bold mb-4 text-center">بيانات العميل</h2>
                  <JNTAddresses values={values} isSubmitting={isSubmitting} parent='receiver' setFieldValue={setFieldValue} handleBlur={handleBlur} />
                </div>
              </div>

              <div className="custom-bg-white w-full mt-8">
                <h2 className="font-bold mb-4 text-center">بيانات المنتج</h2>
                <A_ProductForm values={values} info={info} setFieldValue={setFieldValue} handleBlur={handleBlur} />

                {/* Remark field */}
                <h2 className="font-bold mb-4 mt-8 text-center">بيانات الاوردر</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Total price */}
                  <TotalOrderValueField />

                  {/* Order Weight */}
                  <div>
                    <label className="custom-label-field" htmlFor="weight">الوزن:</label>
                    <Field
                      type="text"
                      id="weight"
                      name="weight"
                      className="custom-input-field text-center"
                      placeholder="الوزن"
                    />
                  </div>

                  {/* Shipping Price */}
                  <div>
                    <label className="custom-label-field" htmlFor="shippingPrice">مصاريف الشحن:</label>
                    <input
                      type="text"
                      id="shippingPrice"
                      name="shippingPrice"
                      className="custom-input-field text-center opacity-50 bg-gray-100"
                      placeholder="سعر الشحن"
                      value={shippingPrice}
                      disabled
                    />
                  </div>

                  {/* Order Type */}
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-500 cursor-pointer" htmlFor="goodsType">نوع الاوردر:</label>
                    <Field as="select" id="goodsType" name="goodsType" className='custom-input-field max-h-40 text-gray-800' >
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
                    <ErrorMessage name="goodsType" component="div" className="error" />
                  </div>

                  {/* Name */}
                  <div>
                    <label htmlFor="description" className="custom-label-field">ملاحظات:</label>
                    <Field
                      as="textarea"
                      id="description"
                      name="remark"
                      placeholder="ملاحظات الاوردر"
                      className='custom-input-field min-h-30 resize-none'
                    />
                    <ErrorMessage name="remark" component="div" className="error-message" />
                  </div>

                </div>
              </div>

              <button type="submit" name="new-order-btn" className="block mt-8 w-full md:w-auto md:min-w-60 p-3 text-center bg-indigo-500 text-white font-bold hover:bg-indigo-400 hover:shadow-lg transition-all duration-500 rounded-xl shadow-md mx-auto" disabled={isSubmitting}>
                {editMode ? (isSubmitting ? 'جار التعديل...' : '  تعديل') : (isSubmitting ? 'جار التسجيل...' : 'تسجيل')}
              </button>
            </Form>
          );
        }}
      </Formik>

      {/* Notify popup */}
      <Toaster toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default NewOrder;
