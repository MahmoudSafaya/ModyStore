import React from 'react';
import NewOrder from '../pages/NewOrder';
import { X } from 'lucide-react';
import { useOrders } from '../../../context/OrdersContext';

const OrderEdit = () => {
    const { orderPopup, setOrderPopup, handleOrderPopup } = useOrders();

    return (
        <div className="w-full min-h-screen absolute top-0 left-0 z-60 bg-[#00000070] flex items-center justify-center py-16">
            <div className="w-5/6 custom-bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h2 className='flex items-center gap-2'>
                        <span>تعديل أوردر رقم:</span>
                        <span className='cursor-pointer text-indigo-400 duration-500 hover:text-indigo-500'
                            onClick={() =>
                                navigator.clipboard.writeText(orderPopup.info.txlogisticId)
                            }
                        >
                            {orderPopup.info.txlogisticId}
                        </span>
                    </h2>
                    <span
                        className="text-gray-500 cursor-pointer duration-500 hover:text-gray-900 hover:rotate-90"
                        onClick={() =>
                            setOrderPopup({ display: false, editing: false, info: {} })
                        }
                    >
                        <X />
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