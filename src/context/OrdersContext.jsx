import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import toast from 'react-hot-toast';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
    const [unconfirmedOrders, setUnconfirmedOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [jntOrders, setJNTOrders] = useState([]);
    const [orderPopup, setOrderPopup] = useState({
        display: false,
        editing: false,
        info: {},
    });

    const handleOrderPopup = (data) => {
        setOrderPopup({ ...orderPopup, ...data });
    };

    const getUnconfirmedOrders = async (page) => {
        try {
            const response = await axios.get(`/visitors/orders/?page=${page}`);
            const data = response.data;
            setUnconfirmedOrders(data.orders);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const getJNTOrders = async () => {
        try {
            const response = await axios.get('/jnt/orders/');
            setJNTOrders(response.data.orders);
            console.log(response)
        } catch (error) {
            console.error(error);
        }
    }

    const confirmOrderToJNT = async (orderID) => {
        try {
            const response = await axios.post(`/jnt/orders/${orderID}`);
            console.log(response);
            setOrderPopup({ display: false, editing: false, info: {} })
        } catch (error) {
            console.error(error);
        }
    }

    const printOrderPdf = async (orderID) => {
        try {
            const response = await axios.post(
                `/jnt/orders/print/${orderID}`,
                {
                    printcod: 0,
                    printSize: 0,
                    showCustomerOrderId: 0
                },
                {
                    responseType: 'blob', // Important for handling binary data like PDFs
                }
            );

            // Create a Blob from the PDF Stream
            const file = new Blob([response.data], { type: 'application/pdf' });

            // Create a link element
            const fileURL = URL.createObjectURL(file);

            // Create a temporary anchor element to trigger the download
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', 'waybill.pdf'); // Name of the file to be downloaded
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(fileURL);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <OrdersContext.Provider value={{
            getUnconfirmedOrders, unconfirmedOrders, setUnconfirmedOrders, currentPage, setCurrentPage, totalPages, setTotalPages, orderPopup, setOrderPopup,
            handleOrderPopup, jntOrders, setJNTOrders, getJNTOrders,
            confirmOrderToJNT, printOrderPdf
        }}>
            {children}
        </OrdersContext.Provider>
    )
}

export default OrdersContext;

export const useOrders = () => useContext(OrdersContext);