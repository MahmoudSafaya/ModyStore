import React, { useState, useEffect } from "react";
import { A_BillOfLading } from "../components";
import SearchFeature from "../components/SearchFeature";
import { useOrders } from "../../../context/OrdersContext";
import axios from "../../../api/axios";
import toast, { Toaster } from 'react-hot-toast';
import OrdersTable from "../components/OrdersTable";

const Orders = () => {
  const { jntOrders, setJNTOrders, getJNTOrders } = useOrders();
  const [selection, setSelection] = useState("الكل");

  const categories = [
    "الكل",
    "غير مطبوع",
    "تم الطباعه",
    "تم التسليم",
    "مرتجع",
    "تم الإلغاء",
  ];

  const cancelOrderFromJNT = async (orderID) => {
    try {
      const response = await axios.delete(`/jnt/orders/${orderID}`);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  const printOrder = async (orderID) => {
    try {
      const response = await axios.post(`/jnt/orders/print/${orderID}`, {
        responseType: "blob", // Important for handling binary data
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Open the PDF in a new tab
      window.open(url);

      // If you want to print it automatically
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow.print();
      };
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  useEffect(() => {
    getJNTOrders();
  }, []);

  return (
    <div>
      <div className="custom-bg-white">
        {/* <A_BillOfLading
          orders={
            orders && orders.filter((item) => item.status === "Unprinted")
          }
        /> */}

        {/* Search Features */}

        <button onClick={() => printOrder("67b87a41330839f9614d42dc")} className="bg-indigo-500 text-white rounded-lg p-2">Print Bill</button>
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

        <OrdersTable orders={jntOrders} handleDelete={cancelOrderFromJNT} />

        {/* Success notify*/}
        <Toaster />
      </div>
    </div>
  );
};

export default Orders;
