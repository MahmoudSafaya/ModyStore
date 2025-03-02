import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { House } from "lucide-react";
import { Toaster } from 'react-hot-toast';
import { useOrders } from "../../../context/OrdersContext";
import OrdersTable from "../components/OrdersTable";
import {Search} from 'lucide-react'

const UnconfirmedOrders = () => {
    const { handleDeleteOrder } = useOrders();
    const [searchInput, setSearchInput] = useState('');

    return (
        <div>
            {/* Search Feature */}
            <div className="custom-bg-white flex flex-col md:flex-row items-center gap-4">
                <div className='flex items-center gap-2 grow'>
                    <label htmlFor="product-search" className=''>بحث</label>
                    <div className="relative w-full">
                        <input type="text" name="product-search" id="product-search" className="custom-input-field w-full" placeholder="بحث عن منتج..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                        <Search className="w-20 h-[calc(100%-2px)] my-[1px] ml-[1px] text-2xl p-2 rounded-l-lg bg-gray-100 text-gray-400 absolute top-0 left-0 border border-gray-200" />
                    </div>
                </div>
            </div>

            <OrdersTable apiUrl='/visitors/orders/' handleDelete={handleDeleteOrder} />


            {/* Success notify*/}
            <Toaster />
        </div>

    );
};

export default UnconfirmedOrders;
