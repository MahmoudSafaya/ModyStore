import React from 'react';
import NewOrder from '../pages/NewOrder';
import { X } from 'lucide-react';
import { useOrders } from '../../../context/OrdersContext';
import toast from 'react-hot-toast';
import { useApp } from '../../../context/AppContext';

const OrderEdit = () => {
    const { orderPopup, setOrderPopup, handleOrderPopup } = useOrders();
    const { setShippingPrice } = useApp();

    return (
        <div className="w-full h-full fixed top-0 left-0 z-100 bg-[#00000070] py-16 overflow-y-auto">
            <div className="w-5/6 relative mx-auto custom-bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h2 className='flex items-center gap-2'>
                        <span>تعديل أوردر رقم:</span>
                        <span className='cursor-pointer text-gray-700 duration-500 hover:text-indigo-500'
                            onClick={() => {
                                navigator.clipboard.writeText(orderPopup.info.txlogisticId);
                                toast.success('تم النسخ!');
                            }}
                        >
                            {orderPopup.info.txlogisticId}
                        </span>
                    </h2>
                    <span
                        className="absolute -top-3 right-1/2 translate-x-1/2 bg-white rounded-full p-1 text-gray-700 shadow-md cursor-pointer duration-500 hover:text-gray-900 hover:rotate-90"
                        onClick={() => {
                            setOrderPopup({ display: false, editing: false, info: {} });
                            setShippingPrice(0);
                        }
                        }
                    >
                        <X className='w-6 h-6' />
                    </span>
                </div>
                <NewOrder
                    editMode={orderPopup.editing}
                    info={orderPopup.info}
                    handleOrderPopup={handleOrderPopup}
                />
            </div>
        </div>
    )
}

export default OrderEdit