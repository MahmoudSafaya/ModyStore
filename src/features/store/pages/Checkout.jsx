import React, { useEffect } from 'react'
import { useCart } from '../../../context/CartContext'
import { S_CartItems } from '../components';
import axios from '../../../api/axios';
import VisitorForm from '../components/VisitorForm';
import { useStore } from '../../../context/StoreContext';

const Checkout = () => {
    const { cart, totalPrice } = useCart();
    const { getAddresses } = useStore();

    useEffect(() => {
        getAddresses();
    }, [])
    return (
        <div>
            {/* Checkour page header*/}
            <div className='flex flex-col md:flex-row item-center gap-6'>
                <div className='w-full md:w-1/2 pt-8'>
                    <h2 className='font-bold'>طلباتك</h2>

                    <S_CartItems />

                    {/* Total Price */}
                    <div className='mt-3'>
                        <div className='flex items-center justify-between border-b border-gray-300 py-3'>
                            <h4>الإجمالي الفرعي</h4>
                            <p className='text-indigo-400'>{totalPrice} <span className='text-sm'>EGP</span></p>
                        </div>
                        <div className='flex items-center justify-between border-b border-gray-300 py-3'>
                            <h4>مصاريف الشحن</h4>
                            <p className='text-indigo-400'>50 <span className='text-sm'>EGP</span></p>
                        </div>
                        <div className='flex items-center justify-between py-3'>
                            <h4 className='font-bold'>الإجمالي</h4>
                            <p className='text-indigo-500 font-bold'>{totalPrice + 50} <span className='text-sm'>EGP</span></p>
                        </div>
                    </div>
                </div>
                <div className='custom-bg-white w-full md:w-1/2'>
                    <h2 className='font-bold'>بيانات الطلب</h2>
                    <VisitorForm />
                </div>
            </div>
        </div>
    )
}

export default Checkout