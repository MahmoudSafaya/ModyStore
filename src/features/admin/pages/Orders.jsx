import React, { useState, useEffect } from "react";
import { A_BillOfLading } from "../components";
import SearchFeature from "../components/SearchFeature";
import { useOrders } from "../../../context/OrdersContext";
import axios from "../../../api/axios";
import toast, { Toaster } from 'react-hot-toast';
import OrdersTable from "../components/OrdersTable";

const Orders = () => {
  const { cancelOrderFromJNT } = useOrders();
  const [selection, setSelection] = useState("الكل");

  const categories = [
    "الكل",
    "غير مطبوع",
    "تم الطباعه",
    "تم التسليم",
    "مرتجع",
    "تم الإلغاء",
  ];


  return (
    <div>
      <div className="custom-bg-white">

        {/* Search Features */}
        <SearchFeature />
      </div>

      <div className="custom-bg-white mt-8">
        {/* <div className="w-full flex justify-stretch items-center flex-wrap">
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
        </div> */}

        <OrdersTable inConfirmed={true} apiUrl='/jnt/orders/' handleDelete={cancelOrderFromJNT} />

        {/* Success notify*/}
        <Toaster />
      </div>
    </div>
  );
};

export default Orders;
