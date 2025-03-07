import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../../api/axios";
import { Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useApp } from "../../../context/AppContext";
import { A_DeleteConfirmModal } from ".";

const CustomDatePicker = ({ startDate, endDate, onChange }) => {
  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      {/* {label && <label className="text-gray-700 text-sm font-medium">{label}</label>} */}
      <DatePicker
        selected={startDate}
        onChange={(dates) => onChange(dates)}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        monthsShown={2}
        dateFormat="yyyy-MM-dd"
        className="custom-input-field w-full"
      />
    </div>
  );
};


const SearchFeature = ({ inConfirmed, setOrders, fetchOrders, checkedOrders, setCheckedOrders }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');

  const {isDelete, setIsDelete} = useApp();

  // Date Range Picker
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;

  const handleQuery = async () => {
    try {
      const res = await axios.post('/orders/search', {
        receiverphone: receiverPhone,
        billCode: trackingNumber,
        txlogisticId: orderNumber,
        startDate: dateRange[0],
        endDate: dateRange[1]
      });
      setOrders(res.data);
      console.log(res)
    } catch (error) {
      console.error(error);
    }
  };

  const handleClear = () => {
    setOrderNumber('');
    setTrackingNumber('');
    setReceiverPhone('');
    setDateRange([new Date(), new Date()]);
    fetchOrders();
  };

  const deleteAllSelected = async () => {
    if (inConfirmed) {
      try {
        // Iterate over each product in the array
        for (const item of checkedOrders) {
          // Send a DELETE request for each product using its _id
          await axios.delete(`/jnt/orders/${item._id}`);
        }
        toast.success("تم حذف الطلبات المحددة بنجاح.", {
          style: {
            padding: '16px',
            color: '#485363',
          },
          iconTheme: {
            primary: '#485363',
            secondary: '#FFFFFF',
          },
        })
        fetchOrders();
      } catch (error) {
        console.error('Error deleting products:', error);
      }
    } else {
      try {
        // Iterate over each product in the array
        for (const item of checkedOrders) {
          // Send a DELETE request for each product using its _id
          await axios.delete(`/visitors/orders/${item._id}`);
        }
        toast.success("تم حذف الطلبات المحددة بنجاح.", {
          style: {
            padding: '16px',
            color: '#485363',
          },
          iconTheme: {
            primary: '#485363',
            secondary: '#FFFFFF',
          },
        })
        fetchOrders();
      } catch (error) {
        console.error('Error deleting products:', error);
      }
    }
    setCheckedOrders([]);
  };
  const signAllSelected = async () => {
    try {
      // Iterate over each product in the array
      for (const item of checkedOrders) {
        // Send a DELETE request for each product using its _id
        await axios.post(`/jnt/orders/${item._id}`);
        console.log(`Product with _id ${item._id} signed successfully.`);
      }
      console.log('All products signed successfully.');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting products:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-8">
        <h1 className="text-2xl font-bold text-center">ابحث عن أوردر</h1>
        <Search />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="z-100">
          <CustomDatePicker
            startDate={startDate}
            endDate={endDate}
            onChange={setDateRange}
          />
        </div>

        <div>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="custom-input-field w-full"
            placeholder="ادخل رقم الأوردر"
          />
        </div>

        {inConfirmed && (
          <div>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="custom-input-field w-full"
              placeholder="ادخل رقم البوليصة"
            />
          </div>
        )}

        <div>
          <input
            type="text"
            value={receiverPhone}
            onChange={(e) => setReceiverPhone(e.target.value)}
            className="custom-input-field w-full"
            placeholder="ادخل رقم موبيل العميل"
          />
        </div>

        <button
          type="button"
          onClick={handleQuery}
          className="w-full bg-indigo-500 text-slate-100 py-2 px-4 rounded-lg duration-500 hover:bg-indigo-600"
        >
          بحث
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-full bg-gray-600 text-slate-100 py-2 px-4 rounded-lg duration-500 hover:bg-gray-700"
        >
          مسح
        </button>
        {!inConfirmed && (
          <button
            type="button"
            onClick={signAllSelected}
            className={`py-2 px-4 rounded-lg duration-500 shadow-md bg-indigo-100 text-indigo-500 hover:bg-indigo-200 duration-500 ${!checkedOrders.length > 0 ? 'opacity-25' : ''}`}
            disabled={!checkedOrders.length > 0}
          >
            تسجيل الكل
          </button>
        )}
        <button
          type="button"
          className={`py-2 px-4 rounded-lg duration-500 shadow-md bg-red-100 text-red-500 hover:bg-red-200 duration-500 ${!checkedOrders.length > 0 ? 'opacity-25' : ''}`}
          onClick={() => setIsDelete({purpose: 'delete-selected', itemName: 'جميع الاختيارات'})} disabled={!checkedOrders.length > 0}
        >
          حذف الكل
        </button>
      </div>

      <Toaster />

      
      {isDelete.purpose === 'delete-selected' && (
        <A_DeleteConfirmModal itemName={isDelete.itemName} deleteFun={deleteAllSelected} setIsDelete={setIsDelete} />
      )}
    </div>
  );
};

export default SearchFeature;