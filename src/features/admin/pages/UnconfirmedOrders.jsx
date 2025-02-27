import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { House } from "lucide-react";
import { Toaster } from 'react-hot-toast';
import { useOrders } from "../../../context/OrdersContext";
import OrdersTable from "../components/OrdersTable";

const UnconfirmedOrders = () => {
    const { handleDeleteOrder } = useOrders();

    return (
        <div>
            {/* Component Header */}
            <div className='custom-bg-white flex items-center justify-between'>
                <h2 className='text-lg'>طلبات الموقع - <span className="text-sm text-gray-500">تحتاج إلى تأكيد</span></h2>
                <Link to='/admin/products' className='text-2xl bg-white rounded-xl transition-all duration-300 hover:bg-indigo-600 hover:text-white p-2'>
                    <House />
                </Link>
            </div>

            <OrdersTable apiUrl='/visitors/orders/' handleDelete={handleDeleteOrder} />


            {/* Success notify*/}
            <Toaster />
        </div>

    );
};

export default UnconfirmedOrders;
