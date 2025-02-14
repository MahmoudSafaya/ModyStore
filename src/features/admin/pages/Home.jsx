import { useAuth } from '../../../context/AdminContext';
import ReactEchart from '../../../shared/components/ReactEchart';
import { FaDollarSign, FaUndo, FaCalendar, FaBan, FaTree } from "react-icons/fa";

const cards = [
  { title: "جميع الاوردارات", value: "16,689", icon: <FaDollarSign />, bg: "from-indigo-200 to-70% to-indigo-50", iconBg: "bg-indigo-500" },
  { title: "اوردارات المسجله", value: "$36,715", icon: <FaTree />, bg: "from-green-200 to-70% to-green-50", iconBg: "bg-green-500" },
  { title: "مرتجعات", value: "148", icon: <FaUndo />, bg: "from-yellow-200 to-70% to-yellow-50", iconBg: "bg-yellow-500" },
  { title: "يتم التسليم", value: "$156K", icon: <FaCalendar />, bg: "from-blue-200 to-70% to-blue-50", iconBg: "bg-blue-500" },
  { title: "اوردارات ملغية", value: "64", icon: <FaBan />, bg: "from-red-200 to-70% to-red-50", iconBg: "bg-red-500" },
];

const Home = () => {
  const { auth } = useAuth();

  return (
    <div>
      <h1>أهلا, {auth?.user.name}</h1>
      <div>
        <div className="grid lg:grid-cols-5 gap-8 custom-bg-white mt-8">
          {cards.map((card, index) => (
            <div key={index} className={`flex items-center justify-center flex-col p-6 rounded-lg shadow-sm bg-gradient-to-b ${card.bg}`}>
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg text-white ${card.iconBg}`}>
                {card.icon}
              </div>
              <h3 className="mt-4 text-gray-500 mb-2">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-700">{card.value}</p>
              <button className="mt-4 bg-white px-4 py-2 shadow-sm rounded-lg text-gray-700 duration-300 hover:bg-gray-700 hover:text-white">
                معرفة التفاصيل
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="admin-home-echarts">
        <ReactEchart />
      </div>
    </div>
  );
};

export default Home;
