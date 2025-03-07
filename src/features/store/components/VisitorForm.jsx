import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { visitorOrderSchema } from "../../../schemas/addressesSchema";
import axios from "../../../api/axios";
import { useCart } from "../../../context/CartContext";
import toast, { Toaster } from 'react-hot-toast';
import JNTAddresses from "../../../shared/components/JNTAddresses";
import { useApp } from "../../../context/AppContext";

const OrderForm = () => {
    const { cart, setCart, totalPrice, setTotalPrice } = useCart();
    const { shippingPrice } = useApp();

    const emptyCart = () => {
        localStorage.removeItem('mody_store_cart');
        setCart([]);
        setTotalPrice(0);
    }

    // Initial Order Data (including receiver object)
    const initialValues = {
        receiver: {
            name: "",
            mobile: "",
            alternateReceiverPhoneNo: "",
            prov: "",
            city: "",
            area: "",
            street: "",
            additionalInfo: "",
        },
    };

    // Handle Form Submission
    const submitViritorOrder = async (values, { setSubmitting, resetForm }) => {

        // Create the orderData object with updated receiver values
        const visitorOrderData = {
            length: 30,
            weight: 5.02,
            itemsValue: totalPrice + shippingPrice,
            remark: `${cart.map(item => item.selectedVariant)} -/- ${values.receiver.additionalInfo}`,
            billCode: "", ////////////////////
            goodsType: "ITN1",
            totalQuantity: "1",
            width: 10,
            height: 60,
            offerFee: 1,
            receiver: {
                area: values.receiver.area,
                street: values.receiver.street,
                address: "kkk",
                addressBak: "FFF",
                town: "ll",
                city: values.receiver.city,
                mobile: values.receiver.mobile,
                mailBox: "ant_li123@qq.com",
                phone: "034351203",
                countryCode: "EGY",
                name: values.receiver.name,
                alternateReceiverPhoneNo: values.receiver.alternateReceiverPhoneNo,
                company: "JT",
                postCode: "54830",
                prov: values.receiver.prov,
                areaCode: "A0003324",
                building: "13",
                floor: "25",
                flats: "47"
            },
            items: cart.map(item => {
                return ({
                    englishName: item.name,
                    number: 1,
                    itemType: "ITN16",
                    itemName: "file type",
                    priceCurrency: "DHS",
                    itemValue: item.actualPrice + shippingPrice,
                    chineseName: "test_order",
                    itemUrl: "http://www.baidu.com",
                    desc: item.description
                })
            }),
        };

        console.log("Final Order Data:", visitorOrderData);

        try {
            const response = await axios.post('/visitors/orders/', visitorOrderData);
            console.log(response);
            if (response.status === 201) {
                toast.success('تم تسجيل طلبك بنجاح!');
                emptyCart();
            }
            setSubmitting(false);
            resetForm();
            values.receiver.prov = '';
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mt-4">
            <Formik
                initialValues={initialValues}
                validationSchema={visitorOrderSchema}
                onSubmit={submitViritorOrder}
            >
                {({ values, setFieldValue, handleBlur, isSubmitting }) => (
                    <Form className="space-y-4">
                        <JNTAddresses values={values} isSubmitting={isSubmitting} parent='receiver' setFieldValue={setFieldValue} handleBlur={handleBlur} />

                        {/* Additional Info */}
                        <div>
                            <label className="custom-label-field">ملاحظات عامة</label>
                            <Field
                                as="textarea"
                                name="receiver.additionalInfo"
                                className="custom-input-field resize-none"
                                placeholder="Enter additional details"
                                rows="4"
                            />
                            <ErrorMessage name="receiver.additionalInfo" component="div" className="text-red-400 mt-1 text-sm" />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 disabled:bg-gray-400"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "تسجيل الاوردر..." : "تسجيل"}
                        </button>
                    </Form>
                )}
            </Formik>

            {/* Success notify*/}
            <Toaster toastOptions={{ duration: 5000, removeDelay: 1000 }} />
        </div>
    );
};

export default OrderForm;
