import React from "react";
import { Formik, Form } from "formik";
import { A_SenderForm, A_ReceiverFrom, A_ProductForm } from "../components";
import { newOrderSchema } from "../../../schemas";
import axios from '../../../api/axios';
import { useAuth } from "../../../context/AdminContext";
import "../styles/new-order.scss";

const NewOrder = ({ editMode, info, handleOrderPopup }) => {
  const { auth, orders, setOrders } = useAuth();

  const initialValues = info || {
    sender: {
      name: "R8 Store",
      phone1: "01551448276",
      phone2: "",
      state: "الغربية",
      city: "كفرالزيات",
      area: "ابيار",
      street: "كفرالزيات - ابيار",
    },
    receiver: {
      name: "",
      phone1: "",
      phone2: "",
      state: "",
      city: "",
      area: "",
      street: "",
    },
    product: { name: "", type: "", weight: "1.00", quantity: "1", price: "" },
    signedBy: auth?.user.name,
  };

  const handleSubmit = async (values, actions) => {
    console.log(orders)
    console.log("Form Data:", values);
    const { sender, receiver, product, signedBy } = values;
    if (editMode) {
      try {
        const response = await axios.put(`/api/order/update/${info._id}`, {
          barcodeID: info.barcodeID,
          sender,
          receiver,
          product,
          signedBy
        });
        setOrders(orders.map(item => (
          item._id === info._id ? values : item
        )))
        handleOrderPopup({ editing: false })
        console.log('updat: ' + response)
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const response = await axios.post('/api/order/add-order', {
          sender, receiver, product, signedBy
        });
        console.log(response);
        actions.resetForm();

      } catch (error) {
        console.log(error)
      }
    }

  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={newOrderSchema}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form>
          <div className="grid grid-cols-1 lg:flex gap-8">
            <div className="custom-bg-white lg:w-1/2">
              <h2 className="font-bold mb-4 text-center ">بيانات المتجر</h2>
              <A_SenderForm />
            </div>

            <div className="custom-bg-white lg:w-1/2">
              <h2 className="font-bold mb-4 text-center">بيانات العميل</h2>
              <A_ReceiverFrom />
            </div>
          </div>

          <div className="custom-bg-white w-full mt-8">
            <h2 className="font-bold mb-4 text-center">بيانات المنتج</h2>
            <A_ProductForm />
          </div>

          <button type="submit" className="block mt-8 min-w-50 p-3 text-center bg-indigo-500 text-white font-bold hover:bg-indigo-400 hover:shadow-lg transition-all duration-500 rounded-xl shadow-md mx-auto">
            {editMode ? 'Update' : 'Order'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default NewOrder;
