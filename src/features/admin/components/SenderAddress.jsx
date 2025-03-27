import React, { useState, useEffect, useRef } from 'react'
import { useApp } from '../../../context/AppContext';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Trash, MapPinHouse } from 'lucide-react';
import { FaRegEdit, FaCheckSquare } from "react-icons/fa";
import { Toaster } from 'react-hot-toast';
import { axiosAuth } from '../../../api/axios'
import * as Yup from 'yup';
import { A_DeleteConfirmModal } from '.';
import { useMemo } from 'react';

const SenderAddress = () => {
    const [senderAddresses, setSenderAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isChecked, setIsChecked] = useState(false);

    const [firstOptions, setFirstOptions] = useState([]);
    const [secondOptions, setSecondOptions] = useState([]);
    const [thirdOptions, setThirdOptions] = useState([]);

    const [firstSelection, setFirstSelection] = useState("");
    const [secondSelection, setSecondSelection] = useState("");
    const [thirdSelection, setThirdSelection] = useState("");

    const [showFirstOptions, setShowFirstOptions] = useState(false);
    const [showSecondOptions, setShowSecondOptions] = useState(false);
    const [showThirdOptions, setShowThirdOptions] = useState(false);

    const { setShippingPrice, isDelete, setIsDelete, successNotify, deleteNotify, errorNotify } = useApp();

    const formRef = useRef(null);

    const fetchSenderAddresses = async () => {
        try {
            const res = await axiosAuth.get('/addresses/senders/');
            setSenderAddresses(res.data.senders);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        axiosAuth.post("/addresses/seprated")
            .then(response => setFirstOptions(response.data.data.result))
            .catch(error => console.error("Error fetching first options:", error));

        fetchSenderAddresses();
    }, []);

    useEffect(() => {
        if (firstSelection) {
            axiosAuth.post("/addresses/seprated", { Province: firstSelection })
                .then(response => {
                    setSecondOptions(response.data.data.result);
                    if (parent === 'receiver') {
                        setShippingPrice(Number(response.data.data.price));
                    }
                })
                .catch(error => console.error("Error fetching second options:", error));
        } else {
            setSecondOptions([]);
            setSecondSelection("");
        }
        setSecondSelection('');
        setThirdSelection('');
    }, [firstSelection]);

    useEffect(() => {
        if (secondSelection) {
            axiosAuth.post("/addresses/seprated", { Province: firstSelection, City: secondSelection })
                .then(response => setThirdOptions(response.data.data.result))
                .catch(error => console.error("Error fetching third options:", error));
        } else {
            setThirdOptions([]);
            setThirdSelection("");
        }
        setThirdSelection('');
    }, [secondSelection]);

    const handleInputBlue = (val, setVal, options) => {
        if (options.some(item => item === val)) {
            return false
        } else {
            setVal('');
        }
    }

    const handleCheckedStatus = useMemo(() => {
        setIsChecked(!isChecked)
    }, []);

    const handleSubmit = async (values, { resetForm }) => {

        if (selectedAddress) {
            try {
                await axiosAuth.put(`/addresses/senders/${selectedAddress._id}`, values);
                successNotify('تم تعديل العنوان بنجاح.');
                resetForm();
                setFirstSelection('');
                setSelectedAddress(null);
                fetchSenderAddresses();
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                await axiosAuth.post('/addresses/senders', values);
                successNotify('تم إضافة العنوان بنجاح.');
                resetForm();
                setFirstSelection('');
                fetchSenderAddresses();
            } catch (error) {
                console.error(error);
            }
        }
    }

    const handleEditAddress = (address) => {
        setSelectedAddress(address);
        setFirstSelection(address.prov)
        setTimeout(() => {
            setSecondSelection(address.city)
        }, 300);
        setTimeout(() => {
            setThirdSelection(address.area)
        }, 500);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to form
        }, 100);
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            await axiosAuth.delete(`/addresses/senders/${addressId}`);
            setIsDelete({ purpose: '', itemId: '', itemName: '' });
            deleteNotify('تم حذف العنوان بنجاح.');
            fetchSenderAddresses();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='lg:grid grid-cols-1 gap-6'>
            <div className='custom-bg-white max-h-max mt-8'>
                <div className='relative max-w-max flex items-center justify-center gap-2 mb-8 mx-auto'>
                    <MapPinHouse />
                    <h2 className='font-bold'>قائمة العناويين</h2>
                    <span className='absolute -bottom-1 right-0 w-[60%] h-[2px] bg-indigo-200 rounded-sm'></span>
                </div>

                <div className="overflow-x-auto overflow-y-hidden scrollbar">
                    {senderAddresses && senderAddresses.length > 0 ? (
                        <table className="w-full bg-white">
                            <thead className="text-gray-700 border-b border-gray-300 font-bold text-center whitespace-nowrap">
                                <tr>
                                    <th className="p-3">الاسم</th>
                                    <th className="p-3">رقم الهاتف</th>
                                    <th className="p-3">رقم الهاتف 2</th>
                                    <th className="p-3">المحافظة</th>
                                    <th className="p-3">المدينة</th>
                                    <th className="p-3">المنطقة</th>
                                    <th className="p-3">العنوان</th>
                                    <th className="p-3">الأساسي؟</th>
                                    <th className="p-3">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {senderAddresses.map(item => {
                                    return (
                                        <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50 text-center  whitespace-nowrap text-gray-600">
                                            <td className='p-3'>{item.name}</td>
                                            <td className='p-3'>{item.mobile}</td>
                                            <td className='p-3'>{item.phone ? item.phone : '-'}</td>
                                            <td className='p-3'>{item.prov}</td>
                                            <td className='p-3'>{item.city}</td>
                                            <td className='p-3'>{item.area}</td>
                                            <td className='p-3'>{item.street}</td>
                                            <td className='p-3 text-center'>
                                                {item.default ? (
                                                    <FaCheckSquare className='w-5 h-5 text-green-400 mx-auto' />
                                                ) : ('-')}
                                            </td>
                                            <td className="p-3 flex justify-center items-center">
                                                <div className='px-4 py-2 cursor-pointer duration-500 hover:text-indigo-500 hover:rotate-45' onClick={() => handleEditAddress(item)}>
                                                    <FaRegEdit className="w-5 h-5" />
                                                </div>
                                                <div className='px-4 py-2 cursor-pointer duration-500 hover:text-red-500 hover:rotate-45 rounded-b-lg' onClick={() => setIsDelete({ purpose: 'one-address', itemId: item._id, itemName: item.name })}>
                                                    <Trash className="w-5 h-5" />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className='text-center'>
                            <p>القائمة فارغة, الرجاء إضافة عنوان وتعيينه أساسي.</p>
                        </div>
                    )}
                </div>
            </div>


            {
                isDelete.purpose === 'one-address' && (
                    <A_DeleteConfirmModal itemName={isDelete.itemName} deleteFun={() => handleDeleteAddress(isDelete.itemId)} setIsDelete={setIsDelete} />
                )
            }


            <div className="custom-bg-white max-h-max mt-8" ref={formRef}>
                <div className='relative max-w-max flex items-center justify-center gap-2 mb-8 mx-auto'>
                    <MapPinHouse />
                    <h2 className='font-bold'>إضافة عنوان جديد</h2>
                    <span className='absolute -bottom-1 right-0 w-[60%] h-[2px] bg-indigo-200 rounded-sm'></span>
                </div>
                <Formik
                    enableReinitialize
                    initialValues={selectedAddress || {
                        default: false,
                        area: "",
                        street: "",
                        city: "",
                        mobile: "",
                        mailBox: "",
                        phone: "",
                        countryCode: "",
                        name: "",
                        company: "",
                        postCode: "",
                        prov: "",
                        areaCode: "",
                        building: "",
                        floor: "",
                        flats: ""
                    }}
                    validationSchema={Yup.object().shape({
                        name: Yup.string().required("هذا الحقل مطلوب"),
                        mobile: Yup.string()
                            .matches(/^\d{10,11}$/, "رقم هاتف غير صالح")
                            .required("هذا الحقل مطلوب"),
                        phone: Yup.string()
                            .matches(/^\d{10,11}$/, "رقم هاتف غير صالح"),
                        prov: Yup.string().required("هذا الحقل مطلوب"),
                        city: Yup.string().required("هذا الحقل مطلوب"),
                        area: Yup.string().required("هذا الحقل مطلوب"),
                        street: Yup.string().required("هذا الحقل مطلوب"),
                    })}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue, handleBlur, errors }) => {
                        useEffect(() => {
                            if (isSubmitting && Object.keys(errors).length > 0) {
                                errorNotify('من فضلك, املآ الخانات المطلوبة اولآ!')
                            }
                        }, [isSubmitting, errors]);

                        return (
                            <Form autoComplete="off">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                                    {/* Name */}
                                    <div className='relative'>
                                        <label className="custom-label-field">الاسم: <span className="text-red-500">*</span></label>
                                        <Field
                                            type="text"
                                            name="name"
                                            autoComplete="off"
                                            className="custom-input-field"
                                            placeholder="اكتب الاسم"
                                        />
                                        <ErrorMessage name="name" component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
                                    </div>

                                    {/* Mobile */}
                                    <div className='relative'>
                                        <label className="custom-label-field">رقم الهاتف: <span className="text-red-500">*</span></label>
                                        <Field
                                            type="text"
                                            name="mobile"
                                            autoComplete="new-password"
                                            className="custom-input-field"
                                            placeholder="ادخل رقم موبيل"
                                        />
                                        <ErrorMessage name="mobile" component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
                                    </div>

                                    {/* Mobile 2 */}
                                    <div className='relative'>
                                        <label className="custom-label-field">رقم الهاتف 2:</label>
                                        <Field
                                            type="text"
                                            name="phone"
                                            autoComplete="new-password"
                                            className="custom-input-field"
                                            placeholder="ادخل رقم موبيل"
                                        />
                                        <ErrorMessage name="phone" component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
                                    </div>

                                    {/* Province */}
                                    <div className="relative">
                                        <label className="custom-label-field">
                                            المحافظة: <span className="text-red-500">*</span>
                                        </label>
                                        <Field
                                            type="text"
                                            name="prov"
                                            placeholder="اسم المحافظة"
                                            className="custom-input-field"
                                            autoComplete="new-password"
                                            value={firstSelection}
                                            onChange={(e) => {
                                                setFirstSelection(e.target.value);
                                                setFieldValue("prov", e.target.value); // Update form value
                                            }}
                                            onFocus={() => setShowFirstOptions(true)}
                                            onBlur={(e) => {
                                                handleBlur(e);
                                                handleInputBlue(firstSelection, setFirstSelection, firstOptions);
                                                setTimeout(() => setShowFirstOptions(false), 200);
                                            }}
                                        />
                                        <ErrorMessage
                                            name="prov"
                                            component="div"
                                            className="text-red-400 text-xs absolute -bottom-5 right-1"
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
                                                                setFieldValue("prov", option); // Update form value first
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

                                    {/* City */}
                                    <div className="relative">
                                        <label className="custom-label-field">المدينة: <span className="text-red-500">*</span></label>
                                        <Field
                                            type="text"
                                            name="city"
                                            placeholder="اسم المدينة"
                                            autoComplete="new-password"
                                            className="custom-input-field"
                                            value={secondSelection}
                                            onChange={(e) => {
                                                setSecondSelection(e.target.value)
                                                setFieldValue("city", e.target.value);
                                            }}
                                            onFocus={() => setShowSecondOptions(true)}
                                            onBlur={(e) => {
                                                handleBlur(e);
                                                handleInputBlue(secondSelection, setSecondSelection, secondOptions);
                                                setTimeout(() => setShowSecondOptions(false), 200);
                                            }}
                                            disabled={!firstSelection}
                                        />
                                        <ErrorMessage name="city" component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
                                        {showSecondOptions && (
                                            <ul className="absolute bg-white z-40 border border-gray-300 rounded-lg w-full mt-1 max-h-60 overflow-auto">
                                                {secondOptions.filter(item => item.includes(secondSelection)).map(option => (
                                                    <li key={option} className="p-2 hover:bg-gray-200 cursor-pointer" onMouseDown={() => {
                                                        setFieldValue("city", option); // Update form value first
                                                        setSecondSelection(option); // Update local state
                                                        setShowSecondOptions(false); // Hide dropdown
                                                    }}>
                                                        {option}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Area */}
                                    <div className="relative">
                                        <label className="custom-label-field">المنطقة: <span className="text-red-500">*</span></label>
                                        <Field
                                            type="text"
                                            name="area"
                                            placeholder="اسم المنظقة"
                                            autoComplete="new-password"
                                            className="custom-input-field"
                                            value={thirdSelection}
                                            onChange={(e) => {
                                                setThirdSelection(e.target.value)
                                                setFieldValue("area", e.target.value);
                                            }}
                                            onFocus={() => setShowThirdOptions(true)}
                                            onBlur={(e) => {
                                                handleBlur(e);
                                                setTimeout(() => setShowThirdOptions(false), 200)
                                            }}
                                            disabled={!secondSelection}
                                        />
                                        <ErrorMessage name="area" component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
                                        {showThirdOptions && (
                                            <ul className="absolute bg-white z-40 border border-gray-300 rounded-lg w-full mt-1 max-h-60 overflow-auto">
                                                {thirdOptions.filter(item => item.includes(thirdSelection)).map(option => (
                                                    <li key={option} className="p-2 hover:bg-gray-200 cursor-pointer" onMouseDown={() => {
                                                        setFieldValue("area", option); // Update form value first
                                                        setThirdSelection(option); // Update local state
                                                        setShowThirdOptions(false); // Hide dropdown
                                                    }}>
                                                        {option}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Street */}
                                    <div className='relative'>
                                        <label className="custom-label-field">العنوان: <span className="text-red-500">*</span></label>
                                        <Field
                                            type="text"
                                            name="street"
                                            autoComplete="new-password"
                                            className="custom-input-field"
                                            placeholder="العنوان بالكامل"
                                        />
                                        <ErrorMessage name="street" component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <label className="text-gray-700">تعيين العنوان الأساسي:</label>
                                        <Field name="default" type="checkbox">
                                            {({ field }) => (
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        {...field}
                                                        checked={field.value}
                                                    />
                                                    <div className="w-10 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-green-400 rounded-full peer-checked:bg-green-500 relative transition-colors">
                                                        <div
                                                            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${field.value ? "translate-x-4" : "translate-x-0"
                                                                }`}
                                                        />
                                                    </div>
                                                </label>
                                            )}
                                        </Field>
                                    </div>
                                </div>

                                <button type='submit' name='sender-address-btn' className={`w-full md:w-auto md:min-w-60 block mx-auto mt-8 text-white rounded-lg shadow-sm py-2 px-4 duration-500 ${selectedAddress ? 'bg-gray-600 hover:bg-gray-700' : 'bg-indigo-500 hover:bg-indigo-600'}`}>
                                    {selectedAddress ? (isSubmitting ? 'جار التحديث...' : 'تحديث البيانات') : (isSubmitting ? 'جار الإضافة...' : 'إضافة العنوان')}
                                </button>
                            </Form>
                        );
                    }}
                </Formik>

                <Toaster toastOptions={{ duration: 3000 }} />
            </div>
        </div >
    )
}

export default SenderAddress