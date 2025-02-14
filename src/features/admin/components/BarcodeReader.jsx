import React, { useState, useEffect } from "react";

const BarcodeReader = () => {
  const [barcode, setBarcode] = useState("");
  const [result, setResult] = useState(null);

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

  return (
    <div>
      <h1>Barcode Reader</h1>
      <p>Scan a barcode to see the result below:</p>
      <div style={{ marginTop: "20px" }}>
        <strong>Scanned Barcode:</strong> {barcode || "No barcode scanned yet."}
      </div>
      {result && (
        <div style={{ marginTop: "20px", color: "green" }}>
          <strong>Processed Result:</strong> {result}
        </div>
      )}
    </div>
  );
};

export default BarcodeReader;
