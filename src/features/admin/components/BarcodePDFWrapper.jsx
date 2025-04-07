import React, { useEffect, useState } from "react";
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
const BarcodePDFWrapper = ({ variant, stock, billName }) => {
  const [barcodeImage, setBarcodeImage] = useState(null);

  useEffect(() => {
    const image = generateBarcodeImage(variant);
    setBarcodeImage(image);
  }, [variant]);

  const count = stock > 0 ? stock : 1;

  return (
    barcodeImage && (
      <Document>
        {Array.from({ length: count }).map((_, index) => (
          <Page
            key={index}
            style={styles.page}
            size={{ width: 216, height: 100 }}
          >
            <View style={styles.pageView}>
              <Text style={styles.pageText}>{billName}</Text>
              <Image src={barcodeImage} style={styles.barcodeImage} />
            </View>
          </Page>
        ))}
      </Document>
    )
  );
};


export default BarcodePDFWrapper;