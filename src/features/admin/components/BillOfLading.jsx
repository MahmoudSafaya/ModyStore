import React, { useRef, useEffect, useState } from "react";
import JsBarcode from "jsbarcode";
import {
  Document,
  Page,
  View,
  Image,
  PDFDownloadLink,
  Text,
  StyleSheet, Font
} from "@react-pdf/renderer";

// Register font
Font.register({
  family: 'rubik',
  fonts: [
    {
      src: `../fonts/Rubik-Regular.ttf`
    },
  ]
})

// Styles
const styles = StyleSheet.create({
  page: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  pageView: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pageText: {
    fontFamily: "rubik",
    fontSize: 10,
    marginBottom: 2,
    textAlign: "center",
  },
  barcodeImage: {
    width: 200,
    height: 50,
  },
});

// Helper to generate barcode base64
const generateBarcodeImage = (text) => {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, text, {
    format: "CODE128",
    height: 50,
    displayValue: true,
  });
  return canvas.toDataURL("image/png");
};

// React component to prepare barcodes and render PDF
export const BarcodePDFWrapper = ({ variant, stock, billName }) => {
  const [barcodes, setBarcodes] = useState([]);

  useEffect(() => {
    const count = stock > 0 ? stock : 1;
    const generated = Array.from({ length: count }, () =>
      generateBarcodeImage(variant)
    );
    setBarcodes(generated);
  }, [variant, stock]);

  return (
    barcodes.length > 0 && (
      <Document>
        {barcodes.map((src, index) => (
          <Page
            key={index}
            style={styles.page}
            size={{ width: 216, height: 100 }}
          >
            <View style={styles.pageView}>
              <Text style={styles.pageText}>{billName}</Text>
              <Image src={src} style={styles.barcodeImage} />
            </View>
          </Page>
        ))}
      </Document>
    )
  );
};

const BillOfLading = ({ variant, stock, billName }) => {

  return (
    <div className="w-full md:w-auto text-center">
      <PDFDownloadLink
        document={<BarcodePDF variant={variant} stock={stock} billName={billName} />}
        fileName="barcode.pdf"
        className="w-full md:w-auto inline-block bg-green-500 text-slate-100 font-bold p-2 px-4 rounded-lg shadow-md duration-500 hover:bg-green-600 cursor-pointer"
      >
        {({ loading }) => (loading ? "جار إنشاء الملف..." : "طباعة كود شحن")}
      </PDFDownloadLink>
    </div>
  );
};

export default BillOfLading;