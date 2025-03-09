import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../../api/axios";
import { Search } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useApp } from "../../../context/AppContext";

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


const SearchFeature = ({ inConfirmed, setOrders, fetchOrders }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');

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


  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-8">
        <h1 className="text-2xl font-bold text-center">ابحث عن أوردر</h1>
        <Search />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="z-60">
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
      </div>
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          type="button"
          onClick={handleQuery}
          className="min-w-30 bg-indigo-500 text-slate-100 py-2 px-4 rounded-lg duration-500 shadow-sm hover:bg-indigo-600"
        >
          بحث
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="min-w-30 bg-gray-600 text-slate-100 py-2 px-4 rounded-lg duration-500 shadow-sm hover:bg-gray-700"
        >
          مسح
        </button>
      </div>

      <Toaster toastOptions={{ duration: 3000 }} />

    </div>
  );
};

export default SearchFeature;