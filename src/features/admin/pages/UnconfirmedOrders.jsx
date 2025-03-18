import React, { useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import { useOrders } from "../../../context/OrdersContext";
import { axiosAuth } from "../../../api/axios";
import { useApp } from "../../../context/AppContext";
import { A_OrdersTable, A_SearchFeature } from "../components";

const UnconfirmedOrders = () => {
    const { setOrderPopup, getUnconfirmedOrders, unconfirmedOrders, setUnconfirmedOrders, currentPage, setCurrentPage, totalPages } = useOrders();
    const { deleteNotify } = useApp();

    useEffect(() => {
        getUnconfirmedOrders(currentPage);
    }, [currentPage]);

    const handleDeleteOrder = async (orderID) => {
        try {
            await axiosAuth.delete(`/visitors/orders/${orderID}`);
            deleteNotify('تم حذف الطلب بنجاح!');
            const newOrders = unconfirmedOrders.filter(item => item._id !== orderID)
            setUnconfirmedOrders(newOrders);
            setOrderPopup({ display: false, editing: false, info: {} })
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            {/* Search Features */}
            <div className="custom-bg-white">
                <A_SearchFeature orders={unconfirmedOrders} setOrders={setUnconfirmedOrders} fetchOrders={getUnconfirmedOrders} />
            </div>

            {/* Orders Table */}
            <A_OrdersTable orders={unconfirmedOrders} setOrders={setUnconfirmedOrders} handleDelete={handleDeleteOrder} totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} fetchOrders={getUnconfirmedOrders} />

            {/* Toaster notify*/}
            <Toaster />
        </div>

    );
};

export default UnconfirmedOrders;
