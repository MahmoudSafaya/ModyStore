import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";

const BarcodeReader = () => {
  const [scanType, setScanType] = useState('');
  const [result, setResult] = useState(null);
  const [barcode, setBarcode] = useState("");

  const withdrawScan = async () => {
    try {
      const res = await axios.patch(`/products/variants/${barcode}/add-stock`);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }

  const depositScan = async () => {
    try {
      const res = await axios.patch(`/products/variants/${barcode}/decrease-stock`);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    let buffer = ""; // Temporary storage for barcode characters

    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        setBarcode(buffer);
        setResult(buffer); // Process barcode result
        buffer = ""; // Clear buffer for next scan
      } else {
        buffer += event.key; // Append each key to the buffer
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (scanType === 'withdraw') {
      withdrawScan()
    } else {
      depositScan();
    }
  }, [barcode]);

  return (
    <div>
      <h1>Barcode Reader</h1>
      <p>Scan a barcode to see the result below:</p>
      <div className="grid grid-cols-2 gap-8 mt-8">
        {/* <strong>Scanned Barcode:</strong> {barcode || "No barcode scanned yet."} */}
        <div className="bg-green-100 min-h-60 flex items-center justify-center shadow-md rounded-lg" onClick={() => setScanType('withdraw')}>
          <p>Withdraw From Storage</p>
        </div>
        <div className="bg-red-100 min-h-60 flex items-center justify-center shadow-md rounded-lg" onClick={() => setScanType('deposite')}>
          <p>Deposite To Storage</p>
        </div>
      </div>
      {/* {result && (
        <div style={{ marginTop: "20px", color: "green" }}>
          <strong>Processed Result:</strong> {result}
        </div>
      )} */}
    </div>
  );
};

export default BarcodeReader;
