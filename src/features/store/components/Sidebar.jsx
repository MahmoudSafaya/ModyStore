import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useStore } from "../../../context/StoreContext";
import { Menu, ChevronsRight, ChevronsLeft } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { categories } = useStore();

  const baseUrl = import.meta.env.VITE_SERVER_URL;

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
            {categories && categories.map((item) => (
              <nav key={item._id}>
                <Link to={`/products/?category=${item._id}`} className={`group flex items-center gap-4 py-4 hover:bg-slate-100 hover:text-indigo-600 cursor-pointer ${isOpen ? 'px-6' : 'justify-center px-1'} ${location.pathname === item.link ? 'text-indigo-600 bg-slate-100' : ''}`}>
                  <div className={`w-[34px] h-[34px] flex justify-center items-center rounded-lg`}>
                    <img src={`${baseUrl}/${item.icon.url.replace(/\\/g, '/')}`} alt={item.icon.alt} />
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
