import React, { useState } from "react";
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
  const [onProfile, setOnProfile] = useState(false);

  const routes = location.pathname.split('/');

  return (
    <header className={`flex items-center justify-between py-6 lg:px-6 bg-white transition-all duration-500 ml-[20px] mr-[50px]  ${isOpen ? 'lg:w-[calc(100%-200px)] lg:mr-[200px]' : 'lg:w-[calc(100%-50px)] lg:mr-[50px]'}`}>
      <div className="grow-1 text-center">
        Add Product
      </div>
      <div className="relative">
        <div
          className="flex items-center cursor-pointer duration-500 hover:drop-shadow-md hover:-rotate-20"
          onClick={() => setOnProfile(!onProfile)}
        >
          <CircleUserRound className="text-3xl text-gray-600" />
        </div>
        {onProfile && (
          <div
            className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg p-4"
            onMouseEnter={() => setOnProfile(true)}
            onBlur={() => setOnProfile(false)}
          >
            <p className="text-gray-800 font-semibold">John Doe</p>
            <p className="text-sm text-gray-500">johndoe@example.com</p>
            <button className="mt-3 w-full bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
