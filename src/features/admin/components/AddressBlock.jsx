import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { blockedAddress } from '../../../schemas/addressesSchema';
import toast, { Toaster } from 'react-hot-toast';

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

    useEffect(() => {
        if (!unBlocking) {
            axios.post("/addresses/seprated")
                .then(response => setFirstOptions(response.data.data))
                .catch(error => console.error("Error fetching first options:", error));
        } else {
            axios.post("/addresses/seprated", { "enabled": "0" })
                .then(response => setFirstOptions(response.data.data))
                .catch(error => console.error("Error fetching first options:", error));
        }
    }, [unBlocking]);

    // useEffect(() => {
    //     if (isSubmitting) {
    //         setFirstSelection('');
    //     }
    // }, [isSubmitting])

    useEffect(() => {
        if (firstSelection) {
            if (!unBlocking) {
                axios.post("/addresses/seprated", { Province: firstSelection })
                    .then(response => setSecondOptions(response.data.data))
                    .catch(error => console.error("Error fetching second options:", error));
            } else {
                axios.post("/addresses/seprated", { Province: firstSelection, "enabled": "0" })
                    .then(response => setSecondOptions(response.data.data))
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
                axios.post("/addresses/seprated", { Province: firstSelection, City: secondSelection })
                    .then(response => setThirdOptions(response.data.data))
                    .catch(error => console.error("Error fetching third options:", error));
            } else {
                axios.post("/addresses/seprated", { Province: firstSelection, City: secondSelection, "enabled": "0" })
                    .then(response => setThirdOptions(response.data.data))
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
                const res = await axios.post('/addresses/changestatus', values);
                console.log(res);

                if (res.status === 200 || res.statusText === 'OK') {
                    toast.success('تم حظر المنطقة بنجاح!');
                }
            } catch (error) {
                console.error(error);
                if (error.status === 404) {
                    toast.error('هذه المنطقة محظورة بالفعل!');
                }
            }
        } else {
            try {
                const res = await axios.post('/addresses/changestatus', {...values, enabled: '1'});
                console.log(res);
    
                if (res.status === 200 || res.statusText === 'OK') {
                    toast.success('تم فك الحظر عن المنظقة بنجاح.!');
                }
            } catch (error) {
                console.error(error);
            }
        }
        actions.resetForm();
    };


    return (
        <div className='custom-bg-white mt-8'>
            <div className='w-full flex items-center justify-between'>
                <h2 className='mb-6 font-bold'>حظر منطقة معينة</h2>
                <button type='button' className={`max-w-max py-2 px-4 rounded-lg border border-gray-300 duration-500 ${unBlocking ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-white hover:bg-gray-600 hover:text-white'}`} onClick={() => setUnBlocking(!unBlocking)}>{unBlocking ? 'وضع الإلغاء مفعل' : 'إلغاء حظر منظقة'}</button>
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
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                            {/* <div>
                                <label className='custom-label-field'>
                                    المحافظة: <span className='text-red-400'>*</span>
                                </label>
                                <Field name='Province' placeholder='اسم المحافظة' className='custom-input-field' />
                                <ErrorMessage name='Province' component='div' className='text-red-400' />
                            </div> */}

                            {/* Province */}
                            <div className="relative">
                                <label className="custom-label-field">
                                    المحافظة: <span className="text-red-500">*</span>
                                </label>
                                <Field
                                    type="text"
                                    name="Province"
                                    placeholder="Enter prov"
                                    className="custom-input-field"
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
                                    placeholder="Enter city"
                                    className="custom-input-field"
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
                                <ErrorMessage name="City" component="div" className="text-red-400 mt-1 text-sm" />
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
                                    placeholder="Enter area"
                                    className="custom-input-field"
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
                                <ErrorMessage name="Area" component="div" className="text-red-400 mt-1 text-sm" />
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

                            {/* <div>
                                <label className='custom-label-field'>
                                    المدينة: <span className='text-red-400'>*</span>
                                </label>
                                <Field name='City' placeholder='اسم المدينة' className='custom-input-field' />
                                <ErrorMessage name='City' component='div' className='text-red-400' />
                            </div>

                            <div>
                                <label className='custom-label-field'>
                                    المنطقة: <span className='text-red-400'>*</span>
                                </label>
                                <Field name='Area' placeholder='اسم المنطقة' className='custom-input-field' />
                                <ErrorMessage name='Area' component='div' className='text-red-400' />
                            </div> */}
                        </div>

                        <button type='submit' className={`block mt-8 min-w-60 p-3 text-white text-center font-bold hover:shadow-lg transition-all duration-500 rounded-xl shadow-md mx-auto ${unBlocking ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-gray-600 hover:bg-gray-700'}`}>
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