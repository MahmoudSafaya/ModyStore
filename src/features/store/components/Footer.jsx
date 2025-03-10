import React from 'react'
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useStore } from '../../../context/StoreContext';
import { Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';

const Footer = () => {
    const { storeMainNav } = useStore();
    const { categories } = useApp();
    const date = new Date();
    const thisYear = date.getFullYear();

    return (
        <footer className='w-full lg:w-[calc(100%-50px)] lg:mr-[50px] flex flex-col bg-white'>
            <div className='py-8 px-4 md:px-12 flex flex-col md:flex-row md:flex-wrap items-center justify-between gap-14'>
                <div>
                    <h2 className='text-center md:text-right font-bold mb-4'>ModyStore</h2>
                    <div className='flex items-center gap-4'>
                        <div className="w-10 h-10 p-1 flex justify-center items-center rounded-full cursor-pointer duration-500 shadow-sm text-white bg-blue-500 hover:scale-110">
                            <FaFacebookF />
                        </div>
                        <div className="w-10 h-10 p-1 flex justify-center items-center rounded-full cursor-pointer duration-500 shadow-sm text-white bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 hover:scale-110">
                            <FaInstagram />
                        </div>
                        <div className="w-10 h-10 p-1 flex justify-center items-center rounded-full cursor-pointer duration-500 shadow-sm text-white bg-green-400 hover:scale-110">
                            <FaWhatsapp />
                        </div>
                    </div>
                </div>


                <div className='text-center'>
                    <h2 className='font-bold mb-4'>خريطة الموقع</h2>
                    <div className='flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-3'>
                        {storeMainNav && storeMainNav.map((item, index) => {
                            return (
                                <Link to={item.link} key={index} className='duration-500 hover:text-indigo-500'>
                                    {item.label}
                                </Link>
                            )
                        })}
                    </div>
                </div>

                <div className='text-center'>
                    <h2 className='font-bold mb-4'> الأقسام</h2>
                    <div className='flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-3'>
                        {categories && categories.map(item => {
                            return (
                                <Link to='/' key={item._id} className='duration-500 hover:text-indigo-500'>
                                    {item.name}
                                </Link>
                            )
                        })}
                    </div>
                </div>

            </div>

            {/* Footer Bottom*/}
            <div className='py-3 px-4 md:px-12 p border-t border-gray-200 text-gray-600 text-center'>
                <p>جميع الحقوق محفوظة ModyStore © {thisYear}</p>
            </div>
        </footer>
    )
}

export default Footer