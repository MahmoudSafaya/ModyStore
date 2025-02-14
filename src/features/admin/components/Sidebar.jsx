import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AdminContext";
import { useLocation } from "react-router-dom";
import { GiClothes } from "react-icons/gi";
import { MdOutlineAddBusiness } from "react-icons/md";
import { Menu, House, ChevronsRight, ChevronsLeft, Settings, PackagePlus, PackageOpen, LogOut, ScanBarcode } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNav = [
    { icon: <House />, label: "الرئيسية", link: '/admin' },
    { icon: <PackagePlus />, label: "تسجيل اوردر", link: '/admin/place-order' },
    { icon: <PackageOpen />, label: "قائمة الطلبات", link: '/admin/orders' },
    { icon: <Settings />, label: "الإعدادات", link: '/admin/settings' },
  ];
  const storeNav = [
    { icon: <GiClothes />, label: "المنتجات", link: '/admin/products' },
    { icon: <MdOutlineAddBusiness />, label: "اضافة منتج", link: '/admin/add-product' },
    { icon: <ScanBarcode />, label: "سحب / إدخال", link: '/admin/handle-storage' },
  ];

  return (
    <div className="flex fixed top-0 right-0 z-40">
      <div className={`bg-white text-gray-800 h-screen transition-all duration-500 overflow-hidden flex flex-col justify-between items-center ${isOpen ? "w-[200px] shadow-md lg:shadow-none" : "w-[50px]"
        }`}
      >
        <div className="w-full">
          <button onClick={toggleSidebar} className="w-full">
            <div className={`flex items-center text-indigo-600 justify-between gap-4 px-6 py-6 hover:bg-gray-100 ${isOpen ? '' : 'justify-center'}`}>
              {isOpen && <span className="text-base">ModyStore</span>}
              <div className="hidden lg:block text-xl">{isOpen ? <ChevronsLeft /> : <ChevronsRight />}</div>
              <div className="lg:hidden text-xl"><Menu /></div>
            </div>
          </button>

          <div className="mt-4 md:mt-8">
            {adminNav.map((item, index) => (
              <nav key={index}>
                <Link to={item.link} className={`group flex items-center gap-4 py-4 hover:bg-slate-100 hover:text-indigo-600 duration-500 cursor-pointer ${isOpen ? 'px-6' : 'justify-center px-1'} ${location.pathname === item.link ? 'text-indigo-600 bg-slate-100' : ''}`}>
                  <div className={`w-[36px] h-[36px] text-xl flex justify-center items-center rounded-lg group-hover:bg-indigo-300 group-hover:shadow-md ${location.pathname === item.link ? 'bg-indigo-600 text-white shadow-md group-hover:bg-indigo-600' : ''}`}>{item.icon}</div>
                  {isOpen && <span className="text-base">{item.label}</span>}
                </Link>
              </nav>
            ))}
          </div>
          <hr className="my-4 w-5/6 mx-auto" />
          <div>
            {storeNav.map((item, index) => (
              <nav key={index}>
                <Link to={item.link} className={`group flex items-center gap-4 py-4 hover:bg-slate-100 hover:text-indigo-600 cursor-pointer ${isOpen ? 'px-6' : 'justify-center px-1'} ${location.pathname === item.link ? 'text-indigo-600 bg-slate-100' : ''}`}>
                  <div className={`w-[36px] h-[36px] text-xl flex justify-center items-center rounded-lg group-hover:bg-indigo-300 group-hover:shadow-md ${location.pathname === item.link ? 'bg-indigo-600 text-white shadow-md group-hover:bg-indigo-600' : ''}`}>{item.icon}</div>
                  {isOpen && <span className="text-base">{item.label}</span>}
                </Link>
              </nav>
            ))}
          </div>

        </div>

        <button className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-100 hover:text-indigo-600 ${isOpen ? '' : 'justify-center'}`}
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
