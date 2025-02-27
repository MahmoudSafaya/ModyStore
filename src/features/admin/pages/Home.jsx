import { useAuth } from '../../../context/AdminContext';
import ReactEchart from '../../../shared/components/ReactEchart';
import { FaDollarSign, FaUndo, FaCalendar, FaBan, FaTree } from "react-icons/fa";

const cards = [
  { title: "جميع الاوردارات", value: "16,689", icon: <FaDollarSign />, iconBg: "bg-indigo-500" },
  { title: "اوردارات المسجله", value: "$36,715", icon: <FaTree />, iconBg: "bg-green-500" },
  { title: "مرتجعات", value: "148", icon: <FaUndo />, iconBg: "bg-yellow-500" },
  { title: "يتم التسليم", value: "$156K", icon: <FaCalendar />, iconBg: "bg-blue-500" },
  { title: "اوردارات ملغية", value: "64", icon: <FaBan />, iconBg: "bg-red-500" },
];

const Home = () => {
  const { auth } = useAuth();

  return (
    <div>
      <h1>أهلا, {auth?.user.name}</h1>
      <div>
        <div className="grid lg:grid-cols-5 gap-8 mt-8">
          {cards.map((card, index) => (
            <div key={index} className={`custom-bg-white flex items-center justify-center flex-col`}>
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg text-white ${card.iconBg}`}>
                {card.icon}
              </div>
              <h3 className="text-gray-500 mt-6 mb-2">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-700">{card.value}</p>
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
