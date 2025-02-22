import { useState } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Trash, Pencil } from "lucide-react";
import { FaCheck } from "react-icons/fa";
import { IoMdArrowDropup } from "react-icons/io";
import { IoStorefrontOutline } from "react-icons/io5";
import { A_OrderEdit, A_OrderInfo } from "./";
import { useOrders } from "../../../context/OrdersContext";
import { Toaster } from 'react-hot-toast';

const OrdersTable = ({ orders, handleDelete }) => {
    const { orderPopup, setOrderPopup } = useOrders();
    const [live, setLive] = useState(null);
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

    return (
        <div>
            {/* Table */}
            <div className="custom-bg-white mt-8">
                <div className="overflow-x-auto">
                    {orders.length > 0 ? (
                        <table className="w-full bg-white">
                            <thead className="text-gray-700 border-b border-gray-300 font-bold text-center whitespace-nowrap">
                                <tr>
                                    <th></th>
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
                                            {order.txlogisticId}
                                        </td>
                                        <td className="p-2 text-gray-600">
                                            {order.receiver.name}
                                        </td>
                                        <td className="p-2 text-gray-600">{order.receiver.mobile}</td>
                                        <td className="p-2 text-gray-600 min-w-35">{order.items.map(product => {
                                            return (
                                                <p key={product._id}>{product.englishName}</p>
                                            )
                                        })}</td>
                                        <td className="p-2 text-gray-600">{order.receiver.prov}</td>
                                        <td className="p-2 text-gray-600">{order.receiver.city}</td>
                                        <td className="p-2 text-gray-600">{order.receiver.area}</td>
                                        <td className="p-2 text-gray-600">{order.receiver.street.slice(0, 20)}</td>
                                        <td className="p-2 font-semibold">{order.itemsValue}</td>
                                        <td className="p-2 text-gray-600">{order.sender.name}</td>
                                        <td className="p-2 text-gray-600">{order.sender.prov}</td>
                                        <td className="p-2 text-gray-600">{order.sender.city}</td>
                                        <td className="p-2 text-gray-600">{order.sender.area}</td>
                                        <td className="p-2 text-gray-600">{order.sender.street.slice(0, 20)}</td>
                                        <td className="p-2">
                                            <MoreVertical className={`cursor-pointer mx-auto ${live === order._id ? 'text-indigo-500' : 'text-gray-500'}`} onMouseEnter={() => setLive(order._id)} onMouseLeave={() => setLive(null)} />
                                            <div className="relative">
                                                <div className={`bg-gray-100 rounded-lg shadow-md absolute top-3 left-[50%] translate-x-[-50%] z-50 ${live === order._id ? '' : 'hidden'}`} onMouseEnter={() => setLive(order._id)} onMouseLeave={() => setLive(null)}>
                                                    <IoMdArrowDropup className='text-gray-100 text-[30px] absolute top-[-18px] left-[50%] translate-x-[-50%]' />
                                                    <div className='px-5 py-3 flex justify-between items-center gap-4 cursor-pointer duration-300 hover:text-indigo-500' onClick={() => setOrderPopup({ display: false, editing: true, info: order })}>
                                                        <span>تعديل</span>
                                                        <Pencil className="w-5 h-5" />
                                                    </div>
                                                    <hr className='text-gray-300' />
                                                    <div className='px-5 py-3 flex justify-between items-center gap-4 cursor-pointer duration-300 hover:text-red-500 rounded-b-lg' onClick={() => handleDelete(order._id)}>
                                                        <span>حذف</span>
                                                        <Trash className="w-5 h-5" />
                                                    </div>
                                                </div>
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
                            <p className="text-2xl font-medium">لا يوجد منتجات في الوقت الحالي</p>
                            <Link to='/admin/orders' className="max-w-max bg-indigo-500 text-white py-2 px-6 rounded-lg shadow-sm duration-500 hover:bg-indigo-600">الطلبات المسجلة</Link>
                        </div>
                    )}
                </div>


                {orderPopup.display && <A_OrderInfo info={orderPopup.info} />}
                {orderPopup.editing && <A_OrderEdit />}
            </div>
            {/* Success notify*/}
            <Toaster />
        </div>
    )
}

export default OrdersTable