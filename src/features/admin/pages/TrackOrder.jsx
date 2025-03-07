import React, { useEffect, useState } from 'react'
import axios from '../../../api/axios';
import { useLocation, Link } from 'react-router-dom';
import Loading from '../../../shared/components/Loading';
import { TbDatabaseExclamation } from "react-icons/tb";

const TrackOrder = () => {
    const [loading, setLoading] = useState(true);
    const [orderData, setOrderData] = useState([]);

    const location = useLocation();

    // Extract the category ID from the query string
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('orderId');

    useEffect(() => {
        const fetchOrderTrack = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/jnt/orders/track/${orderId}`);
                console.log(res);
                setOrderData(res.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                console.log(orderData)
                setLoading(false);
            }
        }

        if (orderId) {
            fetchOrderTrack();
        }
    }, []);

    if (loading) return <Loading loading={loading} />

    if (!orderData || orderData.length < 1) {
        return (
            <div className="flex flex-col items-center gap-6">
                <div>
                    <TbDatabaseExclamation className="w-20 h-20 opacity-25" />
                </div>
                <p className="text-2xl font-medium"> لا يوجد معلومات متاحة في الوقت الحالي.</p>
                <Link to='/admin/orders' className="max-w-max bg-indigo-500 text-white py-2 px-6 rounded-lg shadow-sm duration-500 hover:bg-indigo-600">صفحة الطلبات</Link>
            </div>
        )
    }

    return (
        <div>
            <h1 className='mb-8'>Track Order: {orderData[0].billCode}</h1>
            <div className=' flex flex-col gap-6'>
                {orderData && orderData[0].details.map((detail, index) => {
                    return (
                        <div key={index} className={`custom-bg-white ${index !== 0 ? 'opacity-50' : ''}`}>
                            <div className='flex flex-col items-center justify-center gap-2'>
                                <div className='min-w-40 text-gray-800'>
                                    <span className='font-semibold'>{detail.scanType}</span> - {detail.scanTime}
                                </div>
                                <div className='flex-grow text-gray-500 mx-4 md:mx-12 text-center'>
                                    {detail.desc}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default TrackOrder