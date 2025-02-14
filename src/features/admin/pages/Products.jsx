import { Link } from 'react-router-dom';
import { TiHome } from "react-icons/ti";
import { MoreVertical, Search } from "lucide-react";
import { useState } from 'react';
import { FaCheck } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { IoMdArrowDropup } from "react-icons/io";

const products = [
  {
    id: 1,
    name: "كوتش رياضي",
    category: "أحذية",
    date: "Thu, Jan 12 2023",
    status: "متاح",
    inStock: 350,
    price: "$275",
    image: "https://m.media-amazon.com/images/I/71pWkKOnmsL._AC_SY695_.jpg",
  },
  {
    id: 2,
    name: "كوتش رياضي",
    category: "أحذية",
    date: "Thu, Jan 12 2023",
    status: "متاح",
    inStock: 350,
    price: "$275",
    image: "https://m.media-amazon.com/images/I/71pWkKOnmsL._AC_SY695_.jpg",
  },
  {
    id: 3,
    name: "كوتش رياضي",
    category: "أحذية",
    date: "Thu, Jan 12 2023",
    status: "غير متاح",
    inStock: 350,
    price: "$275",
    image: "https://m.media-amazon.com/images/I/71pWkKOnmsL._AC_SY695_.jpg",
  },
  {
    id: 4,
    name: "كوتش رياضي",
    category: "أحذية",
    date: "Thu, Jan 12 2023",
    status: "متاح",
    inStock: 350,
    price: "$275",
    image: "https://m.media-amazon.com/images/I/71pWkKOnmsL._AC_SY695_.jpg",
  },
  {
    id: 5,
    name: "كوتش رياضي",
    category: "أحذية",
    date: "Thu, Jan 12 2023",
    status: "متاح",
    inStock: 350,
    price: "$275",
    image: "https://m.media-amazon.com/images/I/71pWkKOnmsL._AC_SY695_.jpg",
  },
];

const Products = () => {
  const [checked, setChecked] = useState(false);
  const [live, setLive] = useState(null);

  const handleOperations = (_id) => {
    if (_id === live) {
      setLive(null);
    } else {
      setLive(_id);
    }
  }

  return (
    <div>
      {/* Component Header */}
      <div className='custom-bg-white flex items-center justify-between'>
        <h2 className='text-lg'>قائمة المنتجات</h2>
        <Link to='/admin/products' className='text-2xl bg-white rounded-xl transition-all duration-300 hover:bg-indigo-600 hover:text-white p-2'>
          <TiHome />
        </Link>
      </div>

      {/* Search Feature */}
      <div className="custom-bg-white mt-8 flex flex-col md:flex-row items-center gap-4">
        <div className='flex items-center gap-2 grow'>
          <label htmlFor="product-search" className=''>بحث</label>
          <div className="relative w-full">
            <input type="text" name="product-search" id="product-search" className="custom-input-field w-full" placeholder="بحث عن منتج..." />
            <Search className="w-20 h-[calc(100%-2px)] my-[1px] ml-[1px] text-2xl p-2 rounded-l-lg bg-gray-100 text-gray-400 absolute top-0 left-0 border border-gray-200" />
          </div>
        </div>
        <button className='py-3 px-5 rounded-lg shadow-md bg-green-100 text-green-500 hover:bg-green-200 duration-500'>
          المنتجات المتاحه
        </button>
        <button className='py-3 px-5 rounded-lg shadow-md bg-red-100 text-red-500 hover:bg-red-200 duration-500'>
          المنتجات الغير متاحه
        </button>
      </div>

      {/* Table */}
      <div className="custom-bg-white mt-8 overflow-x-auto">
        <table className="w-full bg-white">
          <thead className="text-gray-600 border-b border-gray-200 font-bold text-center">
            <tr>
              <th></th>
              <th className='p-3'>المنتج</th>
              <th className="p-3">الاسم</th>
              <th className="p-3">القسم</th>
              <th className="p-3">الحاله</th>
              <th className="p-3">المخزون</th>
              <th className="p-3">سعر البيع</th>
              <th className="p-3">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 text-center">
                <td className='p-3'>
                  <label className="flex items-center justify-center h-5">
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checked}
                      onChange={() => setChecked(!checked)}
                    />
                    <div
                      className={`w-5 h-5 p-1 flex items-center justify-center rounded-sm border duration-500 cursor-pointer ${checked ? "bg-indigo-500 border-indigo-500" : "border-gray-300"
                        }`}
                    >
                      {checked && (
                        <FaCheck className='text-white' />
                      )}
                    </div>
                  </label>
                </td>
                <td className='p-3'>
                  <div className="w-15 h-15 p-2 rounded-full mx-auto">
                    <img src={item.image} alt="prodcut photo" className='w-full h-full' />
                  </div>
                </td>
                <td className="p-3 space-x-3">
                  {item.name}
                </td>
                <td className="p-3 text-gray-500">
                  {item.category}
                </td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center justify-center w-2/3 p-2 rounded-xl text-sm font-medium ${item.status === "متاح"
                      ? "bg-green-100 text-green-500"
                      : "bg-red-100 text-red-500"
                      }`}
                  >
                    {item.status}
                    <span
                      className={`w-2 h-2 mr-2 rounded-full ${item.status === "متاح" ? "bg-green-500" : "bg-red-500"
                        }`}
                    ></span>
                  </span>
                </td>
                <td className="p-3 text-gray-500">{item.inStock}</td>
                <td className="p-3 font-semibold">{item.price}</td>
                <td className="p-3">
                  <MoreVertical className={`cursor-pointer mx-auto ${live === item.id ? 'text-indigo-500' : 'text-gray-500'}`} onMouseEnter={() => setLive(item.id)} onMouseLeave={() => setLive(null)} />
                  <div className="relative">
                    <div className={`bg-gray-100 rounded-lg shadow-md absolute top-3 left-[50%] translate-x-[-50%] ${live === item.id ? '' : 'hidden'}`} onMouseEnter={() => setLive(item.id)} onMouseLeave={() => setLive(null)}>
                      <IoMdArrowDropup className='text-gray-100 text-[30px] absolute top-[-18px] left-[50%] translate-x-[-50%]' />
                      <div className='px-5 py-3 flex justify-between items-center gap-4 cursor-pointer duration-300 hover:text-indigo-500'>
                        <span>تعديل</span>
                        <FiEdit />
                      </div>
                      <hr className='text-gray-300' />
                      <div className='px-5 py-3 flex justify-between items-center gap-4 cursor-pointer duration-300 hover:text-red-500 rounded-b-lg'>
                        <span>حذف</span>
                        <MdDelete />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Products