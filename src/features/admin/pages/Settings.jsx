import React from 'react'
import { Link } from 'react-router-dom'
import { A_BarcodeReader, A_Register, A_AddCategory } from '../components'
import { House } from 'lucide-react'
import { A_AddressBlock } from '../components'

const Settings = () => {
  return (
    <div>
      <A_Register />
      <A_AddCategory />
      <A_AddressBlock />
      {/* <A_BarcodeReader /> */}
    </div>
  )
}

export default Settings