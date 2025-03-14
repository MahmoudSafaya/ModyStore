import React from 'react'
import { useCart } from '../../../context/CartContext'
import { S_CartItems } from '../components';
import VisitorForm from '../components/VisitorForm';
import { Link } from 'react-router-dom';
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { useApp } from '../../../context/AppContext';

const Checkout = () => {
    const { cart, totalPrice } = useCart();
    const { shippingPrice } = useApp();

    return (
        <div>
            {/* Checkour page header*/}
            <div className='flex flex-col md:flex-row item-center gap-6 px-6 md:px-12 py-12'>
                <div className='w-full md:w-1/2 pt-8'>
                    <h2 className='font-bold'>طلباتك</h2>

                    {
                        (cart.length > 0) ? (
                            <div>
                                <S_CartItems />

                                {/* Total Price */}
                                <div className='mt-3'>
                                    <div className='flex items-center justify-between border-b border-gray-300 py-3'>
                                        <h4>الإجمالي الفرعي</h4>
                                        <p className='text-indigo-500'>{totalPrice} <span className='text-sm'>EGP</span></p>
                                    </div>
                                    <div className='flex items-center justify-between border-b border-gray-300 py-3'>
                                        <h4>مصاريف الشحن</h4>
                                        {shippingPrice ? (
                                            <p className='text-indigo-500'>{shippingPrice} <span className='text-sm'>EGP</span></p>
                                        ) : (
                                            <p className='text-indigo-500 opacity-75'>اكتب عنوانك اولآ...</p>
                                        )}
                                    </div>
                                    <div className='flex items-center justify-between py-3'>
                                        <h4 className='font-bold'>الإجمالي</h4>
                                        <p className='text-indigo-500 font-bold'>
                                            {totalPrice + shippingPrice} <span className='text-sm'>EGP</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center gap-6 mt-8'>
                                <div>
                                    <MdOutlineRemoveShoppingCart className='w-26 h-26 text-gray-200 drop-shadow-xs' />
                                </div>
                                <p>لا توجد منتجات في سلة المشتريات.</p>
                                <Link to='/products' className='max-w-max py-2 px-4 bg-indigo-500 text-white rounded-full duration-500 hover:be-indigo-600'>العودة الى التسوق</Link>
                            </div>
                        )
                    }

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