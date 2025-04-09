import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { axiosAuth } from "../../../api/axios";
import { Search } from "lucide-react";
import { useApp } from "../../../context/AppContext";
import { FaCheck } from "react-icons/fa";

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


const SearchFeature = ({ inConfirmed, setOrders, fetchOrders, setCurrentPage, setTotalPages, setFilter }) => {
  const [itemName, setItemName] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [printVal, setPrintVal] = useState(false);

  const { deleteNotify, errorNotify } = useApp();

  const date = new Date();
  const monthEarlier = date.setMonth(date.getMonth() - 1)
  // Date Range Picker
  const [dateRange, setDateRange] = useState([monthEarlier, new Date()]);
  const [startDate, endDate] = dateRange;

  const handleQuery = async () => {
    try {
      const requestBody = {
        confirmed: inConfirmed ? '1' : '0',
        receiverphone: receiverPhone,
        billCode: trackingNumber,
        txlogisticId: orderNumber,
        itemName: itemName,
        startDate: dateRange[0],
        endDate: dateRange[1],
      };
      if (printVal) {
        requestBody.printed = '1';
      }
      const res = await axiosAuth.post('/orders/search', requestBody);
      const activeData = res.data.filter(item => item.deleted !== '1').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(activeData);
      if (activeData.length === 0) {
        deleteNotify('لم يتم العثور علي اي بيانات!')
      }
      setCurrentPage(1);
      setTotalPages(1);
      if (inConfirmed) {
        setFilter('all');
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
    setDateRange([monthEarlier, new Date()]);
    fetchOrders(1);
    if (inConfirmed) {
      setFilter('');
    }
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
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="custom-input-field w-full"
            placeholder="ادخل اسم المنتج"
            autoComplete="off"
          />
        </div>

        <div>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="custom-input-field w-full"
            placeholder="ادخل رقم الاوردر"
            autoComplete="off"
          />
        </div>

        <div>
          <input
            type="text"
            value={receiverPhone}
            onChange={(e) => setReceiverPhone(e.target.value)}
            className="custom-input-field w-full"
            placeholder="ادخل رقم موبيل العميل"
            autoComplete="off"
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
              autoComplete="off"
            />
          </div>
        )}

        {inConfirmed && (
          <div className='p-3 justify-self-start'>
            <label className="flex items-center justify-center h-5">
              <input
                type="checkbox"
                className="hidden"
                checked={printVal}
                onChange={() => setPrintVal(!printVal)}
              />
              <div
                className={`w-5 h-5 p-1 flex items-center justify-center rounded-sm border duration-500 cursor-pointer ${printVal ? "bg-indigo-500 border-indigo-500" : "border-gray-300"
                  }`}
              >
                {printVal && (
                  <FaCheck className='text-white' />
                )}
              </div>
              <span className="mr-2 text-gray-800">مطبوع</span>
            </label>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          type="button"
          name="search-query-btn"
          onClick={handleQuery}
          className="min-w-30 bg-indigo-500 text-slate-100 py-2 px-4 rounded-lg border-none outline-none duration-500 shadow-sm hover:bg-indigo-600"
        >
          بحث
        </button>
        <button
          type="button"
          name="clear-query-btn"
          onClick={handleClear}
          className="min-w-30 bg-gray-600 text-slate-100 py-2 px-4 rounded-lg border-none outline-none duration-500 shadow-sm hover:bg-gray-700"
        >
          مسح
        </button>
      </div>

    </div>
  );
};

export default SearchFeature;