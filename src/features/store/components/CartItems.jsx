import React from 'react'
import { useCart } from '../../../context/CartContext'
import { X } from 'lucide-react'

const CartItems = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const baseUrl = import.meta.env.VITE_SERVER_URL;
  return (
    <div className='overflow-y-auto flex-grow'>
        {cart && cart.map((item, index) => {
            return (
              <div key={index} className='relative flex items-center gap-4 p-2 md:p-4 lg:p-6 border-b border-gray-300'>
                <div className='absolute top-6 left-4 z-100 text-gray-500 text-[14px] cursor-pointer duration-500 hover:text-gray-800 hover:rotate-90' onClick={() => removeFromCart(item._id)}>
                  <X className='w-5 h-5' />
                </div>
                <div className='w-[30%] rounded-lg overflow-hidden'>
                  <img src={`${baseUrl}/${item.mainImage.url}`} alt={item.mainImage.alt} />
                </div>
                <div>
                  <h1 className="font-medium">{item.name}</h1>
                  <p className="text-xs text-gray-500 mt-2">{item.selectedVariant}</p>
                  <div className="grid grid-cols-3 items-center text-gray-700 border border-gray-300 w-20 mt-2 rounded-lg">
                    <button
                      className="rounded-r-md border-l border-gray-300"
                      onClick={() => increaseQuantity(item._id)}
                    >
                      +
                    </button>
                    <span className="text-center">{item.quantity}</span>
                    <button
                      className="rounded-l-md border-r border-gray-300"
                      onClick={() => decreaseQuantity(item._id)}
                    >
                      −
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-sm text-indigo-500">EGP {item.discount > 0 
                    ? (item.actualPrice * item.quantity) 
                    : (item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
  )
}

export default CartItems