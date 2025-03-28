import React, { useState, useEffect } from 'react';
import { axiosAuth } from '../../../api/axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { blockedAddress } from '../../../schemas/addressesSchema';
import { Toaster } from 'react-hot-toast';
import { useApp } from '../../../context/AppContext';
import { LockKeyhole } from 'lucide-react';

const AddressBlock = () => {
    const [unBlocking, setUnBlocking] = useState(false);
    const [firstOptions, setFirstOptions] = useState([]);
    const [secondOptions, setSecondOptions] = useState([]);
    const [thirdOptions, setThirdOptions] = useState([]);

    const [firstSelection, setFirstSelection] = useState("");
    const [secondSelection, setSecondSelection] = useState("");
    const [thirdSelection, setThirdSelection] = useState("");

    const [showFirstOptions, setShowFirstOptions] = useState(false);
    const [showSecondOptions, setShowSecondOptions] = useState(false);
    const [showThirdOptions, setShowThirdOptions] = useState(false);

    const { successNotify, deleteNotify, errorNotify } = useApp();

    useEffect(() => {
        if (!unBlocking) {
            axiosAuth.post("/addresses/seprated")
                .then(response => setFirstOptions(response.data.data.result))
                .catch(error => console.error("Error fetching first options:", error));
        } else {
            axiosAuth.post("/addresses/seprated", { "enabled": "0" })
                .then(response => setFirstOptions(response.data.data.result))
                .catch(error => console.error("Error fetching first options:", error));
        }
    }, [unBlocking]);

    useEffect(() => {
        if (firstSelection) {
            if (!unBlocking) {
                axiosAuth.post("/addresses/seprated", { Province: firstSelection })
                    .then(response => setSecondOptions(response.data.data.result))
                    .catch(error => console.error("Error fetching second options:", error));
            } else {
                axiosAuth.post("/addresses/seprated", { Province: firstSelection, "enabled": "0" })
                    .then(response => setSecondOptions(response.data.data.result))
                    .catch(error => console.error("Error fetching second options:", error));
            }
        } else {
            setSecondOptions([]);
            setSecondSelection("");
        }
        setSecondSelection('');
        setThirdSelection('');
    }, [firstSelection]);

    useEffect(() => {
        if (secondSelection) {
            if (!unBlocking) {
                axiosAuth.post("/addresses/seprated", { Province: firstSelection, City: secondSelection })
                    .then(response => setThirdOptions(response.data.data.result))
                    .catch(error => console.error("Error fetching third options:", error));
            } else {
                axiosAuth.post("/addresses/seprated", { Province: firstSelection, City: secondSelection, "enabled": "0" })
                    .then(response => setThirdOptions(response.data.data.result))
                    .catch(error => console.error("Error fetching third options:", error));
            }
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

    const handleBlockAddress = async (values, actions) => {
        if (!unBlocking) {
            try {
                await axiosAuth.post('/addresses/changestatus', values);
                deleteNotify('تم حظر المنطقة بنجاح!');
            } catch (error) {
                console.error(error);
                if (error.status === 404) {
                    errorNotify('هذه المنطقة محظورة بالفعل!');
                }
            }
        } else {
            try {
                await axiosAuth.post('/addresses/changestatus', { ...values, enabled: '1' });
                successNotify('تم فك الحظر عن المنظقة بنجاح.!');
                setUnBlocking(false);
            } catch (error) {
                console.error(error);
            }
        }
        actions.resetForm();
        setFirstSelection('');
    };


    return (
        <div className='custom-bg-white max-h-max mt-8'>
            <div className='w-full flex items-center justify-between'>
                <div className='relative max-w-max flex items-center justify-center gap-2 mb-8'>
                    <LockKeyhole />
                    <h2 className='font-bold'>حظر منطقة معينة</h2>
                    <span className='absolute -bottom-1 right-0 w-[60%] h-[2px] bg-indigo-200 rounded-sm'></span>
                </div>
                <button type='button' name='address-block-btn' className={`max-w-max py-2 px-4 rounded-lg border border-gray-300 duration-500 ${unBlocking ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-white hover:bg-gray-600 hover:text-white'}`} onClick={() => setUnBlocking(!unBlocking)}>{unBlocking ? 'وضع الإلغاء مفعل' : 'إلغاء حظر منظقة'}</button>
            </div>
            <Formik
                initialValues={{
                    Province: '',
                    City: '',
                    Area: '',
                    enabled: '0'
                }}
                validationSchema={blockedAddress}
                onSubmit={handleBlockAddress}
            >
                {({ values, isSubmitting, setFieldValue, handleBlur }) => (
                    <Form>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>

                            {/* Province */}
                            <div className="relative">
                                <label className="custom-label-field">
                                    المحافظة: <span className="text-red-500">*</span>
                                </label>
                                <Field
                                    type="text"
                                    name="Province"
                                    placeholder="اسم المحافطة"
                                    className="custom-input-field"
                                    autoComplete="new-password"
                                    value={firstSelection}
                                    onChange={(e) => {
                                        setFirstSelection(e.target.value);
                                        setFieldValue("Province", e.target.value); // Update form value
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
                                                        setFieldValue("Province", option); // Update form value first
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
                                    name="City"
                                    placeholder="اسم المدينة"
                                    className="custom-input-field"
                                    autoComplete="new-password"
                                    value={secondSelection}
                                    onChange={(e) => {
                                        setSecondSelection(e.target.value)
                                        setFieldValue("City", e.target.value);
                                    }}
                                    onFocus={() => setShowSecondOptions(true)}
                                    onBlur={(e) => {
                                        handleBlur(e);
                                        handleInputBlue(secondSelection, setSecondSelection, secondOptions);
                                        setTimeout(() => setShowSecondOptions(false), 200);
                                    }}
                                    disabled={!firstSelection}
                                />
                                <ErrorMessage name="City" component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
                                {showSecondOptions && (
                                    <ul className="absolute bg-white z-40 border border-gray-300 rounded-lg w-full mt-1 max-h-60 overflow-auto">
                                        {secondOptions.filter(item => item.includes(secondSelection)).map(option => (
                                            <li key={option} className="p-2 hover:bg-gray-200 cursor-pointer" onMouseDown={() => {
                                                setFieldValue("City", option); // Update form value first
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
                                    name="Area"
                                    placeholder="اسم المنطقة"
                                    className="custom-input-field"
                                    autoComplete="new-password"
                                    value={thirdSelection}
                                    onChange={(e) => {
                                        setThirdSelection(e.target.value)
                                        setFieldValue("Area", e.target.value);
                                    }}
                                    onFocus={() => setShowThirdOptions(true)}
                                    onBlur={(e) => {
                                        handleBlur(e);
                                        setTimeout(() => setShowThirdOptions(false), 200)
                                    }}
                                    disabled={!secondSelection}
                                />
                                <ErrorMessage name="Area" component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
                                {showThirdOptions && (
                                    <ul className="absolute bg-white z-40 border border-gray-300 rounded-lg w-full mt-1 max-h-60 overflow-auto">
                                        {thirdOptions.filter(item => item.includes(thirdSelection)).map(option => (
                                            <li key={option} className="p-2 hover:bg-gray-200 cursor-pointer" onMouseDown={() => {
                                                setFieldValue("Area", option); // Update form value first
                                                setThirdSelection(option); // Update local state
                                                setShowThirdOptions(false); // Hide dropdown
                                            }}>
                                                {option}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                        </div>

                        <button type='submit' name='address-block-btn-submit' className={`block mt-8 w-full md:w-auto md:min-w-60 p-3 text-white text-center font-bold hover:shadow-lg transition-all duration-500 rounded-xl shadow-md mx-auto ${unBlocking ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-gray-600 hover:bg-gray-700'}`}>
                            {unBlocking ? 'إلغاء الحظر' : 'حظر المنطقة'}
                        </button>
                    </Form>
                )}
            </Formik>

            {/* Notify popup*/}
            <Toaster />
        </div>
    )
}

export default AddressBlock