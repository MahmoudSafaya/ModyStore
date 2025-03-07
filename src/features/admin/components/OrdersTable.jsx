import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash, ChevronRight, ChevronLeft } from "lucide-react";
import { FaCheck, FaRegEdit } from "react-icons/fa";
import { IoStorefrontOutline } from "react-icons/io5";
import { A_OrderEdit, A_OrderInfo } from "./";
import { useOrders } from "../../../context/OrdersContext";
import { Toaster } from 'react-hot-toast';
import { A_SearchFeature } from "./";

const OrdersTable = ({ inConfirmed, orders, setOrders, handleDelete, currentPage, setCurrentPage, totalPages, fetchOrders }) => {
    const { orderPopup, setOrderPopup } = useOrders();
    const [checkedAll, setCheckedAll] = useState(false);
    const [checkedOrders, setCheckedOrders] = useState([]);

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

    return (
        <div>
            <div className="custom-bg-white">
                {/* Search Features */}
                <A_SearchFeature inConfirmed={inConfirmed} orders={orders} setOrders={setOrders} fetchOrders={fetchOrders} checkedOrders={checkedOrders} />
            </div>

            {/* Table */}
            <div className="custom-bg-white mt-8">
                <div className="overflow-x-auto">
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
                                    <th className="p-2">رقم الطلب</th>
                                    <th className="p-2">اسم العميل</th>
                                    <th className="p-2">رقم الهاتف</th>
                                    <th className="p-2">المنتجات</th>
                                    <th className="p-2">محافظة العميل</th>
                                    <th className="p-2">مدينة العميل</th>
                                    <th className="p-2">منطقة العميل</th>
                                    <th className="p-2">شارع العميل</th>
                                    <th className="p-2">سعر الطلب</th>
                                    <th className="p-2">اسم الراسل</th>
                                    <th className="p-2">محافظة الراسل</th>
                                    <th className="p-2">مدينة الراسل</th>
                                    <th className="p-2">منطقة الراسل</th>
                                    <th className="p-2">شارع الراسل</th>
                                    <th className="p-2">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders && orders.map((order) => (
                                    <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50 text-center  whitespace-nowrap">
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
                                        <td className="p-2 text-indigo-400 cursor-pointer duration-500 hover:text-indigo-600" onClick={() => setOrderPopup({ display: true, editing: false, info: order })}>
                                            {inConfirmed ? order.billCode : order.txlogisticId}
                                        </td>
                                        <td className="p-2 text-gray-600">
                                            {order.receiver.name}
                                        </td>
                                        <td className="p-2 text-gray-600">{order.receiver.mobile}</td>
                                        <td className="p-2 text-gray-600 min-w-35">{order.items.length}</td>
                                        <td className="p-2 text-gray-600">{order.receiver.prov}</td>
                                        <td className="p-2 text-gray-600">{order.receiver.city}</td>
                                        <td className="p-2 text-gray-600">{order.receiver.area}</td>
                                        <td className="p-2 text-gray-600">{order.receiver.street.slice(0, 20)}</td>
                                        <td className="p-2 text-gray-600 font-semibold">{order.itemsValue}</td>
                                        <td className="p-2 text-gray-600">{order.sender.name}</td>
                                        <td className="p-2 text-gray-600">{order.sender.prov}</td>
                                        <td className="p-2 text-gray-600">{order.sender.city}</td>
                                        <td className="p-2 text-gray-600">{order.sender.area}</td>
                                        <td className="p-2 text-gray-600">{order.sender.street.slice(0, 20)}</td>
                                        <td className="p-2 flex items-center">
                                            {!inConfirmed && (
                                                <div className='px-4 py-2 cursor-pointer duration-300 hover:text-indigo-500' onClick={() => setOrderPopup({ display: false, editing: true, info: order })}>
                                                    <FaRegEdit className="w-5 h-5" />
                                                </div>
                                            )}
                                            <div className='px-4 py-2 cursor-pointer duration-300 hover:text-red-500 rounded-b-lg' onClick={() => handleDelete(order._id)}>
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
                            <p className="text-2xl font-medium">لا يوجد طلبات في الوقت الحالي</p>
                            {!inConfirmed && (
                                <Link to='/admin/orders' className="max-w-max bg-indigo-500 text-white py-2 px-6 rounded-lg shadow-sm duration-500 hover:bg-indigo-600">الطلبات المسجلة</Link>
                            )}
                        </div>
                    )}
                </div>


                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-25"
                    >
                        <ChevronRight />
                    </button>
                    <span className="px-4 py-2 mx-1">
                        صفحة {currentPage} من {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-25"
                    >
                        <ChevronLeft />
                    </button>
                </div>



                {orderPopup.display && <A_OrderInfo info={orderPopup.info} inConfirmed={inConfirmed} handleDelete={handleDelete} />}
                {orderPopup.editing && <A_OrderEdit />}
            </div>
            {/* Success notify*/}
            <Toaster />
        </div>
    )
}

export default OrdersTable