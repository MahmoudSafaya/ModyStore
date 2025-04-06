import React, { useState, useEffect, useRef } from "react";
import { axiosAuth } from "../../../api/axios";
import { Toaster } from "react-hot-toast";
import { useApp } from "../../../context/AppContext";
import { ImBoxAdd, ImBoxRemove } from "react-icons/im";
import { MdOutlinePrint } from "react-icons/md";
import { BarcodePDFWrapper } from "../components/BillOfLading";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { format } from 'date-fns';

const HandleStorage = () => {
  const [scanType, setScanType] = useState("");
  const [result, setResult] = useState(null);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodeAmount, setBarcodeAmount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  const { successNotify, deleteNotify, errorNotify } = useApp();
  const bufferRef = useRef("");

  const handleScan = async (barcode, type) => {
    if (!type || !barcode.trim()) return errorNotify("اكتب الباركود أولًا!");

    setLoading(true);
    try {
      const endpoint =
        type === "withdraw"
          ? `/products/variants/${barcode}/decrease-stock`
          : `/products/variants/${barcode}/add-stock`;

      for (let i = 1; i <= Number(barcodeAmount); i++) {
        const res = await axiosAuth.patch(endpoint);
        if (i === Number(barcodeAmount)) {
          setResult(res.data.responseVariant);
        }
        console.log(res);
      }

      type === "withdraw"
        ? deleteNotify("تم السحب من المخزون")
        : successNotify("تمت الإضافة إلى المخزون");

      setAnimate(true);
      setTimeout(() => setAnimate(false), 2000); // No return needed here        

    } catch (error) {
      console.error(error);
      errorNotify("الباركود خطأ, تأكد منه وحاول مرة أخري.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (type) => {
    setScanType(type);
    if (barcodeInput.trim()) {
      handleScan(barcodeInput, type);
    } else {
      errorNotify("اكتب / افحص الباركود أولًا!");
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
        <form className="flex items-center justify-between flex-col lg:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-grow flex-col items-center justify-between md:flex-row gap-4">
            <div className="flex-grow flex items-center gap-2">
              <label htmlFor="barcodeInput">الباركود:</label>
              <input
                type="text"
                id="barcodeInput"
                name="barcodeInput"
                className="custom-input-field flex-grow"
                placeholder="اكتب الباركود الخاص بالمنتج"
                autoComplete="off"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="barcodeInput">الكمية:</label>
              <input
                type="number"
                id="barcodeAmount"
                name="barcodeAmount"
                className="custom-input-field !w-20 text-center"
                placeholder="الكمية"
                min="1"
                autoComplete="off"
                value={barcodeAmount}
                onChange={(e) => setBarcodeAmount(e.target.value)}
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
            <button
              type="button"
              name="withdraw-btn"
              className={`w-full md:min-w-40 py-3 px-5 border-none outline-none rounded-lg shadow-md bg-gray-600 text-white duration-500 hover:bg-gray-700 ${loading ? 'opacity-25' : ''}`}
              onClick={() => handleAction("withdraw")}
              disabled={loading}
            >
              {loading && scanType === 'withdraw' ? 'جار السحب...' : 'سحب'}
            </button>
            <button
              type="button"
              name="deposit-btn"
              className={`w-full md:min-w-40 py-3 px-5 border-none outline-none rounded-lg shadow-md bg-green-400 text-white duration-500 hover:bg-green-500 ${loading ? 'opacity-25' : ''}`}
              onClick={() => handleAction("deposit")}
              disabled={loading}
            >
              {loading && scanType === 'deposit' ? 'جار الإضافة...' : 'إضافة'}

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
        <div>
          <div className="custom-bg-white mt-8">
            <div className="bg-white rounded-xl overflow-x-auto scrollbar">
              <table className="w-full text-center text-gray-700">
                <thead className="border-b border-gray-300 font-bold whitespace-nowrap">
                  <tr>
                    {["الباركود", "المخزون", "الاسم", "المقاس", "اللون", "السعر"].map((header) => (
                      <th key={header} className="p-3">{header}</th>
                    ))}
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="duration-500 hover:bg-gray-50 text-gray-600 whitespace-nowrap">
                    <td className="p-3">{result.barCode || "-"}</td>
                    <td className={`p-3 text-indigo-500 text-xl font-bold duration-500 ${animate ? "animate-pulse text-indigo-700" : ""}`}>
                      {result.stock || "0"}
                      </td>
                    <td className="p-3">{result.name?.length > 25 ? `${result.name.slice(0, 25)}...` : result.name || "-"}</td>
                    <td className="p-3">{result.size || "-"}</td>
                    <td className="p-3">{result.color || "-"}</td>
                    <td className="p-3">{result.price || "-"}</td>
                    <td className="p-3">
                      <PDFDownloadLink
                        document={<BarcodePDFWrapper
                          variant={result.barCode}
                          stock={result.stock > 100 ? 100 : result.stock}
                          billName={`${result.name.slice(0, 20)} ${result.size} (${result.color})`}
                        />}
                        fileName="barcode.pdf"
                      >
                        <MdOutlinePrint className="w-6 h-6 mx-auto cursor-pointer duration-500 hover:text-green-400 hover:scale-110" />
                      </PDFDownloadLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="custom-bg-white mt-8 flex flex-col md:flex-row items-center justify-around gap-4 text-gray-700">
            <div className="flex flex-col justify-center items-center gap-4">
              <p className="font-bold">عدد عمليات السحب اليوم لهذا المتغير: <span className="text-gray-500 whitespace-nowrap">{format(new Date(), "PP")}</span></p>
              <p className="min-w-14 max-w-max py-2 px-4 rounded-lg bg-indigo-500 text-white text-center shadow-sm">
                {result.dayWithdraw}
              </p>
            </div>
            <div className="hidden md:block self-stretch w-[1px] bg-gray-300"></div>
            <div className="flex flex-col justify-center items-center gap-4">
              <p className="font-bold">عدد جميع عمليات السحب لهذا المتغير</p>
              <p className="min-w-14 max-w-max py-2 px-4 rounded-lg bg-gray-500 text-white text-center shadow-sm">{result.totalWithdraw}</p>
            </div>
          </div>
        </div>
      )}

      <Toaster toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default HandleStorage;
