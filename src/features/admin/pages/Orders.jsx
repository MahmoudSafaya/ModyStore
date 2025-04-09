import React, { useState, useEffect } from "react";
import { axiosAuth } from "../../../api/axios";
import { Toaster } from 'react-hot-toast';
import { useApp } from "../../../context/AppContext";
import { A_OrdersTable, A_SearchFeature } from "../components";
import { useOrders } from "../../../context/OrdersContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { deleteNotify } = useApp();
  const { setOrderPopup } = useOrders();
  const [filter, setFilter] = useState('');

  const fetchOrders = async (page) => {
    try {
      const response = await axiosAuth.get(`/jnt/orders/?page=${page}`);
      const data = response.data;
      setOrders(data.orders);
      if (data.orders.length > 0) {
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const cancelOrderFromJNT = async (orderID) => {
    try {
      await axiosAuth.delete(`/jnt/orders/${orderID}`);
      deleteNotify('تم حذف الطلب بنجاح!');
      const newJntOrders = orders.filter(item => item._id !== orderID)
      setOrders(newJntOrders);
      setOrderPopup({ display: false, editing: false, info: {} })
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div className="custom-bg-white">
        {/* Search Features */}
        <A_SearchFeature inConfirmed={true} orders={orders} setOrders={setOrders} fetchOrders={fetchOrders} setCurrentPage={setCurrentPage} setTotalPages={setTotalPages} setFilter={setFilter} />
      </div>

      {/* Table With Search */}
      <A_OrdersTable inConfirmed={true} orders={orders} setOrders={setOrders} handleDelete={cancelOrderFromJNT} totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} fetchOrders={fetchOrders} setTotalPages={setTotalPages} filter={filter} setFilter={setFilter} />

      {/* Toaster notify*/}
      <Toaster toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default Orders;
