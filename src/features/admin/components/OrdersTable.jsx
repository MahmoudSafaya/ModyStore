import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash, ChevronRight, ChevronLeft } from "lucide-react";
import { FaCheck, FaRegEdit, FaCheckSquare } from "react-icons/fa";
import { IoStorefrontOutline } from "react-icons/io5";
import { A_OrderEdit, A_OrderInfo } from "./";
import { useOrders } from "../../../context/OrdersContext";
import { Toaster } from 'react-hot-toast';
import { A_DeleteConfirmModal } from "./";
import { useApp } from "../../../context/AppContext";
import { axiosAuth } from "../../../api/axios";
import { format } from "date-fns";
import BeatLoader from "react-spinners/BeatLoader";

const OrdersTable = ({ inConfirmed, orders, handleDelete, currentPage, setCurrentPage, totalPages, fetchOrders, setOrders, setTotalPages }) => {
    const { orderPopup, setOrderPopup } = useOrders();
    const [checkedAll, setCheckedAll] = useState(false);
    const [checkedOrders, setCheckedOrders] = useState([]);
    const { isDelete, setIsDelete, successNotify, deleteNotify, errorNotify } = useApp();
    const [isSigning, setIsSigning] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [isDeletingAll, setIsDeletingAll] = useState(false);
    const [filter, setFilter] = useState('all');

    const handleFilterChange = (e) => {
        setFilter(e.target.name);
    };

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

    useEffect(() => {
        if (checkedOrders.length > 0 && checkedOrders.length === orders.length) {
            setCheckedAll(true);
        } else {
            setCheckedAll(false);
        }
    }, [checkedOrders]);

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
        setCheckedAll(false);
    };

    const signAllSelected = async () => {
        setIsSigning(true);
        try {
            // Iterate over each product in the array
            for (const item of checkedOrders) {
                // Send a DELETE request for each product using its _id
                await axiosAuth.post(`/jnt/orders/${item._id}`);
            }
            successNotify('تم تسجيل جميع الاوردرارت المحددة بنجاح.');
            setCheckedOrders([]);
            fetchOrders();
        } catch (error) {
            console.error('Error deleting products:', error);
        } finally {
            setIsSigning(false)
        }
    };

    const printAllSelected = async () => {
        setIsPrinting(true);
        try {
            const orderIds = checkedOrders?.map(item => item._id);
            const res = await axiosAuth.post('/jnt/orders/print/all', {
                printCod: 1,
                printSize: 3,
                showCustomerOrderId: 1,
                ids: orderIds,
            },
                {
                    responseType: 'blob', // Important for handling binary data like PDFs
                }
            );
            // Create a Blob from the PDF Stream
            const file = new Blob([res.data], { type: 'application/pdf' });

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
            successNotify('تم طباعة الاوردرارت المحددة بنجاح.');
            fetchOrders();
        } catch (error) {
            console.error('Error deleting products:', error);
            if (error.status == 404) {
                errorNotify('عفوا, لم يتم العثور علي اي طلبات!')
            }
        } finally {
            setIsPrinting(false);
        }
    };

    const deleteAllSelected = async () => {
        if (inConfirmed) {
            setIsDeletingAll(true);
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
                errorNotify('حدثت مشكلة أثناء الحذف, الرجاء المحاولة مرة اخري.');
            } finally {
                setIsDeletingAll(false);
            }
        } else {
            setIsDeletingAll(true);
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
                errorNotify('حدثت مشكلة أثناء الحذف, الرجاء المحاولة مرة اخري.');
            } finally {
                setIsDeletingAll(false);
            }
        }
        setCheckedOrders([]);
    };

    const handleQuery = async (printVal) => {
        try {
            const requestBody = {
                confirmed: inConfirmed ? '1' : '0',
            };
            if (printVal !== undefined) {
                requestBody.printed = printVal;
            }

            const res = await axiosAuth.post('/orders/search', requestBody);
            const activeData = res.data
                .filter(item => item.deleted !== '1')
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setOrders(activeData);
            if (activeData.length === 0) {
                deleteNotify('لم يتم العثور علي اي بيانات!');
            }
            setCurrentPage(1);
            setTotalPages(1);
        } catch (error) {
            console.error(error);
            errorNotify('حدث خطأ, الرجاء المحاولة مرة أخري!');
        }
    };

    useEffect(() => {
        if (filter === 'all') {
            handleQuery(); // Get all orders
        } else if (filter === 'printed') {
            handleQuery('1'); // Get printed orders
        } else if (filter === 'unprinted') {
            handleQuery('0'); // Get unprinted orders
        }
    }, [filter]);

    return (
        <div>
            {(isSigning || isPrinting || isDeletingAll) && (
                <div className="w-full h-full fixed top-0 left-0 z-120 bg-[#FFFFFF70] flex justify-center items-center">
                    <BeatLoader
                        color={'oklch(0.585 0.233 277.117)'}
                        size={25}
                    />
                </div>
            )}
            {/* Table */}
            <div className="custom-bg-white mt-8">
                <div className="flex items-center justify-end gap-4 mb-8">
                    {!inConfirmed && (
                        <button
                            type="button"
                            name="all-sign-btn"
                            onClick={signAllSelected}
                            className={`min-w-30 md:min-w-40 lg:whitespace-nowrap py-2 px-4 rounded-lg duration-500 shadow-sm bg-indigo-100 text-indigo-500 hover:bg-indigo-200 duration-500 disabled:opacity-25`}
                            disabled={!checkedOrders.length > 0 || isSigning || isDeletingAll}
                        >
                            {isSigning ? 'جار التسجيل...' : 'تسجيل الاختيارات'}
                        </button>
                    )}
                    {inConfirmed && (
                        <button
                            type="button"
                            name="jt-all-print-btn"
                            onClick={printAllSelected}
                            className={`min-w-30 md:min-w-40 lg:whitespace-nowrap py-2 px-4 rounded-lg duration-500 shadow-sm bg-green-100 text-green-500 hover:bg-green-200 duration-500 disabled:opacity-25`}
                            disabled={!checkedOrders.length > 0}
                        >
                            طباعة الاختيارات
                        </button>
                    )}
                    <button
                        type="button"
                        name="all-delete-btn"
                        className={`min-w-30 md:min-w-40 lg:whitespace-nowrap py-2 px-4 rounded-lg duration-500 shadow-sm bg-red-100 text-red-500 hover:bg-red-200 duration-500 disabled:opacity-25`}
                        onClick={() => setIsDelete({ purpose: 'delete-selected', itemName: 'جميع الاختيارات' })}
                        disabled={!checkedOrders.length > 0 || isDeletingAll || isSigning}
                    >
                        {isDeletingAll ? 'جار الحذف...' : 'حذف الاختيارات'}
                    </button>
                </div>

                <div className="overflow-x-auto overflow-y-hidden scrollbar">
                    {orders?.length > 0 ? (
                        <div>
                            {inConfirmed && (
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        name="all"
                                        onClick={handleFilterChange}
                                        className={`max-w-max py-2 px-6 whitespace-nowrap rounded-lg border-none outline-none duration-500 ${filter === 'all' ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                            }`}
                                    >
                                        الكل
                                    </button>
                                    <button
                                        type="button"
                                        name="printed"
                                        onClick={handleFilterChange}
                                        className={`max-w-max py-2 px-6 whitespace-nowrap rounded-lg border-none outline-none duration-500 ${filter === 'printed' ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                            }`}
                                    >
                                        طبع سابقآ
                                    </button>
                                    <button
                                        type="button"
                                        name="unprinted"
                                        onClick={handleFilterChange}
                                        className={`max-w-max py-2 px-6 whitespace-nowrap rounded-lg border-none outline-none duration-500 ${filter === 'unprinted' ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                            }`}
                                    >
                                        غير مطبوع
                                    </button>
                                </div>
                            )}
                            <table className="w-full bg-white mt-4">
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
                                        <th className="p-3">تاريخ الطلب</th>
                                        {inConfirmed && (
                                            <th className="p-3">مطبوع</th>
                                        )}
                                        <th className="p-3">اسم العميل</th>
                                        <th className="p-3">رقم الهاتف</th>
                                        <th className="p-3">المنتجات المطلوبة</th>
                                        <th className="p-3">محافظة العميل</th>
                                        <th className="p-3">مدينة العميل</th>
                                        <th className="p-3">منطقة العميل</th>
                                        <th className="p-3">شارع العميل</th>
                                        <th className="p-3">سعر الطلب</th>
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
                                            <td className="p-3 text-sm">
                                                {format(new Date(order.createdAt), 'PPpp')}
                                            </td>
                                            {inConfirmed && (
                                                <td className='p-3 text-center'>
                                                    {order.printed !== '0' ? (
                                                        <FaCheckSquare className='w-5 h-5 text-green-400 mx-auto' />
                                                    ) : (
                                                        <FaCheckSquare className='w-5 h-5 text-gray-300 mx-auto' />
                                                    )}
                                                </td>
                                            )}
                                            <td className="p-3">
                                                {order.receiver.name}
                                            </td>
                                            <td className="p-3">{order.receiver.mobile}</td>
                                            <td className="p-3 min-w-35">
                                                <div className="flex flex-col items-center justify-center gap-1">
                                                    {order.items && order.items.map(orderItem => {
                                                        return (
                                                            <p key={orderItem._id} className="text-sm">{orderItem.itemName}</p>
                                                        )
                                                    })}
                                                </div>
                                            </td>
                                            <td className="p-3">{order.receiver.prov}</td>
                                            <td className="p-3">{order.receiver.city}</td>
                                            <td className="p-3">{order.receiver.area}</td>
                                            <td className="p-3">{order.receiver.street.slice(0, 20)}</td>
                                            <td className="p-3 font-semibold text-gray-800">{order.itemsValue}</td>
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
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6">
                            <div>
                                <IoStorefrontOutline className="w-20 h-20 opacity-25" />
                            </div>
                            <p className="text-2xl font-medium text-center">لا يوجد طلبات في الوقت الحالي</p>
                            {!inConfirmed && (
                                <Link to='/admin/orders' className="max-w-max bg-indigo-500 text-white py-2 px-6 rounded-lg shadow-sm duration-500 hover:bg-indigo-600" aria-label="Signed Orders">الطلبات المسجلة</Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {orders.length > 0 && (
                    <div className="flex justify-center overflow-auto scrollbar mt-4 pb-2">
                        <button
                            type="button"
                            name="prev-btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 mx-1 bg-gray-200 rounded disabled:opacity-25"
                        >
                            <ChevronRight />
                        </button>

                        {/* First Page */}
                        {currentPage > 2 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => handlePageChange(1)}
                                    className={`px-3 py-2 mx-1 rounded ${currentPage === 1 ? "bg-indigo-500 text-white" : "bg-gray-200"}`}
                                >
                                    1
                                </button>
                                {currentPage > 3 && <span className="p-2 mx-1 text-xl">...</span>}
                            </>
                        )}

                        {/* Previous Page */}
                        {currentPage > 1 && (
                            <button
                                type="button"
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="px-3 py-2 mx-1 rounded bg-gray-200"
                            >
                                {currentPage - 1}
                            </button>
                        )}

                        {/* Current Page */}
                        <button
                            type="button"
                            className="px-3 py-2 mx-1 rounded bg-indigo-500 text-white"
                        >
                            {currentPage}
                        </button>

                        {/* Next Page */}
                        {currentPage < totalPages && (
                            <button
                                type="button"
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="px-3 py-2 mx-1 rounded bg-gray-200"
                            >
                                {currentPage + 1}
                            </button>
                        )}

                        {/* Last Page */}
                        {currentPage < totalPages - 1 && (
                            <>
                                {currentPage < totalPages - 2 && <span className="p-2 mx-1 text-xl">...</span>}
                                <button
                                    type="button"
                                    onClick={() => handlePageChange(totalPages)}
                                    className={`px-3 py-2 mx-1 rounded ${currentPage === totalPages ? "bg-indigo-500 text-white" : "bg-gray-200"}`}
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}

                        <button
                            type="button"
                            name="next-btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 mx-1 bg-gray-200 rounded disabled:opacity-25"
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