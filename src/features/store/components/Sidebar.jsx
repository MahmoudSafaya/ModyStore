import { useState } from 'react';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useStore } from "../../../context/StoreContext";
import { Menu, X, ChevronsRight, ChevronsLeft, ChevronDown } from "lucide-react";
import modyStoreLogo from '../../../assets/mody-store-logo.png'

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { storeMainNav, mainCategories, subcategories, getSubcategories } = useStore();
  const [isMain, setIsMain] = useState(false);

  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <div className={`flex fixed top-0 right-0 z-40 transition-all duration-1000 overflow-hidden ${isOpen ? 'w-[250px] shadow-md lg:shadow-none' : 'w-0 lg:w-[50px]'}`}>
      <div className={`w-full bg-white text-gray-800 h-screen transition-all duration-1000 overflow-hidden flex flex-col justify-between items-center`}
      >
        <div className="w-full">
          <button onClick={() => {
            toggleSidebar();
            setOpenDropdown(null);
          }} className="w-full">
            <div className={`flex items-center text-indigo-600 gap-4 px-6 py-6 h-20 hover:bg-gray-100 justify-between duration-1000 ${isOpen ? '' : 'lg:px-0 lg:justify-center lg:gap-0'}`}>
              {/* {isOpen && <span className="text-base">جميع الأقسام</span>} */}
              <div>
                <img src={modyStoreLogo} alt="mody store logo" className={`w-10 object-cover duration-1000 ${isOpen ? '' : 'lg:hidden'}`} />
              </div>
              <div className="hidden lg:block text-xl">{isOpen ? <ChevronsRight /> : <ChevronsLeft />}</div>
              <div className="lg:hidden text-xl"><X /></div>
            </div>
          </button>

          <div className='grid lg:hidden grid-cols-2'>
            <div className={`p-4 flex items-center justify-center duration-300 ${isMain ? 'bg-gray-200' : 'bg-gray-100'}`} onClick={() => setIsMain(true)}>
              <p>الرئيسية</p>
            </div>
            <div className={`p-4 flex items-center justify-center duration-300 ${isMain ? 'bg-gray-100' : 'bg-gray-200'}`} onClick={() => setIsMain(false)}>
              <p>الأقسام</p>
            </div>
          </div>

          {
            isMain ? (
              <div className="flex lg:hidden flex-col justify-center mt-2">
                {storeMainNav && storeMainNav.map((item, index) => (
                  <Link key={index} to={item.link} className={`py-4 px-6 text-base font-semibold`}>
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : (
              <div>
                {mainCategories && mainCategories.map((category) => (
                  <div key={category._id} className="relative">
                    {/* Main Category */}
                    <div
                      // onMouseEnter={() => {
                      //   isOpen && setOpenDropdown(category._id);
                      // }}
                      onLoad={() => getSubcategories(category._id)}
                    // onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <div className='flex items-center justify-between lg:justify-center flex-grow duration-500 hover:bg-slate-100'>
                        <Link to={`/products/?category=${category._id}`} className={`group flex items-center flex-grow py-4 hover:text-indigo-600 cursor-pointer duration-500 px-6 gap-4 ${location.pathname === category.link ? 'text-indigo-600 bg-slate-100' : ''}`}>
                          <div className={`w-[34px] h-[34px] flex justify-center items-center rounded-lg`}>
                            <img
                              src={`${baseUrl}/${category.icon.url.replace(/\\/g, '/')}`}
                              alt={category.icon.alt}
                              className="w-8 h-8 rounded-lg"
                            />
                          </div>
                          {/* {isOpen && (<div className="text-gray-700">
                            <p className="text-base font-semibold">{category.name}</p>
                          </div>)} */}
                          <div className={`text-gray-700 ${isOpen ? '' : 'lg:hidden'}`}>
                            <p className="text-base font-semibold">{category.name}</p>
                          </div>
                        </Link>
                        {subcategories[category._id]?.length > 0 && (
                          <div className={`text-gray-700 h-full p-1 ml-6 cursor-pointer border border-gray-300 rounded-lg duration-500 hover:border-indigo-500 ${isOpen ? '' : 'lg:hidden'}`} onClick={() => {
                            openDropdown ? setOpenDropdown(null) : setOpenDropdown(category._id)
                          }}>
                            <span>
                              <ChevronDown />
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Subcategories (Shown inline, not absolute) */}
                      {openDropdown === category._id && subcategories[category._id]?.length > 0 && (
                        <div className="bg-gray-50">
                          {isOpen && subcategories[category._id].map((sub) => (
                            <Link key={sub._id} to={`/products/?category=${sub._id}`} className={`group flex items-center gap-4 py-4 hover:bg-slate-100 hover:text-indigo-600 cursor-pointer px-6 pr-10 ${location.pathname === sub.link ? 'text-indigo-600 bg-slate-100' : ''}`}>
                              <div className={`w-[34px] h-[34px] flex justify-center items-center rounded-lg opacity-75`}>
                                <img
                                  src={`${baseUrl}/${sub.icon.url.replace(/\\/g, '/')}`}
                                  alt={sub.icon.alt}
                                  className="w-6 h-6 rounded-lg"
                                />
                              </div>
                              <span className="text-sm text-gray-500">{sub.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          }



        </div>
      </div>
    </div >
  );
};

export default Sidebar;
