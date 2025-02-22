import React from 'react'
import { useCart } from '../../../context/CartContext'
import { X } from 'lucide-react'

const CartItems = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  return (
    <div className='overflow-y-auto flex-grow'>
        {cart && cart.map((item, index) => {
            return (
              <div key={index} className='relative flex items-center gap-4 p-2 md:p-4 lg:p-6 border-b border-gray-300'>
                <div className='absolute top-6 left-4 z-100 text-gray-500 text-[14px] cursor-pointer duration-500 hover:text-gray-800' onClick={() => removeFromCart(item.id)}>
                  <X className='w-5 h-5' />
                </div>
                <div className='w-[25%] rounded-lg overflow-hidden'>
                  <img src={item.image} alt={item.name} />
                </div>
                <div>
                  <h1 className="font-medium">{item.name}</h1>
                  <p className="text-gray-500 mt-2">{item.description.slice(0, 30)}</p>
                  <div className="grid grid-cols-3 items-center text-gray-700 border border-gray-300 w-20 mt-2 rounded-lg">
                    <button
                      className="rounded-r-md border-l border-gray-300"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>
                    <span className="text-center">{item.quantity}</span>
                    <button
                      className="rounded-l-md border-r border-gray-300"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      −
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-sm text-indigo-500">EGP {item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
  )
}

export default CartItems