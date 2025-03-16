import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { Toaster } from "react-hot-toast";
import { useApp } from "../../../context/AppContext";

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

      const res = await axios.patch(endpoint);
      setResult(res.data.variant);

      scanType === "withdraw" ? deleteNotify(res.data.message) : successNotify(res.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let buffer = "";

    const handleKeyDown = (event) => {
      if (!scanType) return; // Prevent scanning if scanType isn't selected

      if (event.key === "Enter" && buffer) {
        handleScan(buffer);
        buffer = "";
      } else {
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
          className={`min-h-60 flex items-center justify-center shadow-md rounded-xl cursor-pointer duration-500 hover:bg-gray-600 hover:text-white text-2xl ${scanType === 'withdraw' ? 'bg-gray-600 text-white animate-pulse' : 'bg-white text-gray-600'}`}
          onClick={() => setScanType('withdraw')}
        >
          {scanType === 'withdraw'
            ? <p>وضع السحب مفعل</p>
            : <p>سحب من المخزون</p>}
        </div>
        <div
          className={`min-h-60 flex items-center justify-center shadow-md rounded-xl cursor-pointer duration-500 hover:bg-green-400 hover:text-white text-2xl ${scanType === 'deposit' ? 'bg-green-400 text-white animate-pulse' : 'bg-white text-green-400'}`}
          onClick={() => setScanType('deposit')}
        >
          {scanType === 'deposit'
            ? <p>وضع الإضافة مفعل</p>
            : <p>إضافة إلى المخزون</p>}
        </div>
      </div>
      <div className="flex items-center justify-center mt-8 text-gray-800">
        {result && Object.keys(result).map((item, index) => {
          if (item === '_id') return null;
          return (
            <div key={index} className="flex flex-col gap-2">
              <p className="font-semibold border-b border-gray-300 pb-2 text-center px-8">{item}</p>
              <p className="text-center px-8">{result[item] || '-'}</p>
            </div>
          );
        })}
      </div>

      <Toaster toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default HandleStorage;
