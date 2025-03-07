import { useState } from 'react';
import axios from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';
import ReactEchart from '../../../shared/components/ReactEchart';
import { FaDollarSign, FaUndo, FaCalendar, FaBan, FaTree } from "react-icons/fa";
import { useEffect } from 'react';
import Loading from '../../../shared/components/Loading';

const cards = [
  { title: "جميع الاوردارات", value: "16,689", icon: <FaDollarSign />, iconBg: "bg-indigo-500" },
  { title: "اوردارات المسجله", value: "$36,715", icon: <FaTree />, iconBg: "bg-green-500" },
  { title: "مرتجعات", value: "148", icon: <FaUndo />, iconBg: "bg-yellow-500" },
  { title: "يتم التسليم", value: "$156K", icon: <FaCalendar />, iconBg: "bg-blue-500" },
  { title: "اوردارات ملغية", value: "64", icon: <FaBan />, iconBg: "bg-red-500" },
];

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [dashCounts, setDashCounts] = useState({});

  const fetchCounts = async () => {
    try {
      setLoading(true);

      const [ordersRes, categoriesRes, productsRes] = await Promise.all([
        axios.get("/orders/counts"),
        axios.get("/categories/counts"),
        axios.get("/products/counts"),
      ]);

      setDashCounts((prev) => ({
        ...prev,
        unconfirmedOrders: ordersRes.data.counts.unconfirmedOrders,
        confirmedOrders: ordersRes.data.counts.confirmedOrders,
        mainCategories: categoriesRes.data.counts.mainCategories,
        subCategories: categoriesRes.data.counts.subCategories,
        acitvePoducts: productsRes.data.counts.acitvePoducts,
        unactivePoducts: productsRes.data.counts.unactivePoducts,
        variants: productsRes.data.counts.variants,
      }));

      console.log(productsRes)
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  if (loading) return <Loading />

  return (
    <div>
      <div>
        <div className="grid lg:grid-cols-5 gap-8 mt-8">
          {/* {cards.map((card, index) => (
            <div key={index} className={`custom-bg-white flex items-center justify-center flex-col`}>
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg text-white ${card.iconBg}`}>
                {card.icon}
              </div>
              <h3 className="text-gray-500 mt-6 mb-2">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-700">{card.value}</p>
            </div>
          ))} */}
          <div className='custom-bg-white flex items-center justify-center flex-col'>
            <h3 className="text-gray-500 mt-6 mb-2">Main Categories</h3>
            <p className="text-2xl font-bold text-gray-700">{dashCounts?.mainCategories}</p>
          </div>
          <div className='custom-bg-white flex items-center justify-center flex-col'>
            <h3 className="text-gray-500 mt-6 mb-2">Sub Categories</h3>
            <p className="text-2xl font-bold text-gray-700">{dashCounts?.subCategories}</p>
          </div>
          <div className='custom-bg-white flex items-center justify-center flex-col'>
            <h3 className="text-gray-500 mt-6 mb-2">Confirmed</h3>
            <p className="text-2xl font-bold text-gray-700">{dashCounts?.confirmedOrders}</p>
          </div>
          <div className='custom-bg-white flex items-center justify-center flex-col'>
            <h3 className="text-gray-500 mt-6 mb-2">UnConfirmed</h3>
            <p className="text-2xl font-bold text-gray-700">{dashCounts?.unconfirmedOrders}</p>
          </div>
          <div className='custom-bg-white flex items-center justify-center flex-col'>
            <h3 className="text-gray-500 mt-6 mb-2">Active Products</h3>
            <p className="text-2xl font-bold text-gray-700">{dashCounts?.acitvePoducts}</p>
          </div>
          <div className='custom-bg-white flex items-center justify-center flex-col'>
            <h3 className="text-gray-500 mt-6 mb-2">InActive Products</h3>
            <p className="text-2xl font-bold text-gray-700">{dashCounts?.unactivePoducts}</p>
          </div>
        </div>
      </div>
      <div className="admin-home-echarts">
        <ReactEchart />
      </div>
    </div>
  );
};

export default Home;
