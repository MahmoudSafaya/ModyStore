import React, { useState } from "react";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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


const SearchFeature = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  // Date Range Picker
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;

  const [searchResults, setSearchResults] = useState([]);


  const handleQuery = () => {
    // Mock search results based on the input fields
    const mockResults = [
      { id: 1, orderNumber: '12345', trackingNumber: 'TRK123', receiverPhone: '123-456-7890', date: '2025-02-06', details: 'Order Shipped' },
      { id: 2, orderNumber: '67890', trackingNumber: 'TRK456', receiverPhone: '987-654-3210', date: '2025-02-07', details: 'Order Delivered' },
    ];

    const results = mockResults.filter(
      (result) =>
        (orderNumber ? result.orderNumber.includes(orderNumber) : true) &&
        (trackingNumber ? result.trackingNumber.includes(trackingNumber) : true) &&
        (receiverPhone ? result.receiverPhone.includes(receiverPhone) : true) &&
        result.date >= startDate &&
        result.date <= endDate
    );

    setSearchResults(results);
  };

  const handleClear = () => {
    setOrderNumber('');
    setTrackingNumber('');
    setReceiverPhone('');
    setDateRange([new Date(), new Date()]);
    setSearchResults([]);
  };

  useEffect(() => {
    console.log(dateRange)
  }, [startDate]);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">ابحث عن أوردر</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
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

        <div>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="custom-input-field w-full"
            placeholder="ادخل رقم البوليصة"
          />
        </div>

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
          onClick={handleQuery}
          className="w-full bg-indigo-500 text-slate-100 py-2 px-4 rounded-md duration-500 hover:bg-indigo-600"
        >
          Query
        </button>
        <button
          onClick={handleClear}
          className="w-full bg-gray-600 text-slate-100 py-2 px-4 rounded-md duration-500 hover:bg-gray-700"
        >
          Clear
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Search Results</h2>
          <ul className="space-y-2">
            {searchResults.map((result) => (
              <li key={result.id} className="p-4 border border-gray-200 rounded-md">
                <p className="text-sm text-gray-600">{result.details}</p>
                <p className="text-sm text-gray-500">Order Number: {result.orderNumber}</p>
                <p className="text-sm text-gray-500">Tracking Number: {result.trackingNumber}</p>
                <p className="text-sm text-gray-500">Receiver Phone: {result.receiverPhone}</p>
                <p className="text-sm text-gray-500">Date: {result.date}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchFeature;