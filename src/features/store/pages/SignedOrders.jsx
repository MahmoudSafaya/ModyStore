import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import { IoStorefrontOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { FaWhatsapp } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

const SignedOrders = () => {
    const [signedOrders, setSignedOrders] = useState('');

    // Secret key for hashing (keep this secure)
    const SECRET_KEY = import.meta.env.VITE_FAVS_SECRET_KEY;

    // Function to decrypt data
    const decryptData = (ciphertext) => {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    };

    // Function to get favorites from local storage
    const getSignedOrders = () => {
        const encryptedFAVs = localStorage.getItem('signed-orders');
        if (!encryptedFAVs) return null;

        try {
            return decryptData(encryptedFAVs);
        } catch (error) {
            console.error('Failed to decrypt data:', error);
            return null;
        }
    };

    useEffect(() => {
        const savedData = getSignedOrders();

        if (savedData) {
            console.log(savedData)
            setSignedOrders(savedData);
        }
    }, [])

    const handleRemoveSigned = () => {
        localStorage.removeItem('signed-orders');
        toast.success('تم حذف جميع البيانات الخاصة بطلباتك.');
        setTimeout(() => {
            setSignedOrders('');
            getSignedOrders();
        }, 300);
    }

    return (
        <div className='p-12'>
            <h1 className='text-xl font-bold mb-8'>الطلبات المسجلة</h1>
            <div className='custom-bg-white'>
                {signedOrders ? (
                    <>
                        {signedOrders.map((signOrder, index) => {
                            const { name, prov, city, area, street, mobile, alternateReceiverPhoneNo } = signOrder.receiver;
                            return (
                                <div key={index} className='flex flex-col gap-3 mb-8'>
                                    <h4> <span className='font-semibold'>اسم المستلم:</span> {name}</h4>
                                    <h4> <span className='font-semibold'>العنوان:</span> {prov}, {city}, {area}, {street}</h4>
                                    <h4> <span className="font-semibold">الموبيل: </span> {mobile} {alternateReceiverPhoneNo ? ', ' + alternateReceiverPhoneNo : ''}</h4>

                                    <div className='flex flex-col gap-3 mt-2'>
                                        <h4 className='font-bold'>المنتجات</h4>
                                        <div className='grid grid-cols-1 md:grid-cols-2 items-start gap-6'>
                                            {signOrder?.items.map((item, index) => (
                                                <div key={index} className='flex items-center flex-wrap gap-3'>
                                                    <p><span className='font-semibold'>اسم المنتج:</span> {item.englishName}</p>
                                                    <p><span className='font-semibold'>سعر المنتج:</span> {item.itemValue}</p>
                                                    <p><span className='font-semibold'>الكمية:</span> {item.number}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <p className=' bg-gray-200 py-2 px-4 rounded-lg max-w-max mt-2'>
                                            <span className='font-bold'>السعر الإجمالى شامل الشحن:</span>
                                            <span className='text-indigo-400 font-bold'> {signOrder.itemsValue}</span>
                                        </p>
                                    </div>
                                </div>
                            )
                        })}

                        <div className='flex items-center gap-3 mt-6 mb-3'>
                            <p>لمزيد من التفاصيل أو اي استفسار, الرجاء التواصل معنا علي الواتساب</p>
                            <a href='https://wa.me/01011789966' target='_blanck' className="p-2 flex justify-center items-center rounded-full cursor-pointer duration-500 shadow-sm text-white bg-green-400 hover:scale-110 hover:shadow-md" aria-label="Chat with us on Whatsapp" >
                                <FaWhatsapp className='w-full h-full' />
                            </a>
                        </div>
                        <div>
                            <p>
                                <span>عند استلامك للاوردر يمكنك مسح هذه البيانات اذا اردت, </span>
                                <span className='text-indigo-300 cursor-pointer duration-500 hover:text-indigo-400' onClick={() => handleRemoveSigned()}>مسح البيانات</span>
                            </p>
                        </div>
                    </>

                ) : (
                    <div className="flex flex-col items-center gap-6">
                        <div>
                            <IoStorefrontOutline className="w-20 h-20 opacity-25" />
                        </div>
                        <p className="text-2xl font-medium text-center">لا يوجد طلبات في الوقت الحالي</p>
                        <Link to='/' className="max-w-max bg-indigo-500 text-white py-2 px-6 rounded-lg shadow-sm duration-500 hover:bg-indigo-600">تسوق الآن</Link>
                    </div>
                )}



            </div>

            <Toaster toastOptions={{ duration: 3000 }} />
        </div>
    )
}

export default SignedOrders