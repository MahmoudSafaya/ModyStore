import React from 'react'
import { Link } from 'react-router-dom'

const NoData = ({ icon, text, link, btnText }) => {
    return (
        <div className="flex flex-col items-center gap-6">
            <div>
                <IoStorefrontOutline className="w-20 h-20 opacity-25" />
            </div>
            <p className="text-2xl font-medium"> {text} </p>
            <Link to={link} className="max-w-max bg-indigo-500 text-white py-2 px-6 rounded-lg shadow-sm duration-500 hover:bg-indigo-600">{btnText}</Link>
        </div>
    )
}

export default NoData