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

// Reference font
const styles = {
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
    fontFamily: 'rubik',
    fontSize: 10,
    marginBottom: 2,
    textAlign: 'center',
  }
};

// Component to create PDF with the barcode
export const BarcodePDF = ({ variant, stock, billName }) => {
  return (
    <Document>
      {Array.from({ length: stock > 0 ? stock : 1 }, (_, index) => {
        const canvas = document.createElement("canvas");
        JsBarcode(canvas, variant, {
          format: "CODE128",
          height: 50,
          displayValue: true,
        });

        // Convert canvas to data URL
        const barcodeDataURL = canvas.toDataURL("image/png");

        return (
          <Page key={index} style={styles.page} size={{ width: 216, height: 100 }}>
            <View style={styles.pageView}>
              <Text style={styles.pageText}>{billName}</Text>
              <Image
                src={barcodeDataURL}
                style={{ width: 200, height: 50 }}
              />
            </View>
          </Page>
        );
      })}
    </Document>
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