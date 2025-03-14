import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, Heart, ShoppingCart } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useStore } from "../../../context/StoreContext";
import { useCart } from "../../../context/CartContext";
import { useApp } from "../../../context/AppContext";
import modyStoreLogo from '../../../assets/diva-store-logo.png'

const EcommerceHeader = ({ toggleSidebar }) => {
  const { storeMainNav, products } = useStore();
  const { toggleCart, totalPrice } = useCart();
  const { getCategoryById } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const location = useLocation();
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.length > 0) {
      const results = products.filter(product =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
      setIsDropdownOpen(true);
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  return (
    <header className="w-full lg:w-[calc(100%-50px)] lg:mr-[50px] flex flex-col">
      <div className="w-full py-4 px-4 md:px-12 flex justify-between items-center gap-2 lg:gap-10">
        <div className="logo">
          <Link to="/" className="logo-link">
            <img src={modyStoreLogo} className="w-14" />
          </Link>
        </div>

        <div className="flex-grow">
          <div className="relative">
            <input type="text" name="discount-price" id="discount-price" className="w-full p-2 border border-gray-300 rounded-full focus:border-indigo-300 outline-none" placeholder="ابحث عن منتج..." value={searchTerm} onChange={handleSearch} onBlur={handleBlur} />
            <Search className="w-8 h-8 p-2 rounded-full bg-indigo-500 text-white absolute top-[50%] -translate-y-[50%] left-1 border border-indigo-200" />

            {isDropdownOpen && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                {searchResults.map((product, index) => {
                  if(index > 9) return;
                  return (
                    <Link
                      key={product._id}
                      to={`/products/${product._id}`}
                      className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="w-16">
                        <img src={encodeURI(`${baseUrl}/${product.mainImage.url.replace(/\\/g, '/')}`)} alt={product.mainImage.alt} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{getCategoryById(product.category)}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}

          </div>
        </div>

        <div className="user-controls">
          <button className="max-w-content py-2 px-2 md:px-4 bg-green-400 text-gray-100 rounded-full duration-500 hover:bg-green-500 hover:text-white">
            <a href="https://wa.me/01011789966" target="_blanck" className="flex items-center justify-center gap-2">
              <span className="hidden md:block"> ابعتلنا واتساب</span>
              <FaWhatsapp className="w-6 h-6" />
            </a>
          </button>
        </div>
      </div>

      <div className="w-full py-4 px-4 md:px-12 flex justify-between items-center bg-indigo-100 text-gray-800">

        <div className="flex items-center gap-2 rounded-full py-1 pr-1 pl-4 bg-white cursor-pointer duration-500 hover:opacity-85" onClick={toggleSidebar}>
          <Menu className="w-10 h-10 bg-indigo-600 text-white rounded-full p-2 duration-500 text-gray-700 cursor-pointer opacity-85 group-hover:opacity-100" />
          <span>عرض الأقسام</span>
        </div>
        <nav className="hidden lg:flex justify-center items-center gap-8">
          {storeMainNav.map((item, index) => (
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
            <span>{totalPrice} EGP</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EcommerceHeader;
