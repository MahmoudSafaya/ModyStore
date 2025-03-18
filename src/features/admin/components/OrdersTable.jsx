import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash, ChevronRight, ChevronLeft } from "lucide-react";
import { FaCheck, FaRegEdit } from "react-icons/fa";
import { IoStorefrontOutline } from "react-icons/io5";
import { A_OrderEdit, A_OrderInfo } from "./";
import { useOrders } from "../../../context/OrdersContext";
import { Toaster } from 'react-hot-toast';
import { A_DeleteConfirmModal } from "./";
import { useApp } from "../../../context/AppContext";
import { axiosAuth } from "../../../api/axios";

const OrdersTable = ({ inConfirmed, orders, setOrders, handleDelete, currentPage, setCurrentPage, totalPages, fetchOrders }) => {
    const { orderPopup, setOrderPopup } = useOrders();
    const [checkedAll, setCheckedAll] = useState(false);
    const [checkedOrders, setCheckedOrders] = useState([]);
    const { isDelete, setIsDelete, successNotify, deleteNotify } = useApp();

    const handleCheckOrder = (orderID) => {
        if (checkedOrders.some(item => item._id === orderID)) {
            const newOrders = checkedOrders.filter(item => item._id !== orderID);
            setCheckedOrders([...newOrders]);
        } else {
            const newOrders = orders.filter(item => item._id === orderID);
            setCheckedOrders([...checkedOrders, ...newOrders]);
        }
    }
    const handleSelectAll = () => {
        setCheckedAll(!checkedAll);
        if (!checkedAll) {
            setCheckedOrders(orders);
        } else {
            setCheckedOrders([]);
        }
    }

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const signAllSelected = async () => {
        try {
            // Iterate over each product in the array
            for (const item of checkedOrders) {
                // Send a DELETE request for each product using its _id
                await axiosAuth.post(`/jnt/orders/${item._id}`);
            }
            successNotify('تم تسجيل جميع الاوردرارت المحددة بنجاح.');
            fetchOrders();
        } catch (error) {
            console.error('Error deleting products:', error);
        }
    };


    const deleteAllSelected = async () => {
        if (inConfirmed) {
            try {
                // Iterate over each product in the array
                for (const item of checkedOrders) {
                    // Send a DELETE request for each product using its _id
                    await axiosAuth.delete(`/jnt/orders/${item._id}`);
                }
                deleteNotify("تم حذف الطلبات المحددة بنجاح.");
                fetchOrders();
            } catch (error) {
                console.error('Error deleting products:', error);
            }
        } else {
            try {
                // Iterate over each product in the array
                for (const item of checkedOrders) {
                    // Send a DELETE request for each product using its _id
                    await axiosAuth.delete(`/visitors/orders/${item._id}`);
                }
                deleteNotify("تم حذف الطلبات المحددة بنجاح.");
                fetchOrders();
            } catch (error) {
                console.error('Error deleting products:', error);
            }
        }
        setCheckedOrders([]);
    };

    return (
        <div>
            {/* Table */}
            <div className="custom-bg-white mt-8">
                <div className="flex items-center justify-end gap-4 mb-8">
                    {!inConfirmed && (
                        <button
                            type="button"
                            onClick={signAllSelected}
                            className={`min-w-30 py-2 px-4 rounded-lg duration-500 shadow-sm bg-indigo-100 text-indigo-500 hover:bg-indigo-200 duration-500 ${!checkedOrders.length > 0 ? 'opacity-25' : ''}`}
                            disabled={!checkedOrders.length > 0}
                        >
                            تسجيل الكل
                        </button>
                    )}
                    <button
                        type="button"
                        className={`min-w-30 py-2 px-4 rounded-lg duration-500 shadow-sm bg-red-100 text-red-500 hover:bg-red-200 duration-500 ${!checkedOrders.length > 0 ? 'opacity-25' : ''}`}
                        onClick={() => setIsDelete({ purpose: 'delete-selected', itemName: 'جميع الاختيارات' })} disabled={!checkedOrders.length > 0}
                    >
                        حذف الاختيارات
                    </button>
                </div>

                <div className="overflow-x-auto overflow-y-hidden scrollbar">
                    {orders?.length > 0 ? (
                        <table className="w-full bg-white">
                            <thead className="text-gray-700 border-b border-gray-300 font-bold text-center whitespace-nowrap">
                                <tr>
                                    <th>
                                        <label className="flex items-center justify-center h-5">
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={checkedAll}
                                                onChange={handleSelectAll}
                                            />
                                            <div
                                                className={`w-5 h-5 p-1 flex items-center justify-center rounded-sm border duration-500 cursor-pointer ${checkedAll ? "bg-indigo-500 border-indigo-500" : "border-gray-300"
                                                    }`}
                                            >
                                                {checkedAll && (
                                                    <FaCheck className='text-white' />
                                                )}
                                            </div>
                                        </label>
                                    </th>
                                    <th className="p-3">رقم الطلب</th>
                                    <th className="p-3">اسم العميل</th>
                                    <th className="p-3">رقم الهاتف</th>
                                    <th className="p-3">المنتجات</th>
                                    <th className="p-3">محافظة العميل</th>
                                    <th className="p-3">مدينة العميل</th>
                                    <th className="p-3">منطقة العميل</th>
                                    <th className="p-3">شارع العميل</th>
                                    <th className="p-3">سعر الطلب</th>
                                    <th className="p-3">اسم الراسل</th>
                                    <th className="p-3">محافظة الراسل</th>
                                    <th className="p-3">مدينة الراسل</th>
                                    <th className="p-3">منطقة الراسل</th>
                                    <th className="p-3">شارع الراسل</th>
                                    <th className="p-3">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders && orders.map((order) => (
                                    <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50 text-center  whitespace-nowrap text-gray-600">
                                        <td className='p-3'>
                                            <label className="flex items-center justify-center h-5">
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={checkedOrders.some(item => item._id === order._id)}
                                                    onChange={() => handleCheckOrder(order._id)}
                                                />
                                                <div
                                                    className={`w-5 h-5 p-1 flex items-center justify-center rounded-sm border duration-500 cursor-pointer ${checkedOrders.some(item => item._id === order._id) ? "bg-indigo-500 border-indigo-500" : "border-gray-300"
                                                        }`}
                                                >
                                                    {checkedOrders.some(item => item._id === order._id) && (
                                                        <FaCheck className='text-white' />
                                                    )}
                                                </div>
                                            </label>
                                        </td>
                                        <td className="p-3 cursor-pointer duration-300 hover:text-indigo-400 hover:underline" onClick={() => setOrderPopup({ display: true, editing: false, info: order })}>
                                            {inConfirmed ? order.billCode : order.txlogisticId}
                                        </td>
                                        <td className="p-3">
                                            {order.receiver.name}
                                        </td>
                                        <td className="p-3">{order.receiver.mobile}</td>
                                        <td className="p-3 min-w-35">{order.items.length}</td>
                                        <td className="p-3">{order.receiver.prov}</td>
                                        <td className="p-3">{order.receiver.city}</td>
                                        <td className="p-3">{order.receiver.area}</td>
                                        <td className="p-3">{order.receiver.street.slice(0, 20)}</td>
                                        <td className="p-3 font-semibold">{order.itemsValue}</td>
                                        <td className="p-3">{order.sender.name}</td>
                                        <td className="p-3">{order.sender.prov}</td>
                                        <td className="p-3">{order.sender.city}</td>
                                        <td className="p-3">{order.sender.area}</td>
                                        <td className="p-3">{order.sender.street.slice(0, 20)}</td>
                                        <td className="p-3 flex items-center">
                                            {!inConfirmed && (
                                                <div className='px-4 py-2 cursor-pointer duration-500 hover:text-indigo-500 hover:rotate-45' onClick={() => setOrderPopup({ display: false, editing: true, info: order })}>
                                                    <FaRegEdit className="w-5 h-5" />
                                                </div>
                                            )}
                                            <div className='px-4 py-2 cursor-pointer duration-500 hover:text-red-500 hover:rotate-45 rounded-b-lg' onClick={() => setIsDelete({ purpose: 'one-order', itemId: order._id, itemName: inConfirmed ? order.billCode : order.txlogisticId })}>
                                                <Trash className="w-5 h-5" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center gap-6">
                            <div>
                                <IoStorefrontOutline className="w-20 h-20 opacity-25" />
                            </div>
                            <p className="text-2xl font-medium text-center">لا يوجد طلبات في الوقت الحالي</p>
                            {!inConfirmed && (
                                <Link to='/admin/orders' className="max-w-max bg-indigo-500 text-white py-2 px-6 rounded-lg shadow-sm duration-500 hover:bg-indigo-600">الطلبات المسجلة</Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {orders.length > 0 && (
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-25"
                        >
                            <ChevronRight />
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? "bg-indigo-500 text-white" : "bg-gray-200"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-25"
                        >
                            <ChevronLeft />
                        </button>
                    </div>
                )}


                {isDelete.purpose === 'one-order' && (
                    <A_DeleteConfirmModal itemName={isDelete.itemName} deleteFun={() => handleDelete(isDelete.itemId)} setIsDelete={setIsDelete} />
                )}
                {isDelete.purpose === 'delete-selected' && (
                    <A_DeleteConfirmModal itemName={isDelete.itemName} deleteFun={deleteAllSelected} setIsDelete={setIsDelete} />
                )}

                {orderPopup.display && <A_OrderInfo info={orderPopup.info} inConfirmed={inConfirmed} handleDelete={handleDelete} />}
                {orderPopup.editing && <A_OrderEdit />}
            </div>
            {/* Success notify*/}
            <Toaster toastOptions={{ duration: 3000 }} />
        </div>
    )
}

export default OrdersTable