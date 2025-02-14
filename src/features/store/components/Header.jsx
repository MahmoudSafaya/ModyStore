import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, Heart, ShoppingCart } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const storeNav = [
  { label: "الرئيسية", link: '/' },
  { label: "متجرنا", link: '/products' },
  { label: "من نحن", link: '/about-us' },
  { label: "الشحن والاسترجاع", link: '/shippment' },
];


const EcommerceHeader = ({ toggleCart }) => {
  const location = useLocation();

  return (
    <header className="w-full lg:w-[calc(100%-50px)] lg:mr-[50px] flex flex-col">
      <div className="w-full py-4 px-6 flex justify-between items-center lg:gap-10">
        <div className="logo">
          <Link to="/" className="logo-link">
            <span>Mody_Store</span> {/* My Store */}
          </Link>
        </div>

        <div className="flex-grow">
          <div className="relative">
            <input type="text" name="discount-price" id="discount-price" className="w-full p-2 border border-gray-300 rounded-full focus:border-indigo-300 outline-none" placeholder="ابحث عن منتج..." />
            <Search className="w-8 h-8 p-2 rounded-full bg-indigo-500 text-white absolute top-[50%] -translate-y-[50%] left-1 border border-indigo-200" />
          </div>
        </div>

        <div className="user-controls">
          <button className="max-w-content py-2 px-4 bg-green-400 text-gray-100 rounded-full duration-500 hover:bg-green-500 hover:text-white">
            <a href="#" className="flex items-center justify-center gap-2">
              <span> ابعتلنا واتساب</span>
              <FaWhatsapp className="w-6 h-6" />
            </a>
          </button>
        </div>
      </div>

      <div className="w-full py-4 px-6 flex justify-between items-center bg-indigo-100 text-gray-800">

        <div className="flex items-center gap-2">
          <Menu className="w-10 h-10 bg-white rounded-full p-2 duration-500 text-gray-700 cursor-pointer opacity-85 group-hover:opacity-100" />
          <span>القائمة</span>
        </div>
        <nav className="flex justify-center items-center gap-8">
          {storeNav.map((item, index) => (
            <Link key={index} to={item.link} className={`py-1 px-4 rounded-full duration-500 cursor-pointer hover:text-indigo-600 hover:bg-indigo-200 ${location.pathname === item.link ? 'text-indigo-600 bg-indigo-200' : ''}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div>
            <Link to='/favorites'>
              <Heart className="w-10 h-10 bg-white rounded-full p-2 duration-500 text-gray-700 cursor-pointer hover:bg-indigo-200" />
            </Link>
          </div>
          <div className="group flex items-center gap-2 duration-500 p-2 rounded-full cursor-pointer hover:bg-indigo-200" onClick={toggleCart}>
            <ShoppingCart className="w-10 h-10 bg-white rounded-full p-2 duration-500 text-gray-700 cursor-pointer opacity-85 group-hover:opacity-100" />
            <span>0.00 EGP</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EcommerceHeader;
