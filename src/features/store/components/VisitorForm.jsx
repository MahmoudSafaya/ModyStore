import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { visitorOrderSchema } from "../../../schemas/addressesSchema";
import axios from "../../../api/axios";
import { useCart } from "../../../context/CartContext";
import toast, { Toaster } from 'react-hot-toast';
import JNTAddresses from "../../../shared/components/JNTAddresses";

const OrderForm = () => {
    const { cart, totalPrice } = useCart();

    const notify = () => toast.success('تم تسجيل طلبك بنجاح!');

    // Initial Order Data (including receiver object)
    const initialValues = {
        receiver: {
            name: "",
            mobile: "",
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
            itemsValue: totalPrice,
            remark: values.receiver.additionalInfo,
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
                alternateReceiverPhoneNo: "12-31321322",
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
                    itemValue: item.price,
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
                notify();
            }
            setSubmitting(false);
            resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mt-4">
            <Formik
                initialValues={initialValues}
                validationSchema={visitorOrderSchema}
                validateOnChange={true} // Ensure validation runs on change
                onSubmit={submitViritorOrder}
            >
                {({ values, setFieldValue, handleBlur, handleChange, isSubmitting }) => (
                    <Form className="space-y-4">
                        <JNTAddresses values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} />

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
                            {isSubmitting ? "Submitting..." : "Submit Order"}
                        </button>
                    </Form>
                )}
            </Formik>

            {/* Success notify*/}
            <Toaster />
        </div>
    );
};

export default OrderForm;
