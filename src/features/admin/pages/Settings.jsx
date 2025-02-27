import React from 'react'
import { Link } from 'react-router-dom'
import { A_BarcodeReader, A_Register, A_AddCategory } from '../components'
import { House } from 'lucide-react'
import { A_AddressBlock } from '../components'

const Settings = () => {
  return (
    <div>
      {/* Component Header */}
      <div className='custom-bg-white flex items-center justify-between'>
        <h2 className='text-lg'>الإعدادات</h2>
        <Link to='/admin/products' className='text-2xl bg-white rounded-xl transition-all duration-300 hover:bg-indigo-600 hover:text-white p-2'>
          <House />
        </Link>
      </div>
      <A_Register />
      <A_AddCategory />
      <A_AddressBlock />
      {/* <A_BarcodeReader /> */}
    </div>
  )
}

export default Settings