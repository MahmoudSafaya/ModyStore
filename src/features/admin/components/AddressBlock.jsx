import React from 'react';
import axios from '../../../api/axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { blockedAddress } from '../../../schemas/addressesSchema';
import toast, { Toaster } from 'react-hot-toast';

const AddressBlock = () => {

    const handleBlockAddress = async (values, actions) => {
        try {
            const res = await axios.post('/addresses/changestatus', values);
            console.log(res);
            
            if (res.status === 200 || res.statusText === 'OK') {
                toast.success('تم حظر المنطقة بنجاح!');
            }
            actions.resetForm();
        } catch (error) {
            console.error(error);
            if (error.status === 404) {
                toast.error('هذه المنطقة محظورة بالفعل!');
            }
            actions.resetForm();
        }
    };

    return (
        <div className='custom-bg-white mt-8'>
            <h2 className='mb-6 font-bold'>حظر منطقة معينة</h2>
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
                {({ values }) => (
                    <Form>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                            <div>
                                <label className='custom-label-field'>
                                    المحافظة: <span className='text-red-400'>*</span>
                                </label>
                                <Field name='Province' placeholder='اسم المحافظة' className='custom-input-field' />
                                <ErrorMessage name='Province' component='div' className='text-red-400' />
                            </div>

                            <div>
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
                            </div>
                        </div>

                        <button type='submit' className='block mt-8 min-w-50 p-3 text-center bg-gray-600 text-white font-bold hover:bg-gray-700 hover:shadow-lg transition-all duration-500 rounded-xl shadow-md mx-auto'>
                            حظر المنطقة
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