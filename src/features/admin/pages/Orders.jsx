import React, { useState } from "react";
import { A_OrderInfo, A_BillOfLading } from "../components";
import { A_NewOrder } from ".";
import { IoClose } from "react-icons/io5";
import "../styles/orders.scss";


import { Search, MoreVertical } from "lucide-react";
import SearchFeature from "../components/SearchFeature";

const orders = [
  {
    id: 1,
    name: "محمد احمد علي",
    products: ['شال هاي كول', 'سماعه ايربودز'],
    category: "books",
    date: "Thu, Jan 12 2023",
    status: "متاح",
    state: 'القاهرة',
    price: "$275",
    image: "https://via.placeholder.com/50",
  },
  {
    id: 2,
    name: "محمد احمد علي",
    products: ['شال هاي كول', 'سماعه ايربودز'],
    category: "books",
    date: "Thu, Jan 10 2023",
    status: "غير متاح",
    state: 'القاهرة',
    price: "$89",
    image: "https://via.placeholder.com/50",
  },
  {
    id: 3,
    name: "محمد احمد علي",
    products: ['شال هاي كول', 'سماعه ايربودز'],
    category: "fashionbooks",
    date: "Thu, Jan 12 2023",
    status: "متاح",
    state: 'القاهرة',
    price: "$125",
    image: "https://via.placeholder.com/50",
  },
  {
    id: 4,
    name: "محمد احمد علي",
    products: ['شال هاي كول', 'سماعه ايربودز'],
    category: "electronics",
    date: "Mon, Jan 16 2023",
    status: "متاح",
    state: 'القاهرة',
    price: "$50",
    image: "https://via.placeholder.com/50",
  },
];

const Orders = () => {
  // const { orders, setOrders, getOrders, deleteOrder } = useAuth();
  const [selection, setSelection] = useState("الكل");
  const [orderPopup, setOrderPopup] = useState({
    display: false,
    editing: false,
    info: {},
  });

  const categories = [
    "الكل",
    "غير مطبوع",
    "تم الطباعه",
    "تم التسليم",
    "مرتجع",
    "تم الإلغاء",
  ];

  const handleOrderPopup = (data) => {
    setOrderPopup({ ...orderPopup, ...data });
  };

  // useEffect(() => {
  //   getOrders();
  // }, []);

  return (
    <div>
      <div className="custom-bg-white">
        <A_BillOfLading
          orders={
            orders && orders.filter((item) => item.status === "Unprinted")
          }
        />

        {/* Search Features */}
        <SearchFeature />
      </div>

      <div className="custom-bg-white mt-8">
        <div className="w-full flex justify-stretch items-center flex-wrap">
          {categories.map((item) => {
            return (
              <button
                key={item}
                className={`grow font-bold p-2 px-4 shabdow-md border border-gray-200 duration-500 ${item === selection ? "bg-indigo-500 text-white" : "bg-white text-gray-800 hover:bg-indigo-400 hover:text-white"}`}
                onClick={() => setSelection(item)}
              >
                {item}
              </button>
            );
          })}
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white mt-8">
            <thead className="text-gray-600 border-b border-gray-200 font-bold text-center">
              <tr>
                <th className="p-3">اسم العميل</th>
                <th className="p-3">المنتجات</th>
                <th className="p-3">الحاله</th>
                <th className="p-3">المحافظة</th>
                <th className="p-3">السعر</th>
                <th className="p-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 text-center">
                  <td className="p-3 space-x-3">
                    {item.name}
                  </td>
                  <td className="p-3 text-gray-500">{item.products.map(product => {
                    return (
                      <p key={product}>{product}</p>
                    )
                  })}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center justify-center w-2/3 p-2 rounded-xl text-sm font-medium ${item.status === "متاح"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                        }`}
                    >
                      {item.status}
                      <span
                        className={`w-2 h-2 mr-2 rounded-full ${item.status === "متاح" ? "bg-green-500" : "bg-red-500"
                          }`}
                      ></span>
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">{item.state}</td>
                  <td className="p-3 font-semibold">{item.price}</td>
                  <td className="p-3">
                    <MoreVertical className="text-gray-500 cursor-pointer mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orderPopup.display && <A_OrderInfo info={orderPopup.info} />}
        {orderPopup.editing && (
          <div className="editing-order-box">
            <div className="inside-it">
              <div className="inside-header">
                <h2>
                  Edit Order:{" "}
                  <span
                    onClick={() =>
                      navigator.clipboard.writeText(orderPopup.info.barcodeID)
                    }
                  >
                    {orderPopup.info.barcodeID}
                  </span>
                </h2>
                <span
                  className="close-icon"
                  onClick={() =>
                    setOrderPopup({ ...orderPopup, editing: false })
                  }
                >
                  <IoClose />
                </span>
              </div>
              <A_NewOrder
                editMode={orderPopup.editing}
                info={orderPopup.info}
                handleOrderPopup={handleOrderPopup}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
