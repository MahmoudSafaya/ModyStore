import React, { useEffect, useState, useRef } from 'react'
import CryptoJS from 'crypto-js';
import { IoStorefrontOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { FaWhatsapp } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import { MdContentCopy } from "react-icons/md";
import { axiosAuth } from '../../../api/axios';
import { FaMapLocationDot } from "react-icons/fa6";
import { useApp } from '../../../context/AppContext';
import { format } from 'date-fns';

const SignedOrders = () => {
    const [signedOrders, setSignedOrders] = useState('');
    const [loading, setLoading] = useState(false);
    const [orderMsg, setOrderMsg] = useState(false);
    const [orderData, setOrderData] = useState([]);
    const [trackInput, setTrackInput] = useState('');

    const { errorNotify } = useApp();
    const trackingBox = useRef(null);

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

    const fetchOrderTrack = async (orderId) => {
        setLoading(true);
        try {
            const res = await axiosAuth.get(`/jnt/orders/track/${orderId}`);
            setOrderData(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleTrackOrder = async (orderId) => {
        try {
            const res = await axiosAuth.get(`orders/${orderId}`);
            if (res.data.confirmed === '1') {
                fetchOrderTrack(orderId);
                setOrderMsg(false);
                setTimeout(() => {
                    trackingBox.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
            if (res.data.confirmed === '0') {
                setOrderMsg(true);
                setTimeout(() => {
                    trackingBox.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        } catch (error) {
            console.error(error);
            errorNotify('حدث خطأ, من فضلك تأكد من رقم الاوردر وحاول مرة أخري.');
            setOrderMsg(false);
        }
    }

    const handleTrackSubmit = (e) => {
        e.preventDefault();
        handleTrackOrder(trackInput);
    }

    return (
        <div className='p-12'>
            <div className='custom-bg-white'>
                <form onSubmit={handleTrackSubmit} className='flex flex-col md:flex-row items-center gap-4'>
                    <input
                        type="text"
                        name='track-order'
                        placeholder='اكتب رقم الاوردر'
                        className='custom-input-field flex-grow w-full'
                        autoComplete='off'
                        value={trackInput}
                        onChange={(e) => setTrackInput(e.target.value)} />
                    <button type='submit' className="min-w-30 w-full md:w-auto lg:min-w-40 bg-indigo-500 duration-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-sm">تتبع الاوردر</button>
                </form>
            </div>

            <h1 className='text-xl font-bold mt-12'>الطلبات المسجلة</h1>
            <div className='mt-12'>
                {signedOrders ? (
                    <>
                        <div className='flex flex-wrap justify-center gap-8'>
                            {signedOrders.map((signOrder, index) => {
                                const { name, prov, city, area, street, mobile, alternateReceiverPhoneNo } = signOrder.receiver;
                                return (
                                    <div key={index} className='flex flex-col'>
                                        <div className="max-w-md p-6 bg-white rounded-2xl shadow-md space-y-4">
                                            <div className="flex flex-col md:flex-row gap-2 justify-between items-center" onClick={() => {
                                                navigator.clipboard.writeText(signOrder._id);
                                                toast.success('تم النسخ!');
                                            }}>
                                                <h2 className="text-xl font-semibold">أوردَر رقم:</h2>
                                                <div className="group flex items-center gap-2 text-gray-700 cursor-pointer">
                                                    <span className="font-medium duration-500 group-hover:text-indigo-500">{signOrder._id}</span>
                                                    <MdContentCopy className="w-6 h-6 duration-500 group-hover:text-indigo-500" />
                                                </div>
                                            </div>

                                            <div className='text-gray-700 text-sm'>
                                                <p className='m-0'>تاريخ الطلب: {format(new Date(signOrder.createdAt), "PPpp")}</p>
                                            </div>

                                            <div className="space-y-2 text-right">
                                                <p><span className="font-semibold">اسم المستلم:</span> {name}</p>
                                                <p><span className="font-semibold">العنوان:</span> {prov}, {city}, {area}, {street}</p>
                                                <p><span className="font-semibold">الموبايل:</span> {mobile} {alternateReceiverPhoneNo ? ', ' + alternateReceiverPhoneNo : ''}</p>
                                            </div>

                                            <div className="border-t border-gray-200 pt-4 space-y-2 text-right">
                                                <h3 className="text-lg font-semibold">المنتجات</h3>
                                                <div className='flex flex-wrap items-start gap-6'>
                                                    {signOrder?.items.map((item, index) => (
                                                        <div key={index} className='flex items-center flex-wrap gap-3'>
                                                            <p><span className='font-semibold'>اسم المنتج:</span> {item.englishName}</p>
                                                            <p><span className='font-semibold'>سعر المنتج:</span> {item.itemValue}</p>
                                                            <p><span className='font-semibold'>الكمية:</span> {item.number}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-4 bg-gray-100 p-3 text-center rounded-lg">
                                                <p className="text-lg font-semibold">السعر الإجمالى شامل الشحن:</p>
                                                <span className='text-indigo-400 font-bold'> {signOrder.itemsValue}</span>
                                            </div>

                                            <div className="group max-w-max mx-auto flex items-center gap-2 text-gray-700 cursor-pointer" onClick={() => handleTrackOrder(signOrder._id)}>
                                                <span className="font-medium duration-500 group-hover:text-indigo-500">تتبع الأوردر</span>
                                                <FaMapLocationDot className="w-6 h-6 duration-500 group-hover:text-indigo-500" />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex items-center justify-center gap-3 mt-6 mb-3 mt-12">
                            <p>لمزيد من التفاصيل أو أي استفسار, الرجاء التواصل معنا على الواتساب</p>
                            <a href="https://wa.me/01011789966" target="_blank" className="p-2 flex justify-center items-center rounded-full cursor-pointer duration-300 shadow-md text-white bg-green-500 hover:bg-green-600 hover:scale-105" aria-label="Chat with us on Whatsapp">
                                <FaWhatsapp className="w-6 h-6" />
                            </a>
                        </div>

                        <div className="text-center">
                            <p>
                                <span>عند استلامك للأوردر يمكنك مسح هذه البيانات إذا أردت, </span>
                                <span className="text-red-500 cursor-pointer duration-300 underline hover:text-red-600" onClick={handleRemoveSigned}>مسح البيانات</span>
                            </p>
                        </div>

                        <div ref={trackingBox} className='mt-12'>
                            {loading ? (
                                <div className="w-full min-h-50 flex items-center justify-center">
                                    <div className="spinner"></div>
                                </div>
                            ) : (
                                <div className=' flex flex-col gap-6'>
                                    {!orderMsg ? (
                                        orderData.length > 0 && orderData[0].details.map((detail, index) => {
                                            return (
                                                <div key={index} className={`custom-bg-white ${index !== 0 ? 'opacity-50' : ''}`}>
                                                    {detail.status ? (
                                                        <div className='flex items-center justify-center'>
                                                            {detail.status}
                                                        </div>
                                                    ) : (
                                                        <div className='flex flex-col items-center justify-center gap-2'>
                                                            <div className='min-w-40 text-gray-800 text-center flex md:block flex-col gap-2'>
                                                                <span className='font-semibold'>{detail.scanType} -</span>
                                                                <span> {detail.scanTime}</span>
                                                            </div>
                                                            <div className='flex-grow text-gray-500 mx-4 md:mx-12 text-center'>
                                                                {detail.desc}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className='custom-bg-white text-center'>
                                            <p>طلبك قيد التجهيز تتبع مره اخري بعد قليل سيتم تحديث بيانات الشحن.</p>
                                        </div>
                                    )}
                                </div>
                            )}
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