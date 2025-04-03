import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { visitorOrderSchema } from "../../../schemas/addressesSchema";
import { axiosMain } from "../../../api/axios";
import { useCart } from "../../../context/CartContext";
import toast, { Toaster } from 'react-hot-toast';
import JNTAddresses from "../../../shared/components/JNTAddresses";
import { useApp } from "../../../context/AppContext";
import CryptoJS from 'crypto-js';

const OrderForm = () => {
    const { cart, setCart, totalPrice, setTotalPrice } = useCart();
    const { shippingPrice, fetchSenderAddress, senderAddress, errorNotify } = useApp();

    const navigate = useNavigate();

    const emptyCart = () => {
        localStorage.removeItem('diva_store_cart');
        setCart([]);
        setTotalPrice(0);
    }

    useEffect(() => {
        fetchSenderAddress();
    }, []);

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

        if (cart.length < 1) {
            toast('من فضلك, اختر منتج أولآ قبل تسجيل طلبك.', {
                icon: 'ⓘ'
            });
            setTimeout(() => {
                navigate('/');
            }, 1000);
            resetForm();
            return;
        }

        // Create the orderData object with updated receiver values
        const visitorOrderData = {
            length: "",
            weight: 1.00,
            itemsValue: totalPrice + shippingPrice,
            remark: `${cart.map(item => item.selectedVariant)}  ${values.receiver.additionalInfo && '- ملحوظة العميل:'} ${values.receiver.additionalInfo}`,
            billCode: "",
            goodsType: "ITN16",
            totalQuantity: "1",
            width: "",
            height: "",
            offerFee: 1,
            receiver: {
                area: values.receiver.area,
                street: values.receiver.street,
                address: "",
                addressBak: "",
                town: "",
                city: values.receiver.city,
                mobile: values.receiver.mobile,
                mailBox: "",
                phone: "",
                countryCode: "EGY",
                name: values.receiver.name,
                alternateReceiverPhoneNo: values.receiver.alternateReceiverPhoneNo,
                company: "JT",
                postCode: "",
                prov: values.receiver.prov,
                areaCode: "",
                building: "",
                floor: "",
                flats: ""
            },
            sender: senderAddress || {
                area: "كفر الزيات",
                street: "كفر الزيات",
                address: "",
                addressBak: "",
                town: "",
                city: "كفر الزيات",
                mobile: "01011789966",
                mailBox: "",
                phone: "",
                countryCode: "EGY",
                name: "Diva Store",
                alternateReceiverPhoneNo: "",
                company: "JT",
                postCode: "",
                prov: "الغربية",
                areaCode: "",
                building: "",
                floor: "",
                flats: ""
            },
            items: cart.map(item => {
                return ({
                    englishName: item.selectedVariant,
                    number: item.quantity,
                    itemType: "ITN16",
                    itemName: item.selectedVariant,
                    priceCurrency: "DHS",
                    itemValue: item.actualPrice,
                    chineseName: "",
                    itemUrl: "",
                    desc: item.description
                })
            }),
        };
        try {
            const response = await axiosMain.post('/visitors/orders/', visitorOrderData);
            if (response.status === 201) {
                toast.success('تم تسجيل طلبك بنجاح!');
                emptyCart();
            }
            setSubmitting(false);
            resetForm();
            values.receiver.prov = '';
            addToSignedOrders(response.data);
            navigate('/signed-orders')
        } catch (error) {
            console.error(error);
        }
    };

    // Secret key for hashing (keep this secure)
    const SECRET_KEY = import.meta.env.VITE_FAVS_SECRET_KEY;

    // Function to encrypt data
    const encryptData = (data) => {
        return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    };

    // Function to decrypt data
    const decryptData = (ciphertext) => {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    };

    // Function to save signed orders to local storage
    const saveUserOrders = (orderItems) => {
        const encryptedSigned = encryptData(orderItems);
        localStorage.setItem('signed-orders', encryptedSigned);
    };

    // Add item to signed orders
    const addToSignedOrders = (orderItem) => {
        const encryptedSigned = localStorage.getItem('signed-orders');
        if (!encryptedSigned) {
            saveUserOrders([orderItem]);
            return;
        }
        try {
            const existingOrders = decryptData(encryptedSigned);
            const newSignedOrders = [orderItem, ...existingOrders];
            saveUserOrders(newSignedOrders);
        } catch (error) {
            console.error('Failed to decrypt data:', error);
            return null;
        }
    };

    return (
        <div className="mt-4">
            <Formik
                initialValues={initialValues}
                validationSchema={visitorOrderSchema}
                onSubmit={submitViritorOrder}
            >
                {({ values, setFieldValue, handleBlur, isSubmitting, errors }) => {
                    useEffect(() => {
                        if (isSubmitting && Object.keys(errors).length > 0) {
                            errorNotify('من فضلك, املآ الخانات المطلوبة اولآ!')
                        }
                    }, [isSubmitting, errors]);

                    return (
                        <Form className="space-y-6">
                            <JNTAddresses values={values} isSubmitting={isSubmitting} parent='receiver' setFieldValue={setFieldValue} handleBlur={handleBlur} />

                            {/* Additional Info */}
                            <div>
                                <label className="custom-label-field">ملاحظات عامة</label>
                                <Field
                                    as="textarea"
                                    name="receiver.additionalInfo"
                                    className="custom-input-field resize-none"
                                    autoComplete="new-password"
                                    placeholder="اكتب ملاحظاتك..."
                                    rows="4"
                                />
                                <ErrorMessage name="receiver.additionalInfo" component="div" className="text-red-400 mt-1 text-sm" />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                name="visitor-sign-btn"
                                className="w-full bg-indigo-500 text-white py-2 px-4 rounded-full hover:bg-indigo-600 disabled:bg-gray-400"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "تسجيل الاوردر..." : "تسجيل"}
                            </button>
                        </Form>
                    );
                }}
            </Formik>

            {/* Success notify*/}
            <Toaster toastOptions={{ duration: 5000 }} />
        </div>
    );
};

export default OrderForm;
