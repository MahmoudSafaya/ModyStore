import { X } from 'lucide-react'
import { useCart } from '../../../context/CartContext'
import CartItems from './CartItems';
import { Link } from 'react-router-dom';
import { MdOutlineRemoveShoppingCart } from "react-icons/md";

const Cart = () => {
  const { isCartOpen, toggleCart, cart, totalPrice } = useCart();

  return (
    <div className={`${isCartOpen ? 'fixed' : 'hidden'} z-100`}>
      <div className='w-full md:w-1/2 lg:w-1/4 h-screen fixed top-0 left-0 z-50 bg-white shadow-md flex flex-col'>
        <div className='flex items-center justify-between text-gray-700 p-2 md:p-4 lg:p-6 border-b border-gray-300'>
          <h2 className='font-bold text-xl'>قائمة التسوق</h2>
          <div className='flex items-center gap-1 cursor-pointer duration-500 hover:text-gray-800 hover:bg-indigo-100 py-2 px-4 rounded-full' onClick={toggleCart}>
            <span className='text-base'>إغلاق</span>
            <X className='w-5 h-5' />
          </div>
        </div>

        {(cart.length > 0) ? (
          <div className='flex flex-col flex-grow overflow-y-auto'>
            <CartItems />

            <div>
              <div className='flex items-center justify-between font-medium border-t border-indigo-100 py-4 px-4'>
                <h4 className='text-lg'>إجمالى السعر:</h4>
                <p className='text-lg text-indigo-400'>EGP {totalPrice}</p>
              </div>
              <div className='bg-indigo-500 text-white text-center rounded-full mx-4 mb-4 duration-500 hover:bg-indigo-600'>
                <Link to='/checkout' className='block w-full py-2' onClick={toggleCart} aria-label="Signing order button">
                  تسجيل الطلب
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center gap-6 mt-8'>
            <div>
              <MdOutlineRemoveShoppingCart className='w-26 h-26 text-gray-200 drop-shadow-xs' />
            </div>
            <p>لا توجد منتجات في سلة المشتريات.</p>
            <Link to='/' className='max-w-max py-2 px-4 bg-indigo-500 text-white rounded-full duration-500 hover:be-indigo-600' onClick={toggleCart} aria-label="Go to the home page">العودة الى التسوق</Link>
          </div>
        )}
      </div>
      {/* Dark overlay */}
    </div>
  )
}

export default Cart;