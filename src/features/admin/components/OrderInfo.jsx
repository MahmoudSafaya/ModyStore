import React from "react";
import { useOrders } from "../../../context/OrdersContext";
import { X, SquareArrowOutUpLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const OrderInfo = ({ info, inConfirmed, handleDelete }) => {
  const naviagte = useNavigate();

  const { setOrderPopup, confirmOrderToJNT, printOrderPdf } = useOrders();

  const { _id, itemsValue, remark, sender, receiver, items } = info;

  const handleCopy = (txt) => {
    navigator.clipboard.writeText(txt)
    toast.success('تم النسخ!')
  }
  const handleTrackOrder = (orderId) => {
    // 67b9feba60f8678956eaa268
    naviagte(`/admin/track-order?orderId=${orderId}`)
    setOrderPopup({ display: false, editing: false, info: {} })
  }

  return (
    <div className="w-full h-full fixed top-0 left-0 z-100 bg-[#00000070] py-16 overflow-y-auto">
      <div className="w-5/6 relative mx-auto flex flex-col gap-6 bg-white rounded-xl shadow-md py-8 px-4 md:px-8">
        <div
          className="absolute -top-3 right-1/2 translate-x-1/2 bg-white rounded-full p-1 text-gray-500 shadow-sm cursor-pointer duration-500 hover:text-gray-900 hover:rotate-90"
          onClick={() => setOrderPopup({ display: false, editing: false, info: {} })}
        >
          <X />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <p>
              <span className="ml-2 font-bold">بيانات أوردر:-</span>
              <span onClick={() => handleCopy(inConfirmed ? info.billCode : info.txlogisticId)} className="cursor-pointer duration-300 hover:text-indigo-400 hover:underline">
                {inConfirmed ? info.billCode : info.txlogisticId}
              </span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <p onClick={() => handleTrackOrder(info._id)} className="flex items-center gap-2 group cursor-pointer">
              <span className="font-semibold duration-500 group-hover:text-indigo-400">مزيد من التفاصيل</span>
              <SquareArrowOutUpLeft className="w-5 h-5 duration-500 group-hover:rotate-45 group-hover:text-indigo-400" />
            </p>

            {inConfirmed && (
              <button onClick={() => printOrderPdf(_id)} className="max-w-max py-2 px-4 bg-green-500 text-white rounded-lg duration-500 hover:bg-green-600">طباعة البوليصة</button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-8">
          {/* Sender Info */}
          <div className="flex flex-col gap-4">
            <h2 className="text-gray-800 font-bold text-center">بيانات الراسل</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <DetailBox itemName={'الاسم:'} itemValue={sender.name} />
              <DetailBox itemName={'رقم موبيل:'} itemValue={sender.mobile} />
              <DetailBox itemName={'رقم موبيل 2:'} itemValue={sender.alternateReceiverPhoneNo} />
              <DetailBox itemName={'المحافطة:'} itemValue={sender.prov} />
              <DetailBox itemName={'المدينة:'} itemValue={sender.city} />
              <DetailBox itemName={'المنطقة:'} itemValue={sender.area} />
              <DetailBox itemName={'العنوان:'} itemValue={sender.street} />
            </div>
          </div>
          {/* Receiver Info */}
          <div className="flex flex-col gap-4">
            <h2 className="text-gray-800 font-bold text-center">بيانات العميل</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <DetailBox itemName={'الاسم:'} itemValue={receiver.name} />
              <DetailBox itemName={'رقم موبيل:'} itemValue={receiver.mobile} />
              <DetailBox itemName={'رقم موبيل 2:'} itemValue={receiver.alternateReceiverPhoneNo} />
              <DetailBox itemName={'المحافطة:'} itemValue={receiver.prov} />
              <DetailBox itemName={'المدينة:'} itemValue={receiver.city} />
              <DetailBox itemName={'المنطقة:'} itemValue={receiver.area} />
              <DetailBox itemName={'العنوان:'} itemValue={receiver.street} />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-8 mt-4">
          <h2 className="text-gray-800 font-bold text-center">بيانات الأوردر</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {items && items.map(product => {
              return (
                <div key={product._id} className="text-gray-500 min-w-full sm:min-w-auto flex items-center gap-4">
                  <DetailBox itemName={'اسم المنتج:'} itemValue={product.englishName} />
                  <DetailBox itemName={'الكمية:'} itemValue={product.number} />
                </div>
              )
            })}
            <DetailBox itemName={'سعر الأوردر'} itemValue={itemsValue} />
            <DetailBox itemName={'ملاحظات العميل:'} itemValue={remark} />
          </div>
        </div>

        {/* Order Operations */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 mt-4">
          <div className="w-full md:w-auto">
            {!inConfirmed && (
              <button className="w-full md:w-auto min-w-30 py-3 px-5 rounded-lg shadow-sm bg-indigo-500 text-white duration-500 hover:bg-indigo-600" onClick={() => {
                console.log(info);
                confirmOrderToJNT(info._id)
              }}>تسجيل</button>
            )}
          </div>
          <div className="w-full md:w-auto flex items-center justify-between gap-6">
            {!inConfirmed && (
              <button className="w-full min-w-30 py-3 px-5 rounded-lg shadow-sm bg-gray-600 text-white duration-500 hover:bg-gray-700" onClick={() => setOrderPopup({ display: false, editing: true, info: info })}>تعديل</button>
            )}
            <button className="w-full min-w-30 py-3 px-5 rounded-lg shadow-sm bg-red-400 text-white duration-500 hover:bg-red-500" onClick={() => handleDelete(info._id)}>حذف</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;


const DetailBox = ({ itemName, itemValue }) => {
  return (
    <div className="flex items-center gap-2 min-w-full md:min-w-30 bg-gray-100 p-2 px-4 rounded-lg justify-center">
      <h5 className="font-medium text-gray-700">{itemName}</h5>
      <p className="text-gray-500 text-base">{itemValue || '-'}</p>
    </div>
  )
}