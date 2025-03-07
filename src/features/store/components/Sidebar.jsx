import { useState } from 'react';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useStore } from "../../../context/StoreContext";
import { Menu, ChevronsRight, ChevronsLeft, ChevronDown } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { mainCategories, subcategories, getSubcategories } = useStore();

  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <div className="flex fixed top-0 right-0 z-40">
      <div className={`bg-white text-gray-800 h-screen transition-all duration-1000 overflow-hidden flex flex-col justify-between items-center ${isOpen ? "w-full lg:w-[200px] shadow-md lg:shadow-none" : "w-0 lg:w-[50px]"
        }`}
      >
        <div className="w-full">
          <button onClick={toggleSidebar} className="w-full">
            <div className={`flex items-center text-indigo-600 justify-between gap-4 px-6 py-6 hover:bg-gray-100 ${isOpen ? '' : 'justify-center'}`}>
              {isOpen && <span className="text-base">جميع الأقسام</span>}
              <div className="hidden lg:block text-xl">{isOpen ? <ChevronsRight /> : <ChevronsLeft />}</div>
              <div className="lg:hidden text-xl"><Menu /></div>
            </div>
          </button>

          <div>

            {mainCategories && mainCategories.map((category) => (
              <div key={category._id} className="relative">
                {/* Main Category */}
                <div
                  onMouseEnter={() => {
                    setOpenDropdown(category._id);
                  }}
                  onLoad={() => getSubcategories(category._id)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link to={`/products/?category=${category._id}`} className={`group flex items-center gap-4 py-4 hover:bg-slate-100 hover:text-indigo-600 cursor-pointer ${isOpen ? 'px-6' : 'justify-center px-1'} ${location.pathname === category.link ? 'text-indigo-600 bg-slate-100' : ''}`}>
                    <div className={`w-[34px] h-[34px] flex justify-center items-center rounded-lg`}>
                      <img
                        src={`${baseUrl}/${category.icon.url.replace(/\\/g, '/')}`}
                        alt={category.icon.alt}
                        className="w-8 h-8 rounded-lg"
                      />
                    </div>
                    {isOpen && (<div className="flex items-center justify-between flex-grow text-gray-700">
                      <p className="text-base font-semibold">{category.name}</p>
                      <span>{subcategories[category._id]?.length > 0 && <ChevronDown />}</span>
                    </div>)}
                  </Link>

                  {/* Subcategories (Shown inline, not absolute) */}
                  {openDropdown === category._id && subcategories[category._id]?.length > 0 && (
                    <div className="bg-gray-50">
                      {subcategories[category._id].map((sub) => (
                        <Link key={sub._id} to={`/products/?category=${sub._id}`} className={`group flex items-center gap-4 py-4 hover:bg-slate-100 hover:text-indigo-600 cursor-pointer ${isOpen ? 'px-6' : 'justify-center px-1'} ${location.pathname === sub.link ? 'text-indigo-600 bg-slate-100' : ''}`}>
                          <div className={`w-[34px] h-[34px] flex justify-center items-center rounded-lg opacity-75`}>
                            <img
                              src={`${baseUrl}/${sub.icon.url.replace(/\\/g, '/')}`}
                              alt={sub.icon.alt}
                              className="w-8 h-8 rounded-lg"
                            />
                          </div>
                          {isOpen && <span className="text-base text-gray-500">{sub.name}</span>}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Sidebar;
