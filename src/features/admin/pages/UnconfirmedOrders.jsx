import React, { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useOrders } from "../../../context/OrdersContext";
import OrdersTable from "../components/OrdersTable";
import { useAuth } from "../../../context/AuthContext";
import Loading from "../../../shared/components/Loading";
import axios from "../../../api/axios";

const UnconfirmedOrders = () => {
    const { loading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const {setOrderPopup} = useOrders();

    const fetchOrders = async (page) => {
        try {
            const response = await axios.get(`/visitors/orders/?page=${page}`);
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

    const handleDeleteOrder = async (orderID) => {
        try {
            await axios.delete(`/visitors/orders/${orderID}`);
            toast.success('تم حذف الطلب بنجاح!');
            const newOrders = orders.filter(item => item._id !== orderID)
            setOrders(newOrders);
            setOrderPopup({ display: false, editing: false, info: {} })
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) return <Loading loading={loading} />;

    return (
        <div>
            {/* Table With Search */}
            <OrdersTable orders={orders} setOrders={setOrders} handleDelete={handleDeleteOrder} totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} fetchOrders={fetchOrders} />

            {/* Toaster notify*/}
            <Toaster />
        </div>

    );
};

export default UnconfirmedOrders;
