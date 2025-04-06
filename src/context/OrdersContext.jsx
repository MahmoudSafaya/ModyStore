import { createContext, useContext, useState } from "react";
import { axiosAuth } from "../api/axios";
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
            const response = await axiosAuth.get(`/visitors/orders/?page=${page}`);
            const data = response.data;
            const resData = data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setUnconfirmedOrders(resData);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const getJNTOrders = async () => {
        try {
            const response = await axiosAuth.get('/jnt/orders/');
            const resData = response.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setJNTOrders(resData);
        } catch (error) {
            console.error(error);
        }
    }

    const confirmOrderToJNT = async (orderID) => {
        try {
            await axiosAuth.post(`/jnt/orders/${orderID}`);
            setOrderPopup({ display: false, editing: false, info: {} })
            getUnconfirmedOrders();
            toast.success('تم تسجيل الاوردر بنجاح علي J&T.', {
                style: {
                    textAlign: 'center'
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    const printOrderPdf = async (orderID) => {
        try {
            const response = await axiosAuth.post(
                `/jnt/orders/print/${orderID}`,
                {
                    printcod: 1,
                    printSize: 3,
                    showCustomerOrderId: 1
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