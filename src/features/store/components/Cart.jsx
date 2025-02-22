import { X } from 'lucide-react'
import { useCart } from '../../../context/CartContext'
import { useStore } from '../../../context/StoreContext';
import CartItems from './CartItems';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { totalPrice } = useCart();
  const { isCartOpen, toggleCart } = useStore();

  return (
    <div className={`${isCartOpen ? 'fixed' : 'hidden'} z-100`}>
      <div className='w-1/4 h-screen fixed top-0 left-0 z-50 bg-white shadow-md flex flex-col'>
        <div className='flex items-center justify-between text-gray-700 p-2 md:p-4 lg:p-6 border-b border-gray-300'>
          <h2 className='font-bold text-xl'>قائمة التسوق</h2>
          <div className='flex items-center gap-1 cursor-pointer duration-500 hover:text-gray-800 hover:bg-indigo-100 py-2 px-4 rounded-full' onClick={toggleCart}>
            <span className='text-base'>إغلاق</span>
            <X className='w-5 h-5' />
          </div>
        </div>

        {/* Cart Items */}
        <CartItems />

        <div>
          <div className='flex items-center justify-between font-medium border-t border-indigo-100 py-4 px-4'>
            <h4 className='text-lg'>إجمالى السعر:</h4>
            <p className='text-lg text-indigo-400'>EGP {totalPrice}</p>
          </div>
          <div className='bg-indigo-500 text-white text-center rounded-full mx-4 mb-4 duration-500 hover:bg-indigo-600'>
            <Link to='/checkout' className='block w-full py-2'>
              تسجيل الطلب
            </Link>
          </div>
        </div>
      </div>
      {/* Dark overlay */}
    </div>
  )
}

export default Cart;