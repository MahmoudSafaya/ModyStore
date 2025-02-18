import { X } from 'lucide-react'
import { useCart } from '../../../context/CartContext'
import { useStore } from '../../../context/StoreContext';

const Cart = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, totalPrice } = useCart();
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
                  <p className="text-gray-500 mt-2">{item.description}</p>
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

        <div className='flex items-center justify-between font-semibold border-t border-indigo-100 py-4 px-4 bg-indigo-50 duration-500 hover:bg-indigo-100'>
          <h4 className='text-xl'>المجموع:</h4>
          <p className='text-lg text-indigo-400'>EGP {totalPrice}</p>
        </div>
      </div>
      {/* Dark overlay */}
    </div>
  )
}

export default Cart;