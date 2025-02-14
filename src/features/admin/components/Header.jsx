import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Menu, CircleUserRound } from "lucide-react";

// const appRoutes = {
//   "admin": 'home',
//   "place-order": "",
//   "orders": '',
  
// }

const Header = ({ isOpen }) => {
  const location = useLocation();

  const routes = location.pathname.split('/');

  return (
    <header className={`flex items-center justify-between py-6 lg:px-6 bg-white transition-all duration-500 ml-[20px] mr-[50px]  ${isOpen ? 'lg:w-[calc(100%-200px)] lg:mr-[200px]' : 'lg:w-[calc(100%-50px)] lg:mr-[50px]'}`}>
      <div className="grow-1 text-center">
        Add Product
      </div>
      <div className="flex justify-center items-center gap-4">
        <Link className="text-xl">
          <CircleUserRound />
        </Link>
      </div>
    </header>
  );
};

export default Header;
