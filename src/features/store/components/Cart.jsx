import { useState } from 'react'
import { X } from 'lucide-react'

const Cart = ({ isCartOpen, toggleCart }) => {

  return (
    <div className={`${isCartOpen ? 'fixed' : 'hidden'}`}>
      <div className='w-1/4 h-screen p-6 fixed top-0 left-0 z-50 bg-white shadow-md'>
        <div className='flex items-center justify-between text-gray-700'>
          <h2 className='font-bold text-xl'>قائمة التسوق</h2>
          <div className='flex items-center gap-1 cursor-pointer duration-500 hover:text-gray-800 hover:bg-indigo-100 p-2 rounded-full' onClick={toggleCart}>
            <X />
            <span className='text-base'>اغلاق</span>
          </div>
        </div>
        <hr className='block text-gray-400 my-8' />
        {/* Cart Items */}
      </div>
      {/* Dark overlay */}
    </div>
  )
}

export default Cart;