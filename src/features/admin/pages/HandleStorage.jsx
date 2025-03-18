import React, { useState, useEffect } from "react";
import { axiosAuth } from "../../../api/axios";
import { Toaster } from "react-hot-toast";
import { useApp } from "../../../context/AppContext";
import BarcodeScanner from "../components/BarcodeScanner";

const HandleStorage = () => {
  const [scanType, setScanType] = useState("");
  const [result, setResult] = useState(null);
  const { successNotify, deleteNotify } = useApp();

  const handleScan = async (barcode) => {
    if (!scanType) return;

    try {
      const endpoint = scanType === "withdraw"
        ? `/products/variants/${barcode}/decrease-stock`
        : `/products/variants/${barcode}/add-stock`;

      const res = await axiosAuth.patch(endpoint);
      console.log(res);
      setResult(res.data.responseVariant);

      scanType === "withdraw" ? deleteNotify('تم سحب قطعة من المخزون') : successNotify('تم إضافة قطعة إلى المخزون');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let buffer = "";

    const handleKeyDown = (event) => {
      if (!scanType) return;

      if (event.key === "Enter" && buffer) {
        handleScan(buffer);
        buffer = "";
      } else if (event.key.length === 1) { // Ensures only printable characters are recorded
        buffer += event.key;
      }
    };


    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scanType]);

  return (
    <div className="text-center">
      <h2 className="custom-header font-bold">فحص الباركود</h2>
      <p>اختر العملية المراد تنفيذها, ثم افحص الباركود.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div
          className={`min-h-40 flex items-center justify-center shadow-md rounded-xl cursor-pointer duration-500 hover:bg-gray-600 hover:text-white text-2xl ${scanType === 'withdraw' ? 'bg-gray-600 text-white animate-pulse' : 'bg-white text-gray-600'}`}
          onClick={() => setScanType('withdraw')}
        >
          {scanType === 'withdraw'
            ? <p>وضع السحب مفعل</p>
            : <p>سحب من المخزون</p>}
        </div>
        <div
          className={`min-h-40 flex items-center justify-center shadow-md rounded-xl cursor-pointer duration-500 hover:bg-green-400 hover:text-white text-2xl ${scanType === 'deposit' ? 'bg-green-400 text-white animate-pulse' : 'bg-white text-green-400'}`}
          onClick={() => setScanType('deposit')}
        >
          {scanType === 'deposit'
            ? <p>وضع الإضافة مفعل</p>
            : <p>إضافة إلى المخزون</p>}
        </div>
      </div>
      {/* <div className="flex items-center justify-center flex-wrap gap-4 md:gap-0 mt-8 text-gray-800">
        {result && Object.keys(result).map((item, index) => {
          if (item === '_id') return null;
          return (
            <div key={index} className="flex flex-col gap-2">
              <p className="font-semibold border-b border-gray-300 pb-2 text-center px-8">{item}</p>
              <p className="text-center px-8">{result[item] || (item === 'stock' ? '0' : '-')}</p>
            </div>
          );
        })}
      </div> */}
      {
        result && (
          <div className="custom-bg-white mt-8">
            <div className="bg-white rounded-xl overflow-x-auto overflow-y-hidden scrollbar">
              <table className="w-full">
                <thead className="text-gray-700 border-b border-gray-300 font-bold text-center whitespace-nowrap">
                  <tr>
                    <th className="p-3">الباركود</th>
                    <th className="p-3">المخزون</th>
                    <th className="p-3">الاسم</th>
                    <th className="p-3">المقاس</th>
                    <th className="p-3">اللون</th>
                    <th className="p-3">السعر</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="duration-500 hover:bg-gray-50 text-center text-gray-600 whitespace-nowrap">
                    <td className="p-3">{result.barCode || '-'}</td>
                    <td className="p-3 text-indigo-500 font-bold">{result.stock || '0'}</td>
                    <td className="p-3">{(result.name?.length > 25 ? result.name.slice(0, 25) + '...' : result.name) || '-'}</td>
                    <td className="p-3">{result.size || '-'}</td>
                    <td className="p-3">{result.color || '-'}</td>
                    <td className="p-3">{result.price || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      }

      <Toaster toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default HandleStorage;
