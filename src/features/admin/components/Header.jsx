import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CircleUserRound } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";

const Header = ({ isOpen }) => {
  const { auth, logout } = useAuth();
  const [onProfile, setOnProfile] = useState(false);
  const [userName, setUserName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.get('/users');
        const userData = res.data.find(item => item._id === auth.id);
        setUserName(userData.userName);
      } catch (error) {
        console.error(error);
      }
    }
    if (auth) {
      getUserData();
    }
  }, [auth]);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={`flex items-center justify-end py-6 lg:px-6 bg-white transition-all duration-500 ml-[20px] mr-[50px]  ${isOpen ? 'lg:w-[calc(100%-200px)] lg:mr-[200px]' : 'lg:w-[calc(100%-50px)] lg:mr-[50px]'}`}>
      <div className="relative">
        <div
          className="flex items-center cursor-pointer duration-500 hover:drop-shadow-md hover:rotate-45"
          onClick={() => setOnProfile(!onProfile)}
        >
          <CircleUserRound className="text-3xl text-gray-600" />
        </div>
        {onProfile && (
          <div
            className="absolute left-0 z-40 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg p-4"
            onMouseLeave={() => setTimeout(() => {
              setOnProfile(false)
            }, 400)}
          >
            <p className="text-gray-800 font-semibold">{userName}</p>
            <p className="text-sm text-gray-500">{auth?.role}</p>
            <button className="mt-3 w-full bg-gray-600 text-white py-2 px-4 rounded duration-500 hover:bg-gray-700" onClick={handleLogout}>
              تسجيل الخروج
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
