import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { axiosAuth } from "../../../api/axios";
import { Search } from "lucide-react";
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
  const { deleteNotify, errorNotify } = useApp();

  const date = new Date();
  const monthEarlier = date.setMonth(date.getMonth() - 1)
  // Date Range Picker
  const [dateRange, setDateRange] = useState([monthEarlier, new Date()]);
  const [startDate, endDate] = dateRange;

  const handleQuery = async () => {
    try {
      const res = await axiosAuth.post('/orders/search', {
        confirmed: inConfirmed ? '1' : '0',
        receiverphone: receiverPhone,
        billCode: trackingNumber,
        txlogisticId: orderNumber,
        startDate: dateRange[0],
        endDate: dateRange[1]
      });
      const activeData = res.data.filter(item => item.deleted !== '1').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(activeData);
      if (activeData.length === 0) {
        deleteNotify('لم يتم العثور علي اي بيانات!')
      }
    } catch (error) {
      console.error(error);
      errorNotify('حدث خطأ, الرجاء المحاول مرة أخري!');
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
        <h1 className="text-2xl font-bold text-center text-gray-800">ابحث عن أوردر</h1>
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
            autoComplete="new-password"
          />
        </div>

        <div>
          <input
            type="text"
            value={receiverPhone}
            onChange={(e) => setReceiverPhone(e.target.value)}
            className="custom-input-field w-full"
            placeholder="ادخل رقم موبيل العميل"
            autoComplete="new-password"
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
              autoComplete="new-password"
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          type="button"
          name="search-query-btn"
          onClick={handleQuery}
          className="min-w-30 bg-indigo-500 text-slate-100 py-2 px-4 rounded-lg duration-500 shadow-sm hover:bg-indigo-600"
        >
          بحث
        </button>
        <button
          type="button"
          name="clear-query-btn"
          onClick={handleClear}
          className="min-w-30 bg-gray-600 text-slate-100 py-2 px-4 rounded-lg duration-500 shadow-sm hover:bg-gray-700"
        >
          مسح
        </button>
      </div>

    </div>
  );
};

export default SearchFeature;