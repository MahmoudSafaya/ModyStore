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
    {
      src: `../fonts/Rubik-Bold.ttf`,
      fontWeight: 'bold'
    },
    {
      src: `../fonts/Rubik-Light.ttf`,
      fontWeight: 'lighter'
    },
  ]
})

// Reference font
const styles = {
  page: {
    padding: 10, // Add padding to the page
  },
  barcodeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

// Component to create PDF with the barcode
const BarcodePDF = ({ variant, stock }) => {
  const [count, setCount] = useState(0);

  return (
    <Document>
      {Array.from({ length: stock }, (_, index) => {
        const canvas = document.createElement("canvas");
        JsBarcode(canvas, variant, {
          format: "CODE128",
          height: 50,
          displayValue: true,
        });
  
        // Get the barcode's width and height
        const barcodeWidth = canvas.width;
        const barcodeHeight = canvas.height;
  
        // Convert canvas to data URL
        const barcodeDataURL = canvas.toDataURL("image/png");
  
        return (
          <Page
            key={index}
            style={styles.page}
            size={[barcodeWidth + 20, barcodeHeight + 20]} // Add some padding
          >
            <View style={styles.barcodeContainer}>
              <Image
                src={barcodeDataURL}
                style={{ width: barcodeWidth, height: barcodeHeight }}
              />
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

const BillOfLading = ({ variant, stock }) => {

  return (
    <div>
      <PDFDownloadLink
        document={<BarcodePDF variant={variant} stock={stock} />}
        fileName="barcode.pdf"
        className="inline-block bg-green-500 text-slate-100 font-bold p-2 px-4 rounded-lg shabdow-md duration-500 hover:bg-green-600 cursor-pointer"
      >
        {({ blob, url, loading, error }) =>
          loading ? "جار إنشاء الملف..." : "طباعة كود شحن"
        }
      </PDFDownloadLink>
    </div>
  );
};

export default BillOfLading;
