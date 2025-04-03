import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useLocation } from "react-router-dom";
import { GiClothes } from "react-icons/gi";
import { MdOutlineAddBusiness } from "react-icons/md";
import { Menu, House, ChevronsRight, ChevronsLeft, Settings, PackagePlus, PackageOpen, LogOut, ScanBarcode } from "lucide-react";
import modyStoreLogo from '../../../assets/diva-store-logo.png'
import { IoStorefrontOutline } from "react-icons/io5";

const Sidebar = ({ isOpen, toggleSidebar }) => {

  const { auth, logout } = useAuth();

  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const adminNav = [
    { icon: <House />, label: "الرئيسية", link: '/admin' },
    { icon: <PackagePlus />, label: "تسجيل اوردر", link: '/admin/place-order' },
    { icon: <PackageOpen />, label: "قائمة الطلبات", link: '/admin/orders' },
    { icon: <IoStorefrontOutline />, label: "طلبات الموقع", link: '/admin/unconfirmed-orders' },
  ];
  const storeNav = [
    { icon: <GiClothes />, label: "المنتجات", link: '/admin/products' },
    { icon: <MdOutlineAddBusiness />, label: "اضافة منتج", link: '/admin/add-product' },
    { icon: <ScanBarcode />, label: "سحب / إدخال", link: '/admin/handle-storage' },
    { icon: <Settings />, label: "الإعدادات", link: '/admin/settings' },
  ];

  return (
    <div className="flex fixed top-0 right-0 z-80">
      <div className={`bg-white text-gray-800 h-screen transition-all duration-500 overflow-hidden flex flex-col justify-between items-center overflow-y-auto ${isOpen ? "w-[200px] shadow-md lg:shadow-none" : "w-[50px]"
        }`}
      >
        <div className="w-full">
          <button type="button" name="admin-menu-btn" onClick={toggleSidebar} className="w-full">
            <div className={`flex items-center text-indigo-600 justify-between gap-4 px-6 py-6 hover:bg-gray-100 ${isOpen ? '' : 'justify-center'}`}>
              {isOpen && (<div>
                <img src={modyStoreLogo} className="w-14 h-auto object-cover" alt="Diva Store" />
              </div>)}
              <div className="hidden lg:block text-xl">{isOpen ? <ChevronsRight /> : <ChevronsLeft />}</div>
              <div className="lg:hidden text-xl"><Menu /></div>
            </div>
          </button>

          <div className="">
            {adminNav.map((item, index) => {
              if(item.link === '/admin' && auth?.role === 'user') return;
              return (
                <nav key={index}>
                  <Link to={item.link} className={`group flex items-center flex-grow gap-4 py-4 hover:bg-slate-100 hover:text-indigo-600 duration-500 cursor-pointer ${isOpen ? 'px-6' : 'justify-center px-1'} ${location.pathname === item.link ? 'text-indigo-600 bg-slate-100' : ''}`} aria-label="navbar Main Link">
                    <div className={`w-[36px] h-[36px] text-xl flex justify-center items-center rounded-lg group-hover:bg-indigo-300 group-hover:shadow-md ${location.pathname === item.link ? 'bg-indigo-600 text-white shadow-md group-hover:bg-indigo-600' : ''}`}>{item.icon}</div>
                    {isOpen && <span className="text-base">{item.label}</span>}
                  </Link>
                </nav>
              )
            })}
          </div>
          {auth?.role === 'admin' && <hr className="my-4 w-5/6 mx-auto" /> }
          
          {auth?.role === 'admin' && (
            <div>
              {storeNav.map((item, index) => (
                <nav key={index}>
                  <Link to={item.link} className={`group flex items-center gap-4 py-4 hover:bg-slate-100 hover:text-indigo-600 cursor-pointer ${isOpen ? 'px-6' : 'justify-center px-1'} ${location.pathname === item.link ? 'text-indigo-600 bg-slate-100' : ''}`} aria-label="navbar Main Link">
                    <div className={`w-[36px] h-[36px] text-xl flex justify-center items-center rounded-lg group-hover:bg-indigo-300 group-hover:shadow-md ${location.pathname === item.link ? 'bg-indigo-600 text-white shadow-md group-hover:bg-indigo-600' : ''}`}>{item.icon}</div>
                    {isOpen && <span className="text-base whitespace-nowrap">{item.label}</span>}
                  </Link>
                </nav>
              ))}
            </div>
          )}

        </div>

        <button type="button" name="admin-logout-btn" className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-100 hover:text-indigo-600 ${isOpen ? '' : 'justify-center'}`}
          onClick={handleLogout}
        >
          <div className="text-xl"><LogOut /></div>
          {isOpen && <span className="text-base">تسجيل الخروج</span>}
        </button>
      </div>

      {/* <div className={`w-[calc(100%-200px)] h-full fixed top-0 left-0 bg-[#00000015] ${isOpen ? 'lg:hidden' : 'hidden'}`}></div> */}
    </div>
  );
};

export default Sidebar;
