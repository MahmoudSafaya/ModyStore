import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { A_SenderForm, A_ReceiverFrom, A_ProductForm } from "../components";
import { newOrderSchema } from "../../../schemas";
import axios from '../../../api/axios';
import { useOrders } from "../../../context/OrdersContext";
import JNTAddresses from "../../../shared/components/JNTAddresses";
import toast, { Toaster } from "react-hot-toast";

const NewOrder = ({ editMode, info, handleOrderPopup }) => {
  const { jntOrders, setJNTOrders, unconfirmedOrders, setUnconfirmedOrders } = useOrders();

  const initialValues = info || {
    length: 30,
    weight: 1.00,
    itemsValue: "",
    remark: "",
    billCode: "", ////////////////////
    goodsType: "ITN16",
    totalQuantity: "1",
    width: 10,
    height: 60,
    offerFee: 1,
    receiver: {
      area: "",
      street: "",
      address: "kkk",
      addressBak: "FFF",
      town: "ll",
      city: "",
      mobile: "",
      mailBox: "ant_li123@qq.com",
      phone: "",
      countryCode: "EGY",
      name: "",
      alternateReceiverPhoneNo: "",
      company: "JT",
      postCode: "54830",
      prov: "",
      areaCode: "A0003324",
      building: "13",
      floor: "25",
      flats: "47"
    },
    sender: {
      area: "كفر الزيات",
      street: "كفر الزيات",
      address: "kkk",
      addressBak: "FFF",
      town: "ll",
      city: "كفر الزيات",
      mobile: "01220033445",
      mailBox: "ant_li123@qq.com",
      phone: "",
      countryCode: "EGY",
      name: "modystore",
      alternateReceiverPhoneNo: "",
      company: "JT",
      postCode: "54830",
      prov: "الغربية",
      areaCode: "A0003324",
      building: "13",
      floor: "25",
      flats: "47"
    },
    items: [
      {
        englishName: "",
        number: 1,
        itemType: "ITN16",
        itemName: "file type",
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
        await axios.put(`/visitors/orders/${values._id}`, values);
        // update unconfirmedOrder state
        const newOrders = unconfirmedOrders.map(item => item._id === values._id ? item = values : item)
        setUnconfirmedOrders(newOrders)
        // Hide popup
        handleOrderPopup({ display: false, editing: false, info: {} });
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const response = await axios.post('/jnt/orders/', values);
        console.log(response);
        if (response.data.message === "success") {
          toast.success('تم تسجل الأوردر بنجاح')
        }
        actions.resetForm();
        values.receiver.prov = '';

      } catch (error) {
        console.log(error)
      }
      console.log(values)
    }

  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={newOrderSchema}
        onSubmit={handleOrderSubmit}
      >
        {({ values, isSubmitting, setFieldValue, handleBlur }) => (
          <Form className="mt-8">
            <div className="grid grid-cols-1 lg:flex gap-8">
              <div className="custom-bg-white lg:w-1/2">
                <h2 className="font-bold mb-4 text-center ">بيانات المتجر</h2>
                <JNTAddresses parent='sender' setFieldValue={setFieldValue} handleBlur={handleBlur} />
              </div>

              <div className="custom-bg-white lg:w-1/2">
                <h2 className="font-bold mb-4 text-center">بيانات العميل</h2>
                <JNTAddresses values={values} isSubmitting={isSubmitting} parent='receiver' setFieldValue={setFieldValue} handleBlur={handleBlur} />
              </div>
            </div>

            <div className="custom-bg-white w-full mt-8">
              <h2 className="font-bold mb-4 text-center">بيانات المنتج</h2>
              <A_ProductForm values={values} />

              {/* Remark field */}
              <h2 className="font-bold mb-4 mt-8 text-center">بيانات الأوردر</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Total price */}
                <div>
                  <label className="custom-label-field">إجمالى سعر الأوردر: <span className="text-red-500">*</span></label>
                  <Field
                    type="text"
                    name="itemsValue"
                    className="custom-input-field"
                    placeholder="Enter itemsValue"
                  />
                  <ErrorMessage name="itemsValue" component="div" className="text-red-400 mt-1 text-sm" />
                </div>

                {/* Order Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-500 cursor-pointer">نوع الأوردر:</label>
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
                    placeholder="Enter your description"
                    className='custom-input-field'
                  />
                  <ErrorMessage name="remark" component="div" className="error-message" />
                </div>

              </div>
            </div>

            <button type="submit" className="block mt-8 min-w-50 p-3 text-center bg-indigo-500 text-white font-bold hover:bg-indigo-400 hover:shadow-lg transition-all duration-500 rounded-xl shadow-md mx-auto">
              {editMode ? (isSubmitting ? 'جار التعديل...' : '  تعديل') : (isSubmitting ? 'جار التسجيل...' : 'تسجيل')}
            </button>
          </Form>
        )}
      </Formik>

      {/* Notify popup */}
      <Toaster toastOptions={{
        duration: 5000,
        removeDelay: 1000,
      }} />
    </div>
  );
};

export default NewOrder;
