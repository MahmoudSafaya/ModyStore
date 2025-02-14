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
const styles = StyleSheet.create({
  page: {
    fontFamily: 'rubik',
    padding: 3,
    fontSize: 10,
    textAlign: 'right'
  },
  containerColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  containerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid black'
  }
})

// Component to create PDF with the barcode
const BarcodePDF = ({ unprintedOrders }) => {
  return (
    <Document>
      {unprintedOrders && unprintedOrders.map((item) => {
        // Generate the barcode and set the data URL for PDF generation
        const canvas = document.createElement("canvas");
        JsBarcode(canvas, item.barcodeID, { 
          format: "CODE128", 
          height: 50,
          displayValue: false 
        });
        // const barcodeDataURL = canvas.toDataURL("image/png");

        const {sender, receiver, product} = item;
        
        return (
          <Page key={item._id} style={styles.page} size={[215, 369]}>
            <View>
              <Image src={canvas.toDataURL("image/png")} />
            </View>
            <View style={{textAlign: 'center'}}>
              <Text>{item.barcodeID}</Text>
            </View>
            <View style={styles.containerRow}>
              <Text>Store: {sender.name}</Text>
              <Text>Price: {product.price}</Text>
            </View>
            <View style={styles.containerColumn} wrap={true}>
              <Text>To: {receiver.name}</Text>
              <Text>{receiver.phone1}</Text>
              <Text>{receiver.street}</Text>
              <Text>{receiver.state}, {receiver.city}, {receiver.area} </Text>
            </View>
            <View wrap={true}>
              <Text>{sender.name}</Text>
              <Text>{sender.phone1}</Text>
              <Text>{sender.street}</Text>
              <Text>{sender.state}, {sender.city}, {sender.area} </Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

const BillOfLading = ({ orders }) => {

  return (
    <div>
      <PDFDownloadLink
        document={<BarcodePDF unprintedOrders={orders && orders} />}
        fileName="barcode.pdf"
        className="inline-block bg-indigo-500 text-slate-100 font-bold p-2 px-4 rounded-lg shabdow-md duration-500 hover:bg-indigo-600 cursor-pointer mb-8"
      >
        {({ blob, url, loading, error }) =>
          loading ? "جار إنشاء الملف..." : "تحميل بوالص الشحن"
        }
      </PDFDownloadLink>
    </div>
  );
};

export default BillOfLading;
