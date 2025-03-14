import { Formik, Form, Field, ErrorMessage } from 'formik'
import React, { useState, useEffect } from 'react'
import axios from '../../../api/axios'
import * as Yup from 'yup';
import { useApp } from '../../../context/AppContext';
import { Toaster } from 'react-hot-toast';
import { CircleDollarSign } from 'lucide-react';

const UpdateShippingPrice = () => {

    const [firstOptions, setFirstOptions] = useState([]);
    const [firstSelection, setFirstSelection] = useState("");
    const [showFirstOptions, setShowFirstOptions] = useState(false);

    const { successNotify } = useApp();

    useEffect(() => {
        axios.post("/addresses/seprated")
            .then(response => setFirstOptions(response.data.data.result))
            .catch(error => console.error("Error fetching first options:", error));
    }, []);


    const handleInputBlue = (val, setVal, options) => {
        if (options.some(item => item === val)) {
            return false
        } else {
            setVal('');
        }
    }

    const handleSubmit = async (values, actions) => {
        try {
            const res = await axios.put('/addresses/change_shipping_price', values);
            console.log(res);
            actions.resetForm();
            setFirstSelection('');
            successNotify(res.data.message)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="custom-bg-white max-h-max mt-8">
            <div className='relative max-w-max flex items-center justify-center gap-2 mb-8 mx-auto'>
                <CircleDollarSign />
                <h2 className='font-bold'>تعديل سعر الشحن</h2>
                <span className='absolute -bottom-1 right-0 w-[60%] h-[2px] bg-indigo-200 rounded-sm'></span>
            </div>
            <Formik
                enableReinitialize
                initialValues={{
                    Province: "",
                    shippingPrice: ""
                }}
                validationSchema={Yup.object().shape({
                    Province: Yup.string().required("المحافظة مطلوبه"),
                    shippingPrice: Yup.string().required("سعر الشحن مطلوب"),
                })}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, setFieldValue, handleBlur }) => (
                    <Form>
                        <div className="w-full flex flex-col md:flex-row gap-6">
                            {/* Province */}
                            <div className="relative w-full">
                                <label className="custom-label-field">
                                    المحافظة: <span className="text-red-500">*</span>
                                </label>
                                <Field
                                    type="text"
                                    name="Province"
                                    placeholder="اسم المحافظة"
                                    className="custom-input-field"
                                    autoComplete="off"
                                    value={firstSelection}
                                    onChange={(e) => {
                                        setFirstSelection(e.target.value);
                                        setFieldValue('Province', e.target.value); // Update form value
                                    }}
                                    onFocus={() => setShowFirstOptions(true)}
                                    onBlur={(e) => {
                                        handleBlur(e);
                                        handleInputBlue(firstSelection, setFirstSelection, firstOptions);
                                        setTimeout(() => setShowFirstOptions(false), 200);
                                    }}
                                />
                                <ErrorMessage
                                    name="Province"
                                    component="div"
                                    className="text-red-400 mt-1 text-sm"
                                />
                                {showFirstOptions && (
                                    <ul className="absolute bg-white z-40 border border-gray-300 rounded-lg w-full mt-1 max-h-60 overflow-auto">
                                        {firstOptions
                                            .filter((item) => item.includes(firstSelection))
                                            .map((option) => (
                                                <li
                                                    key={option}
                                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                                    onMouseDown={() => {
                                                        setFieldValue('Province', option); // Update form value first
                                                        setFirstSelection(option); // Update local state
                                                        setShowFirstOptions(false); // Hide dropdown
                                                    }}
                                                >
                                                    {option}
                                                </li>
                                            ))}
                                    </ul>
                                )}
                            </div>

                            {/* ShippingPrice */}
                            <div className='w-full'>
                                <label className="custom-label-field">السعر الجديد: <span className="text-red-500">*</span></label>
                                <Field
                                    type="text"
                                    name="shippingPrice"
                                    autoComplete="off"
                                    className="custom-input-field"
                                    placeholder="اكتب الاسم"
                                />
                                <ErrorMessage name="shippingPrice" component="div" className="text-red-400 mt-1 text-sm" />
                            </div>
                        </div>

                        <button type='submit' className='w-full md:w-auto md:min-w-60 block mx-auto mt-6 bg-indigo-500 text-white rounded-lg shadow-sm py-2 px-4 duration-500 hover:bg-indigo-600'>
                            {isSubmitting ? 'جار تعديل السعر...' : 'تعديل السعر'}
                        </button>
                    </Form>
                )}
            </Formik>

            <Toaster toastOptions={{ duration: 3000 }} />
        </div>
    )
}

export default UpdateShippingPrice