import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { GiClothes } from "react-icons/gi";
import { MdOutlineAddBusiness } from "react-icons/md";
import { Menu, House, PackagePlus, PackageOpen } from "lucide-react";
import { useStore } from "../../../context/StoreContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
 const {modyStoreCategories} = useStore();

  return (
    <div className="flex fixed top-0 right-0 z-40">
      <div className={`bg-white text-gray-800 h-screen transition-all duration-1000 overflow-hidden flex flex-col justify-between items-center ${isOpen ? "w-[200px] shadow-md lg:shadow-none" : "w-[50px]"
        }`} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}
      >
        <div className="w-full">
          <button className="w-full">
            <div className={`flex items-center text-indigo-600 justify-between gap-4 px-6 py-6 hover:bg-gray-100 ${isOpen ? '' : 'justify-center'}`}>
              {isOpen && <span className="text-base">جميع الأقسام</span>}
              <div className="text-xl"><Menu /></div>
            </div>
          </button>
          
          <div>
            {modyStoreCategories.map((item, index) => (
              <nav key={index}>
                <Link to={item.link} className={`group flex items-center gap-4 py-4 hover:bg-slate-100 hover:text-indigo-600 cursor-pointer ${isOpen ? 'px-6' : 'justify-center px-1'} ${location.pathname === item.link ? 'text-indigo-600 bg-slate-100' : ''}`}>
                  <div className={`w-[34px] h-[34px] flex justify-center items-center rounded-lg`}>
                    <img src={item.icon} alt={item.name} />
                  </div>
                  {isOpen && <span className="text-base">{item.name}</span>}
                </Link>
              </nav>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Sidebar;
