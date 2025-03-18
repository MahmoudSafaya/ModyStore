import React from 'react'
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { useStore } from '../../../context/StoreContext';
import modyStoreLogo from '../../../assets/diva-store-logo.png'
import { useApp } from '../../../context/AppContext';

const Footer = () => {
    const { mainCategories } = useApp();
    const { storeMainNav } = useStore();
    const date = new Date();
    const thisYear = date.getFullYear();

    return (
        <footer className='w-full lg:w-[calc(100%-50px)] lg:mr-[50px] flex flex-col bg-white'>
            <div className='py-8 px-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-14'>
                <div>
                    <div className='text-center mb-4'>
                        <Link to='/'>
                            <img src={modyStoreLogo} alt="Diva Store" className='w-20 block mx-auto' />
                        </Link>
                    </div>
                    <div className='flex items-center gap-4'>
                        <a href='https://www.facebook.com/share/16KbeZQodb/' target='_blanck' className="w-10 h-10 p-1 flex justify-center items-center rounded-full cursor-pointer duration-500 shadow-sm text-white bg-blue-500 hover:scale-110 hover:shadow-md">
                            <FaFacebookF />
                        </a>
                        <a href='https://www.instagram.com/divastore1997?igsh=MXRoZDZuamVxZzFteg==' target='_blanck' className="w-10 h-10 p-1 flex justify-center items-center rounded-full cursor-pointer duration-500 shadow-sm text-white bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 hover:scale-110 hover:shadow-md">
                            <FaInstagram />
                        </a>
                        <a href='https://www.tiktok.com/@diva.store50?_t=ZS-8uf4EEAnYyg&_r=1' target='_blanck' className="w-10 h-10 p-1 flex justify-center items-center rounded-full cursor-pointer duration-500 shadow-sm text-white bg-gray-900 hover:scale-110 hover:shadow-md">
                            <FaTiktok />
                        </a>
                        <a href='https://wa.me/01011789966' target='_blanck' className="w-10 h-10 p-1 flex justify-center items-center rounded-full cursor-pointer duration-500 shadow-sm text-white bg-green-400 hover:scale-110 hover:shadow-md">
                            <FaWhatsapp />
                        </a>
                    </div>
                </div>


                <div className='text-center'>
                    <h2 className='font-bold mb-4'>خريطة الموقع</h2>
                    <div className='grid grid-cols-2 gap-3 justify-center items-center'>
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
                    <div className="flex flex-wrap gap-3 justify-center items-center">
                        {mainCategories && mainCategories.map(item => {
                            return (
                                <Link to={`/products/category/${item._id}`} key={item._id} className='min-w-1/5 duration-500 hover:text-indigo-500'>
                                    {item.name}
                                </Link>
                            )
                        })}
                    </div>
                </div>

            </div>

            {/* Footer Bottom*/}
            <div className='py-3 px-4 md:px-12 p border-t border-gray-200 text-gray-600 text-center'>
                <p>جميع الحقوق محفوظة DivaStore © {thisYear}</p>
            </div>
        </footer>
    )
}

export default Footer