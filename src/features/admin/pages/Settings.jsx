import React from 'react'
import { A_Register, A_AddCategory, A_AddressBlock, A_UpdateShippingPrice, A_SenderAddress } from '../components'

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
    </div>
  )
}

export default Settings