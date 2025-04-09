import { useState } from 'react';
import { axiosAuth } from '../../../api/axios';
import { useEffect } from 'react';
import Loading from '../../../shared/components/Loading';
import { BiCategory } from "react-icons/bi";
import { IoStorefrontOutline } from "react-icons/io5";
import { PackageOpen } from 'lucide-react'
import { A_OrdersTable } from '../components';
import { useOrders } from '../../../context/OrdersContext';
import { useApp } from '../../../context/AppContext';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [dashCounts, setDashCounts] = useState({});
  const [todayOrders, setTodayOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { orderPopup, setOrderPopup } = useOrders();
  const { deleteNotify } = useApp();

  const cards = [
    [
      { title: "أقسام أساسية", value: dashCounts?.mainCategories, icon: <BiCategory className='w-6 h-6' />, iconBg: "bg-indigo-500" },
      { title: "أقسام فرعية", value: dashCounts?.subCategories, icon: <BiCategory className='w-6 h-6' />, iconBg: "bg-indigo-500" },
    ],
    [
      { title: "اوردرات مسجلة", value: dashCounts?.confirmedOrders, icon: <PackageOpen className='w-6 h-6' />, iconBg: "bg-yellow-500" },
      { title: "اوردارات غير مسجلة", value: dashCounts?.unconfirmedOrders, icon: <PackageOpen className='w-6 h-6' />, iconBg: "bg-yellow-500" },
    ],
    [
      { title: "منتجات نشطة", value: dashCounts?.acitvePoducts, icon: <IoStorefrontOutline className='w-6 h-6' />, iconBg: "bg-green-500" },
      { title: "منتجات غير نشطة", value: dashCounts?.unactivePoducts, icon: <IoStorefrontOutline className='w-6 h-6' />, iconBg: "bg-green-500" },
    ]
  ];

  const getCounts = async () => {
    try {
      setLoading(true);

      const [ordersRes, categoriesRes, productsRes] = await Promise.all([
        axiosAuth.get("/orders/counts"),
        axiosAuth.get("/categories/counts"),
        axiosAuth.get("/products/counts"),
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
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTodayDateISO = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Extract only YYYY-MM-DD
  };

  const getTodayOrders = async () => {
    setLoading(true);
    const todayDate = getTodayDateISO();
    try {
      const response = await axiosAuth.post('/orders/search', {
        confirmed: "0",
        startDate: `${todayDate}T00:00:00Z`,  // Start of the day
        endDate: `${todayDate}T23:59:59Z`    // End of the day
      });
      const data = response.data;
      setTodayOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderID) => {
    try {
      await axiosAuth.delete(`/visitors/orders/${orderID}`);
      deleteNotify('تم حذف الطلب بنجاح!');
      getTodayOrders();
      orderPopup.display && setOrderPopup({ display: false, editing: false, info: {} })
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getCounts();
  }, []);

  useEffect(() => {
    getTodayOrders();
  }, [orderPopup]);

  if (loading) return <Loading />

  return (
    <div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">


          {cards.map((inCard, index) => (
            <div key={index} className='grid grid-cols-2 md:grid-cols-1 gap-6'>
              {inCard.map(({ icon, iconBg, title, value }, index) => (
                <div key={index} className={`bg-white py-6 px-4 rounded-xl shadow-md flex flex-col justify-between items-center gap-6`}>
                  <div className={`w-12 h-12 p-0 flex items-center justify-center rounded-lg text-white ${iconBg}`}>
                    {icon}
                  </div>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <h3 className="text-gray-500 text-center mb-2">{title}</h3>
                    <p className="text-2xl font-bold text-gray-700">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}

        </div>
      </div>

      {/* Table With Search */}
      <A_OrdersTable orders={todayOrders} setOrders={setTodayOrders} handleDelete={handleDeleteOrder} fetchOrders={getTodayOrders} setCurrentPage={setCurrentPage} setTotalPages={setTotalPages} />
    </div>
  );
};

export default Home;