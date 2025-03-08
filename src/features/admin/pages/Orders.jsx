import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { Toaster } from 'react-hot-toast';
import OrdersTable from "../components/OrdersTable";
import { useApp } from "../../../context/AppContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { deleteNotify } = useApp();

  const fetchOrders = async (page) => {
    try {
      const response = await axios.get(`/jnt/orders/?page=${page}`);
      const data = response.data;
      setOrders(data.orders);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const cancelOrderFromJNT = async (orderID) => {
    try {
      await axios.delete(`/jnt/orders/${orderID}`);
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
      {/* Table With Search */}
      <OrdersTable inConfirmed={true} orders={orders} setOrders={setOrders} handleDelete={cancelOrderFromJNT} totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} fetchOrders={fetchOrders} />

      {/* Toaster notify*/}
      <Toaster />
    </div>
  );
};

export default Orders;
