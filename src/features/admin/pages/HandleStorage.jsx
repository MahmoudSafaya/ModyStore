import React, { useState, useEffect, useRef } from "react";
import { axiosAuth } from "../../../api/axios";
import { Toaster } from "react-hot-toast";
import { useApp } from "../../../context/AppContext";
import { ImBoxAdd, ImBoxRemove } from "react-icons/im";

const HandleStorage = () => {
  const [scanType, setScanType] = useState("");
  const [result, setResult] = useState(null);
  const [barcodeInput, setBarcodeInput] = useState("");
  const { successNotify, deleteNotify, errorNotify } = useApp();
  const bufferRef = useRef("");

  const handleScan = async (barcode, type) => {
    if (!type || !barcode.trim()) return errorNotify("اكتب الباركود أولًا!");

    try {
      const endpoint =
        type === "withdraw"
          ? `/products/variants/${barcode}/decrease-stock`
          : `/products/variants/${barcode}/add-stock`;

      const res = await axiosAuth.patch(endpoint);
      setResult(res.data.responseVariant);

      type === "withdraw"
        ? deleteNotify("تم سحب قطعة من المخزون")
        : successNotify("تم إضافة قطعة إلى المخزون");

      // setBarcodeInput("");
    } catch (error) {
      console.error(error);
      errorNotify("حدث خطأ أثناء تحديث المخزون!");
    }
  };

  const handleAction = (type) => {
    setScanType(type);
    if (barcodeInput.trim()) {
      handleScan(barcodeInput, type);
    } else {
      errorNotify("اكتب الباركود أولًا!");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!scanType) return;

      if (event.key === "Enter" && bufferRef.current) {
        handleScan(bufferRef.current, scanType);
        setBarcodeInput(bufferRef.current);
        bufferRef.current = "";
      } else if (event.key.length === 1) {
        bufferRef.current += event.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scanType]);

  return (
    <div className="text-center">
      <h2 className="custom-header font-bold">فحص الباركود</h2>
      <p>اختر العملية المراد تنفيذها, ثم افحص الباركود.</p>

      <div className="custom-bg-white mt-8">
        <form className="flex items-center justify-between flex-col md:flex-row gap-4">
          <div className="flex-grow flex items-center gap-2">
            <label>الباركود:</label>
            <input
              id="barcodeInput"
              name="barcodeInput"
              className="custom-input-field"
              autoComplete="off"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="min-w-30 py-3 px-5 border-none outline-none rounded-lg shadow-md bg-gray-600 text-white duration-500 hover:bg-gray-700"
              onClick={() => handleAction("withdraw")}
            >
              سحب
            </button>
            <button
              type="button"
              className="min-w-30 py-3 px-5 border-none outline-none rounded-lg shadow-md bg-green-400 text-white duration-500 hover:bg-green-500"
              onClick={() => handleAction("deposit")}
            >
              إضافة
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {["withdraw", "deposit"].map((type) => (
          <div
            key={type}
            className={`min-h-40 flex items-center justify-center shadow-md rounded-xl cursor-pointer duration-500 
              ${scanType === type ? "border-indigo-400 text-white" : "border-white"}
              ${type === "withdraw"
                ? scanType === type
                  ? "bg-gray-600"
                  : "bg-white text-gray-600 hover:bg-gray-600 hover:text-white"
                : scanType === type
                  ? "bg-green-400"
                  : "bg-white text-green-400 hover:bg-green-400 hover:text-white"
              }`}
            onClick={() => setScanType(type)}
          >
            <div className="flex items-center gap-4">
              <p>{scanType === type ? `وضع ${type === "withdraw" ? "السحب" : "الإضافة"} مفعل` : type === "withdraw" ? "سحب من المخزون" : "إضافة إلى المخزون"}</p>
              <div className={`p-2 rounded-lg shadow-md ${type === "withdraw" ? "bg-white text-gray-700" : "bg-white text-green-500"}`}>
                {type === "withdraw" ? <ImBoxRemove className="w-6 h-6" /> : <ImBoxAdd className="w-6 h-6" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {result && (
        <div className="custom-bg-white mt-8">
          <div className="bg-white rounded-xl overflow-x-auto scrollbar">
            <table className="w-full text-center text-gray-700">
              <thead className="border-b border-gray-300 font-bold whitespace-nowrap">
                <tr>
                  {["الباركود", "المخزون", "الاسم", "المقاس", "اللون", "السعر"].map((header) => (
                    <th key={header} className="p-3">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="duration-500 hover:bg-gray-50 text-gray-600 whitespace-nowrap">
                  <td className="p-3">{result.barCode || "-"}</td>
                  <td className="p-3 text-indigo-500 font-bold">{result.stock || "0"}</td>
                  <td className="p-3">{result.name?.length > 25 ? `${result.name.slice(0, 25)}...` : result.name || "-"}</td>
                  <td className="p-3">{result.size || "-"}</td>
                  <td className="p-3">{result.color || "-"}</td>
                  <td className="p-3">{result.price || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Toaster toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default HandleStorage;
