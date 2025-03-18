import React from 'react'
import { A_Register, A_AddCategory, A_AddressBlock, A_UpdateShippingPrice, A_SenderAddress } from '../components'
import { Toaster } from 'react-hot-toast'

const Settings = () => {
  return (
    <div>
      <A_Register />
      <A_AddCategory />
      <div className='lg:grid grid-cols-2 gap-6'>
        <A_AddressBlock />
        <A_UpdateShippingPrice />
      </div>
      <A_SenderAddress />

      <Toaster toastOptions={{ duration: 3000 }} />
    </div>
  )
}

export default Settings