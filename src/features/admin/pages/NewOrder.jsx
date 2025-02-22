import React from "react";
import { Formik, Form } from "formik";
import { A_SenderForm, A_ReceiverFrom, A_ProductForm } from "../components";
import { newOrderSchema } from "../../../schemas";
import axios from '../../../api/axios';
import { useAuth } from "../../../context/AdminContext";
import "../styles/new-order.scss";
import { useOrders } from "../../../context/OrdersContext";

const NewOrder = ({ editMode, info, handleOrderPopup }) => {
  const { auth, orders, setOrders } = useAuth();
  const { unconfirmedOrders, setUnconfirmedOrders } = useOrders();

  const initialValues = info || {
    length: 30,
    weight: 5.02,
    itemsValue: "555",
    remark: "test",
    billCode: "", ////////////////////
    goodsType: "ITN1",
    totalQuantity: "1",
    width: 10,
    height: 60,
    offerFee: 1,
    receiver: {
      area: "",
      street: "",
      address: "kkk",
      addressBak: "FFF",
      town: "ll",
      city: "",
      mobile: "",
      mailBox: "ant_li123@qq.com",
      phone: "",
      countryCode: "EGY",
      name: "",
      alternateReceiverPhoneNo: "12-31321322",
      company: "JT",
      postCode: "54830",
      prov: "",
      areaCode: "A0003324",
      building: "13",
      floor: "25",
      flats: "47"
    },
    items: [
      {
        englishName: "",
        number: 1,
        itemType: "ITN16",
        itemName: "file type",
        priceCurrency: "DHS",
        itemValue: "",
        chineseName: "",
        itemUrl: "",
        desc: ""
      }
    ]
  }

  const handleOrderSubmit = async (values, actions) => {
    if (editMode) {
      try {
        await axios.put(`/visitors/orders/${values._id}`, values);
        handleOrderPopup({ editing: false });
        // update unconfirmedOrder state
        const newOrders = unconfirmedOrders.map(item => item._id === values._id ? item = values : item)
        setUnconfirmedOrders(newOrders)
      } catch (error) {
        console.error(error)
      }
    } else {
      // try {
      //   const response = await axios.post('/api/order/add-order', {
      //     sender, receiver, product, signedBy
      //   });
      //   console.log(response);
      //   actions.resetForm();

      // } catch (error) {
      //   console.log(error)
      // }
      console.log('in new order mode')
    }

  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={newOrderSchema}
        onSubmit={handleOrderSubmit}
      >
        {({ values }) => (
          <Form className="mt-8">
            <div className="grid grid-cols-1 lg:flex gap-8">
              <div className="border border-gray-300 rounded-lg p-8 lg:w-1/2">
                <h2 className="font-bold mb-4 text-center ">بيانات المتجر</h2>
                <A_SenderForm />
              </div>

              <div className="border border-gray-300 rounded-lg p-8 lg:w-1/2">
                <h2 className="font-bold mb-4 text-center">بيانات العميل</h2>
                <A_ReceiverFrom />
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-8 w-full mt-8">
              <h2 className="font-bold mb-4 text-center">بيانات المنتج</h2>
              <A_ProductForm values={values} />
            </div>

            <button type="submit" className="block mt-8 min-w-50 p-3 text-center bg-indigo-500 text-white font-bold hover:bg-indigo-400 hover:shadow-lg transition-all duration-500 rounded-xl shadow-md mx-auto">
              {editMode ? 'Update' : 'Order'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewOrder;
