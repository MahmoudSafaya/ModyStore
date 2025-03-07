import React from "react";
import { useOrders } from "../../../context/OrdersContext";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderInfo = ({ info, inConfirmed, handleDelete }) => {
  const naviagte = useNavigate();

  const { setOrderPopup, confirmOrderToJNT, printOrderPdf } = useOrders();

  const { _id, itemsValue, remark, sender, receiver, items } = info;

  const handleIdClick = (txlogisticId) => {
    navigator.clipboard.writeText(txlogisticId);
    // 67b9feba60f8678956eaa268
    naviagte(`/admin/track-order?orderId=${txlogisticId}`)
    setOrderPopup({ display: false, editing: false, info: {} })
  }

  return (
    <div className="w-full h-full fixed top-0 left-0 z-100 bg-[#00000070] py-16 overflow-y-auto">
      <div className="w-5/6 mx-auto custom-bg-white flex flex-col gap-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="mb-4">
            <span className="ml-2 font-bold">بيانات أوردر:-</span>
            <span onClick={() => handleIdClick(info.txlogisticId)} className="text-indigo-400 cursor-pointer duration-500 hover:text-indigo-500">
              {info.txlogisticId}
            </span>
          </h2>

          <div className="flex items-center gap-6">
            {inConfirmed && (
              <button onClick={() => printOrderPdf(_id)} className="max-w-max py-2 px-4 bg-green-500 text-white rounded-lg duration-500 hover:bg-green-600">Print Bill</button>
            )}

            <span
              className="text-gray-500 cursor-pointer duration-500 hover:text-gray-900 hover:rotate-90"
              onClick={() =>
                setOrderPopup({ display: false, editing: false, info: {} })
              }
            >
              <X />
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Sender Info */}
          <div className="flex flex-col gap-4">
            <h2 className="text-gray-800 font-bold text-center">بيانات الراسل</h2>
            <div className="grid grid-cols-2 gap-6 border border-gray-300 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <h5 className="font-medium text-gray-700">الاسم:</h5>
                <p className="text-gray-500 text-base">{sender.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <h5 className="font-medium text-gray-700">رقم موبيل:</h5>
                <p className="text-gray-500 text-base">{sender.mobile}</p>
              </div>
              <div className="flex items-center gap-2">
                <h5 className="font-medium text-gray-700">رقم موبيل 2:</h5>
                <p className="text-gray-500 text-base">{sender.alternateReceiverPhoneNo}</p>
              </div>
              <div className="flex items-center gap-2">
                <h5 className="font-medium text-gray-700">المحافطة:</h5>
                <p className="text-gray-500 text-base">{sender.prov}</p>
              </div>
              <div className="flex items-center gap-2">
                <h5 className="font-medium text-gray-700">المدينة:</h5>
                <p className="text-gray-500 text-base">{sender.city}</p>
              </div>
              <div className="flex items-center gap-2">
                <h5 className="font-medium text-gray-700">المنطقة:</h5>
                <p className="text-gray-500 text-base">{sender.area}</p>
              </div>
              <div className="flex items-center gap-2">
                <h5 className="font-medium text-gray-700">الشارع:</h5>
                <p className="text-gray-500 text-base">{sender.street}</p>
              </div>
            </div>
          </div>
          {/* Receiver Info */}
          <div className="flex flex-col gap-4">
            <h2 className="text-gray-800 font-bold text-center">بيانات العميل</h2>
            <div className="grid grid-cols-2 gap-6 border border-gray-300 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <h5 className="font-medium text-gray-700">الاسم:</h5>
                <p className="text-gray-500 text-base">{receiver.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <h5 className="font-medium text-gray-700">رقم موبيل:</h5>
                <p className="text-gray-500 text-base">{receiver.mobile}</p>
              </div>
              <div className="flex items-center gap-2">
                <h5 className="font-medium text-gray-700">رقم موبيل 2:</h5>
                <p className="text-gray-500 text-base">{receiver.alternateReceiverPhoneNo}</p>
              </div>
              <div className="flex items-center gap-2">
                <h5 className="font-medium text-gray-700">المحافطة:</h5>
                <p className="text-gray-500 text-base">{receiver.prov}</p>
              </div>
              <div className="flex items-center gap-2">
                <h5 className="font-medium text-gray-700">المدينة:</h5>
                <p className="text-gray-500 text-base">{receiver.city}</p>
              </div>
              <div className="flex items-center gap-2">
                <h5 className="font-medium text-gray-700">المنطقة:</h5>
                <p className="text-gray-500 text-base">{receiver.area}</p>
              </div>
              <div className="flex items-center gap-2">
                <h5 className="font-medium text-gray-700">الشارع:</h5>
                <p className="text-gray-500 text-base">{receiver.street}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <h2 className="text-gray-800 font-bold text-center">بيانات الأوردر</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 border border-gray-300 rounded-lg p-4">
            {items && items.map(product => {
              return (
                <div key={product._id} className="border-l border-gray-300">
                  <div className="text-gray-500">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-gray-700">اسم المنتج:</h5>
                      <p className="text-gray-500 text-base">{product.englishName}</p>
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="flex items-center gap-2">
              <h5 className="font-medium text-gray-700">ملاحظات العميل:</h5>
              <p className="text-gray-500 text-base">{remark}</p>
            </div>
          </div>
        </div>

        {/* Order Operations */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between">
          <div>
            {!inConfirmed && (
              <button className="min-w-30 py-3 px-5 rounded-lg shadow-sm bg-indigo-500 text-white duration-500 hover:bg-indigo-600" onClick={() => confirmOrderToJNT(info._id)}>Sign</button>
            )}
          </div>
          <div className="flex gap-6">
            {!inConfirmed && (
              <button className="min-w-30 py-3 px-5 rounded-lg shadow-sm bg-gray-600 text-white duration-500 hover:bg-gray-700" onClick={() => setOrderPopup({ display: false, editing: true, info: info })}>Edit</button>
            )}
            <button className="min-w-30 py-3 px-5 rounded-lg shadow-sm bg-red-400 text-white duration-500 hover:bg-red-500" onClick={() => handleDelete(info._id)}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
