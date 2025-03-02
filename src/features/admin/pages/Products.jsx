import { Link, useNavigate } from 'react-router-dom';
import { TiHome } from "react-icons/ti";
import { Trash, Search } from "lucide-react";
import { useEffect, useState } from 'react';
import { FaCheck } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import axios from '../../../api/axios';
import { useStore } from '../../../context/StoreContext';
import Loading from '../../../shared/components/Loading';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

const Products = () => {
  const { isDelete, setIsDelete } = useAuth();
  const [products, setProducts] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [checkedOrders, setCheckedOrders] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const { loading, setLoading, categories } = useStore();

  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  const handleCheckOrder = (proId) => {
    if (checkedOrders.some(item => item._id === proId)) {
      const newOrders = checkedOrders.filter(item => item._id !== proId);
      setCheckedOrders([...newOrders]);
    } else {
      const newOrders = products.filter(item => item._id === proId);
      setCheckedOrders([...checkedOrders, ...newOrders]);
    }
  }
  const handleSelectAll = () => {
    setCheckedAll(!checkedAll);
    if (!checkedAll) {
      setCheckedOrders(products);
    } else {
      setCheckedOrders([]);
    }
  }

  const getCategory = (cateID) => {
    return categories.map(item => item._id === cateID ? item.name : '');
  }

  const handleDeleteProduct = async (itemID) => {
    try {
      const res = await axios.delete(`/products/${itemID}`);
      setIsDelete({ display: false, itemID: '', itemName: '' });
      toast.success('تم حذف المنتج بنجاح.');
      const remainProducts = products.filter(item => item._id !== itemID);
      setProducts(remainProducts);
    } catch (error) {
      console.error(error);
    }
  }

  const deleteAllProducts = async () => {
    try {
      // Iterate over each product in the array
      for (const product of checkedOrders) {
        // Send a DELETE request for each product using its _id
        await axios.delete(`/products/${product._id}`);
        const remainProducts = products.filter(item => item._id !== product._id)
        setProducts(remainProducts);
        console.log(`Product with _id ${product._id} deleted successfully.`);
      }
      console.log('All products deleted successfully.');
    } catch (error) {
      console.error('Error deleting products:', error);
    }
  };

  const handleEditClick = (productID) => {
    navigate(`/admin/add-product?product=${productID}`);
  };

  useEffect(() => {
    setLoading(true);
    const getAllProducts = async () => {
      try {
        const res = await axios.get('/products');
        console.log(res);
        setProducts(res.data.products);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }

    getAllProducts();
  }, []);

  // useEffect(() => {

  // }, [searchInput]);

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      {/* Search Feature */}
      <div className="custom-bg-white flex flex-col md:flex-row items-center gap-4">
        <div className='flex items-center gap-2 grow'>
          <label htmlFor="product-search" className=''>بحث</label>
          <div className="relative w-full">
            <input type="text" name="product-search" id="product-search" className="custom-input-field w-full" placeholder="بحث عن منتج..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            <Search className="w-20 h-[calc(100%-2px)] my-[1px] ml-[1px] text-2xl p-2 rounded-l-lg bg-gray-100 text-gray-400 absolute top-0 left-0 border border-gray-200" />
          </div>
        </div>
        <button className={`py-3 px-5 rounded-lg shadow-md bg-red-100 text-red-500 hover:bg-red-200 duration-500 ${!checkedOrders.length > 0 ? 'opacity-25' : ''}`} onClick={deleteAllProducts} disabled={!checkedOrders.length > 0}>
          حذف الكل
        </button>
      </div>

      {/* Table */}
      <div className="custom-bg-white mt-8 overflow-x-auto">
        <table className="w-full bg-white">
          <thead className="text-gray-700 border-b border-gray-300 font-bold text-center whitespace-nowrap">
            <tr>
              <th>
                <label className="flex items-center justify-center h-5">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={checkedAll}
                    onChange={handleSelectAll}
                  />
                  <div
                    className={`w-5 h-5 p-1 flex items-center justify-center rounded-sm border duration-500 cursor-pointer ${checkedAll ? "bg-indigo-500 border-indigo-500" : "border-gray-300"
                      }`}
                  >
                    {checkedAll && (
                      <FaCheck className='text-white' />
                    )}
                  </div>
                </label>
              </th>
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
            {products && products.filter(item => item.name.toLowerCase().includes(searchInput.toLowerCase()) ? item : '').map((product) => (
              <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50 text-center">
                <td className='p-3'>
                  <label className="flex items-center justify-center h-5">
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checkedOrders.some(item => item._id === product._id)}
                      onChange={() => handleCheckOrder(product._id)}
                    />
                    <div
                      className={`w-5 h-5 p-1 flex items-center justify-center rounded-sm border duration-500 cursor-pointer ${checkedOrders.some(item => item._id === product._id) ? "bg-indigo-500 border-indigo-500" : "border-gray-300"
                        }`}
                    >
                      {checkedOrders.some(item => item._id === product._id) && (
                        <FaCheck className='text-white' />
                      )}
                    </div>
                  </label>
                </td>
                <td className='p-3'>
                  <div className="w-15 h-15 p-2 rounded-full mx-auto">
                    <img src={`${baseUrl}/${product.mainImage.url.replace(/\\/g, '/')}`} alt={product.mainImage.alt} className='w-full h-full' />
                  </div>
                </td>
                <td className="p-3 space-x-3">
                  {product.name}
                </td>
                <td className="p-3 text-gray-500">
                  {getCategory(product.category)}
                </td>
                <td className="p-3">
                  {/* <span
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
                  </span> */}
                  status
                </td>
                {/* <td className="p-3 text-gray-500">{item.inStock}</td> */}
                <td className="p-3 text-gray-500">instock</td>
                <td className="p-3 font-semibold">{product.price}</td>
                <td className="p-3 font-semibold">{product.discount}</td>
                <td className="p-3 flex items-center">
                  <div className='px-4 py-2 cursor-pointer duration-300 hover:text-indigo-500' onClick={() => handleEditClick(product._id)}>
                    <FaRegEdit className="w-5 h-5" />
                  </div>
                  <div className='px-4 py-2 cursor-pointer duration-300 hover:text-red-500 rounded-b-lg' onClick={() => setIsDelete({ display: true, itemID: product._id, itemName: product.name })}>
                    <Trash className="w-5 h-5" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Toaster toastOptions={{ duration: 7000 }} />

      {/* User Popup */}
      {isDelete.display && (
        <div className='custom-bg-white fixed top-[50%] left-[50%] translate-[-50%] z-80 flex flex-col gap-8 shadow-md'>
          <p className='text-center w-full text-gray-900'>هل انت متأكد من حذف المستخدم: <span className='font-semibold'>{isDelete.username}</span> ؟</p>
          <div className='flex justify-center gap-4'>
            <button type='button' className='w-20 bg-red-500 text-white rounded-full py-2 px-4 duration-500 hover:bg-red-600' onClick={() => handleDeleteProduct(isDelete.itemID)}>yes</button>
            <button type='button' className='w-20 bg-gray-300 text-gray-900 rounded-full py-2 px-4 duration-500 hover:bg-gray-400' onClick={() => setIsDelete({ display: false, itemID: '', itemName: '' })}>No</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products