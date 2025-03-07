import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import toast, { Toaster } from "react-hot-toast";

const HandleStorage = () => {
  const [scanType, setScanType] = useState('');
  const [result, setResult] = useState(null);
  const [barcode, setBarcode] = useState("");

  const depositScan = async () => {
    try {
      const res = await axios.patch(`/products/variants/BARm7yv9wj1RDA2/add-stock`);
      console.log(res);
      setResult(res.data.variant);
      toast.success(res.data.message, {
        style: {
          padding: '16px',
          color: '#61D345',
        },
      })
    } catch (error) {
      console.error(error);
    }
  }

  const withdrawScan = async () => {
    try {
      const res = await axios.patch(`/products/variants/BARm7yv9wj1RDA2/decrease-stock`);
      console.log(res);
      setResult(res.data.variant);
      toast.success(res.data.message, {
        style: {
          padding: '16px',
          color: '#485363',
        },
        iconTheme: {
          primary: '#485363',
          secondary: '#FFFFFF',
        },
      })
    } catch (error) {
      console.error(error);
    }
  }

  // useEffect(() => {
  //   let buffer = ""; // Temporary storage for barcode characters

  //   const handleKeyDown = (event) => {
  //     if (event.key === "Enter") {
  //       setBarcode(buffer);
  //       setResult(buffer); // Process barcode result
  //       buffer = ""; // Clear buffer for next scan
  //     } else {
  //       buffer += event.key; // Append each key to the buffer
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (scanType === 'withdraw') {
  //     withdrawScan()
  //   } else {
  //     depositScan();
  //   }
  // }, [scanType]);

  return (
    <div>
      <h2 className="custom-header">فصح الباركود</h2>
      <p>اختر العملية المراد تنفيذها, ثم افحص الباركود.</p>
      <div className="grid grid-cols-2 gap-8 mt-8">
        {/* <strong>Scanned Barcode:</strong> {barcode || "No barcode scanned yet."} */}
        <div className="bg-white min-h-60 text-green-400 flex items-center justify-center shadow-md rounded-xl cursor-pointer" onClick={depositScan}>
          <p>إضافة إلى المخزون</p>
        </div>
        <div className="bg-white min-h-60 text-red-400 flex items-center justify-center shadow-md rounded-xl cursor-pointer" onClick={withdrawScan}>
          <p>سحب من المخزون</p>
        </div>
      </div>
      <div className="flex items-center justify-center mt-8 text-gray-800">
        {result && Object.keys(result).map((item, index) => {
          if (item === '_id') return;
          return (
            <div key={index} className="flex flex-col gap-2">
              <p className="font-semibold border-b border-gray-300 pb-2 text-center px-8">{item}</p>
              <p className="text-center px-8">{result[item]}</p>
            </div>
          )
        })}
      </div>

      <Toaster toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default HandleStorage;